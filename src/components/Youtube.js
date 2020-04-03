import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import { PlaybackStates, ClientPlaybackStates } from "../actions";

// Only change player's seek position if it's off by more than this threshold.
const SEEK_THRESHOLD_SECONDS = 1;
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

  // React to when the youtube player's state changes.
  const onStateChange = useCallback(
    (event) => {
      let newPlaybackState;
      switch (event.data) {
        case YouTube.PlayerState.PLAYING:
          newPlaybackState = ClientPlaybackStates.PLAYING;
          break;
        case YouTube.PlayerState.PAUSED:
          newPlaybackState = ClientPlaybackStates.PAUSED;
          break;
        case YouTube.PlayerState.BUFFERING:
          newPlaybackState = ClientPlaybackStates.BUFFERING;
          break;
        default:
          newPlaybackState = ClientPlaybackStates.OTHER;
      }

      onPlaybackStateChange(newPlaybackState);
    },
    [onPlaybackStateChange]
  );

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
        const currentState = youtubeTarget.getPlayerState();
        // If the player isn't actually buffering, pause the video.
        if (currentState !== YouTube.PlayerState.BUFFERING) {
          youtubeTarget.pauseVideo();
        }
        break;
      default:
        throw new Error("Unknown playback state as prop.");
    }
  }, [playbackState, youtubeTarget]);

  // Use timer to detect if user seeked to a different position.
  useEffect(() => {
    if (!youtubeTarget) {
      return;
    }

    let timer = null;
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
      timer = setTimeout(checkTime, INTERVAL);
    };

    checkTime();
    return () => {
      clearTimeout(timer);
    };
  }, [onSeek, youtubeTarget]);

  return (
    <YouTube
      videoId={videoId}
      opts={youtubePlayerOpts}
      onReady={onReady}
      onStateChange={onStateChange}
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
