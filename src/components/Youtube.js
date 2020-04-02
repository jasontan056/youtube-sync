import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import { PlaybackStates } from "../actions";

export default function Youtube({
  onPlaybackStateChange,
  onSeek,
  videoId = "",
  playbackState = PlaybackStates.PAUSED,
  seekPosition = 0,
  width = 640,
  height = 480
}) {
  const [youtubeTarget, setYoutubeTarget] = useState(null);

  const youtubePlayerOpts = {
    height: height,
    width: width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start: seekPosition
    }
  };

  const onReady = useCallback(event => {
    setYoutubeTarget(event.target);
  }, []);

  const onStateChange = useCallback(
    event => {
      let newPlaybackState;
      switch (event.data) {
        case YouTube.PlayerState.PLAYING:
          newPlaybackState = PlaybackStates.PLAYING;
          break;
        case YouTube.PlayerState.BUFFERING:
          newPlaybackState = PlaybackStates.BUFFERING;
          break;
        default:
          // Every other state is just interpreted as paused.
          newPlaybackState = PlaybackStates.PAUSED;
      }

      onPlaybackStateChange(newPlaybackState);
    },
    [onPlaybackStateChange]
  );

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
    const interval = 500;
    const margin = 500;
    const checkTime = () => {
      const playerCurrentTime = youtubeTarget.getCurrentTime();
      if (lastTime !== -1) {
        let expectedTime;
        if (youtubeTarget.getPlayerState() === YouTube.PlayerState.PLAYING) {
          expectedTime = lastTime + interval / 1000;
        } else {
          expectedTime = lastTime;
        }

        if (Math.abs(playerCurrentTime - expectedTime) > margin / 1000) {
          onSeek(playerCurrentTime);
        }
      }

      lastTime = playerCurrentTime;
      timer = setTimeout(checkTime, interval);
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
  height: PropTypes.number
};
