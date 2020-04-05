import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import { PlaybackStates, ClientPlaybackStates } from "../actions";

// Only change player's seek position if it's off by more than this threshold.
const SEEK_THRESHOLD_SECONDS = 2;
// Poll every INTERVAL to check if video position has changed due to a seek.
const INTERVAL = 500;
// Margin of acceptable error between expected and actual current video position.
// Needs to be relatively high because of weirdness when the page isn't in focus.
const MARGIN = 1500;

export default function Youtube({
  onPlaybackStateChange,
  onSeek,
  videoId = "",
  playbackState = PlaybackStates.PAUSED,
  seekPosition = 0,
  width = 640,
  height = 480,
}) {
  // Hack: Save youtube player opts as state so that changing seekPosition doesn't
  // cause the youtube player reload.
  // Note: height and width props aren't respected after initial render.
  const [youtubePlayerOpts] = useState({
    height: height,
    width: width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start: seekPosition,
    },
  });
  const [youtubeTarget, setYoutubeTarget] = useState(null);
  const stateChangeTimerRef = useRef(null);

  // Update player's seek position if seekPosition prop is updated.
  useEffect(() => {
    if (!youtubeTarget) {
      return;
    }

    const playerCurrentTime = youtubeTarget.getCurrentTime();
    if (Math.abs(playerCurrentTime - seekPosition) > SEEK_THRESHOLD_SECONDS) {
      youtubeTarget.seekTo(seekPosition);
    }
  }, [youtubeTarget, seekPosition]);

  const onReady = useCallback((event) => {
    setYoutubeTarget(event.target);
  }, []);

  // Notify callbacks of the current state of the Youtube Player.
  const notifyPlayerStateChange = useCallback(() => {
    if (!youtubeTarget) {
      throw new Error("Youtube player missing.");
    }

    let clientPlaybackState;
    switch (youtubeTarget.getPlayerState()) {
      case YouTube.PlayerState.PLAYING:
        clientPlaybackState = ClientPlaybackStates.PLAYING;
        break;
      case YouTube.PlayerState.PAUSED:
        // Client's playback state is only considered paused if we didn't
        // pause it programatically in a BUFFERING state.
        if (playbackState === PlaybackStates.BUFFERING) {
          clientPlaybackState = ClientPlaybackStates.WAITING;
        } else {
          clientPlaybackState = ClientPlaybackStates.PAUSED;
        }
        break;
      case YouTube.PlayerState.BUFFERING:
        clientPlaybackState = ClientPlaybackStates.BUFFERING;
        break;
      default:
        clientPlaybackState = ClientPlaybackStates.OTHER;
    }

    onPlaybackStateChange({
      playbackState: clientPlaybackState,
      currentPlayerTime: youtubeTarget.getCurrentTime(),
    });
  }, [onPlaybackStateChange, playbackState, youtubeTarget]);

  /**
   * React to changes in the Youtube Player's state.
   *
   * Whenever the youtube player's state changes, set a timer to later determine
   * the player's state and notify its callback functions.
   *
   * This is to reduce the state change notifications and eliminate the noisy
   * transitional states.
   */
  const onPlayerStateChange = useCallback(() => {
    if (!youtubeTarget) {
      throw new Error("Youtube player missing.");
    }

    // If its supposed to be buffering but the video is ready to play, just
    // pause and go into a WAITING state.
    if (
      youtubeTarget.getPlayerState() === YouTube.PlayerState.PLAYING &&
      playbackState === PlaybackStates.BUFFERING
    ) {
      youtubeTarget.pauseVideo();
    }

    // Set a timer to notify callbacks of the state change.
    if (stateChangeTimerRef.current) {
      clearTimeout(stateChangeTimerRef.current);
    }
    stateChangeTimerRef.current = setTimeout(notifyPlayerStateChange, INTERVAL);
  }, [notifyPlayerStateChange, playbackState, youtubeTarget]);

  // Control the youtube player based on the playbackState prop.
  useEffect(() => {
    if (!youtubeTarget) {
      return;
    }

    switch (playbackState) {
      case PlaybackStates.PLAYING:
        youtubeTarget.playVideo();
        break;
      case PlaybackStates.PAUSED:
        youtubeTarget.pauseVideo();
        break;
      case PlaybackStates.BUFFERING:
        // If the player isn't actually buffering, pause the video.
        if (youtubeTarget.getPlayerState() !== YouTube.PlayerState.BUFFERING) {
          youtubeTarget.pauseVideo();
        }
        break;
      default:
        throw new Error("Unknown playback state as prop.");
    }
  }, [playbackState, youtubeTarget, onPlaybackStateChange]);

  // Use timer to detect if user seeked to a different position.
  useEffect(() => {
    if (!youtubeTarget) {
      return;
    }

    let lastTime = -1;
    const checkTime = () => {
      const playerCurrentTime = youtubeTarget.getCurrentTime();
      if (lastTime !== -1) {
        let expectedTime;
        if (youtubeTarget.getPlayerState() === YouTube.PlayerState.PLAYING) {
          expectedTime = lastTime + INTERVAL / 1000;
        } else {
          expectedTime = lastTime;
        }

        if (Math.abs(playerCurrentTime - expectedTime) > MARGIN / 1000) {
          onSeek(playerCurrentTime);
        }
      }

      lastTime = playerCurrentTime;
    };
    let timer = setInterval(checkTime, INTERVAL);
    return () => {
      clearInterval(timer);
    };
  }, [onSeek, youtubeTarget]);

  return (
    <YouTube
      videoId={videoId}
      opts={youtubePlayerOpts}
      onReady={onReady}
      onStateChange={onPlayerStateChange}
    />
  );
}

Youtube.propTypes = {
  onPlaybackStateChange: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  videoId: PropTypes.string,
  playbackState: PropTypes.oneOf(Object.values(PlaybackStates)),
  seekPosition: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};
