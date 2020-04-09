import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import { PlaybackStates, ClientPlaybackStates } from "../actions";
import { usePrevious } from "../utilities/hooks";

// Only change player's seek position if it's off by more than this threshold.
const SEEK_THRESHOLD_SECONDS = 1.5;
// Polling interval check if video position has changed due to a seek.
const SEEK_POLL_INTERVAL = 500;
// When loading a video, we will retry to play the video at this interval.
const PLAY_RETRY_INTERVAL = 500;
// Margin of acceptable error between expected and actual current video position.
// Needs to be relatively high because of weirdness when the page isn't in focus.
const MARGIN = 1500;

const LoadingStates = {
  LOADING_VIDEO: "LOADING_VIDEO",
  UPDATING: "UPDATING",
  NOT_LOADING: "NOT_LOADING",
};

export default function Youtube({
  onPlaybackStateChange,
  onSeek,
  videoId = "",
  playbackState = PlaybackStates.PAUSED,
  seekPosition = 0,
}) {
  const prevVideoId = usePrevious(videoId);
  const prevPlaybackState = usePrevious(playbackState);
  const prevSeekPosition = usePrevious(seekPosition);

  const [youtubeTarget, setYoutubeTarget] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(LoadingStates.NOT_LOADING);
  const [curClientPlayerState, setCurClientPlayerState] = useState(null);
  const [curClientSeekPosition, setCurClientSeekPosition] = useState(null);

  const onReady = useCallback((event) => {
    setYoutubeTarget(event.target);
  }, []);

  // Sets curClientPlayerState based on the state of the internal Youtube player.
  const setClientStateFromInternal = useCallback(
    (event) => {
      const internalPlayerState = event.data;

      switch (internalPlayerState) {
        case YouTube.PlayerState.PLAYING:
          setCurClientPlayerState(ClientPlaybackStates.PLAYING);
          break;
        case YouTube.PlayerState.PAUSED:
          // Client's playback state is only considered paused if we didn't
          // pause it programatically in a BUFFERING state.
          if (playbackState === PlaybackStates.BUFFERING) {
            setCurClientPlayerState(ClientPlaybackStates.WAITING);
          } else {
            setCurClientPlayerState(ClientPlaybackStates.PAUSED);
          }
          break;
        case YouTube.PlayerState.BUFFERING:
          setCurClientPlayerState(ClientPlaybackStates.BUFFERING);
          break;
        default:
          setCurClientPlayerState(ClientPlaybackStates.OTHER);
      }
    },
    [playbackState]
  );

  // Use timer to detect if seek position has changed.
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
          expectedTime = lastTime + SEEK_POLL_INTERVAL / 1000;
        } else {
          expectedTime = lastTime;
        }

        if (Math.abs(playerCurrentTime - expectedTime) > MARGIN / 1000) {
          setCurClientSeekPosition(playerCurrentTime);
        }
      }

      lastTime = playerCurrentTime;
    };
    let timer = setInterval(checkTime, SEEK_POLL_INTERVAL);
    return () => {
      clearInterval(timer);
    };
  }, [youtubeTarget]);

  // React to changes in the videoId, playbackState, and seekPosition.
  // If these properties change, player will move into the LOADING_VIDEO or UPDATING
  // loading stages.
  useEffect(() => {
    if (!youtubeTarget) {
      return;
    }

    if (videoId !== prevVideoId || !initialized) {
      setLoading(LoadingStates.LOADING_VIDEO);
      // If video ID changed, then current  player state and seek position are
      // meaningless so set them to null.
      setCurClientPlayerState(null);
      setCurClientSeekPosition(null);
      youtubeTarget.loadVideoById({
        videoId: videoId,
        startSeconds: seekPosition,
      });
      // Need to play video after loading a new video otherwise the internal player
      // will get stuck in the OTHER state.
      youtubeTarget.playVideo();
    } else if (
      seekPosition !== prevSeekPosition ||
      playbackState !== prevPlaybackState
    ) {
      setLoading(LoadingStates.UPDATING);
    }

    setInitialized(true);
  }, [
    initialized,
    playbackState,
    prevPlaybackState,
    prevSeekPosition,
    prevVideoId,
    seekPosition,
    videoId,
    youtubeTarget,
  ]);

  // Checks if LOADING_VIDEO stage is complete.
  // LOADING_VIDEO stage can be considered complete when the video is PLAYING.
  useEffect(() => {
    if (loading !== LoadingStates.LOADING_VIDEO || !youtubeTarget) {
      return;
    }

    let timer;
    if (curClientPlayerState === ClientPlaybackStates.PLAYING) {
      setLoading(LoadingStates.UPDATING);
    } else {
      // Player can get stuck in OTHER state after loading a new video.
      // Keep trying to play.
      timer = setInterval(() => youtubeTarget.playVideo(), PLAY_RETRY_INTERVAL);
    }

    return () => clearInterval(timer);
  }, [curClientPlayerState, loading, youtubeTarget]);

  // Checks if UPDATING stage is complete. Tries to make changes  to seek
  // and  playback state until internal player sufficiently matches the props.
  useEffect(() => {
    if (loading !== LoadingStates.UPDATING || !youtubeTarget) {
      return;
    }

    let playbackStateCorrect = false;
    switch (playbackState) {
      case PlaybackStates.PLAYING:
        if (curClientPlayerState === ClientPlaybackStates.PLAYING) {
          playbackStateCorrect = true;
        } else {
          youtubeTarget.playVideo();
        }
        break;
      case PlaybackStates.PAUSED:
        if (curClientPlayerState === ClientPlaybackStates.PAUSED) {
          playbackStateCorrect = true;
        } else {
          youtubeTarget.pauseVideo();
        }
        break;
      case PlaybackStates.BUFFERING:
        if (
          curClientPlayerState === ClientPlaybackStates.BUFFERING ||
          curClientPlayerState === ClientPlaybackStates.WAITING
        ) {
          playbackStateCorrect = true;
        } else {
          // If the player isn't actually buffering, pause the video to get into the
          // WAITING state.
          youtubeTarget.pauseVideo();
        }
        break;
      default:
        throw new Error("Unknown playback state as prop.");
    }

    let seekPositionCorrect = false;
    if (
      Math.abs(youtubeTarget.getCurrentTime() - seekPosition) >
      SEEK_THRESHOLD_SECONDS
    ) {
      youtubeTarget.seekTo(seekPosition);
    } else {
      seekPositionCorrect = true;
    }

    if (playbackStateCorrect && seekPositionCorrect) {
      setLoading(LoadingStates.NOT_LOADING);
    }
  }, [
    curClientPlayerState,
    loading,
    playbackState,
    seekPosition,
    youtubeTarget,
  ]);

  const notifyPlayerState = useCallback(() => {
    if (curClientPlayerState === null) {
      return;
    }

    if (loading === LoadingStates.LOADING_VIDEO) {
      // Don't send any state changes when loading a new video.
      return;
    } else if (loading === LoadingStates.UPDATING) {
      // If we are in the updating stage, don't fire off any notifications
      // for any state changes other than BUFFERING and WAITING.
      if (
        !(
          curClientPlayerState === ClientPlaybackStates.BUFFERING ||
          curClientPlayerState === ClientPlaybackStates.WAITING
        )
      ) {
        return;
      }
    }

    onPlaybackStateChange({
      playbackState: curClientPlayerState,
      currentPlayerTime: youtubeTarget.getCurrentTime(),
    });
  }, [curClientPlayerState, loading, onPlaybackStateChange, youtubeTarget]);

  // Send player state changes to the onPlaybackStateChange callback.
  useEffect(notifyPlayerState, [curClientPlayerState]);

  const notifyPlayerSeekPosition = useCallback(() => {
    if (
      loading !== LoadingStates.NOT_LOADING ||
      curClientSeekPosition === null
    ) {
      return;
    }

    onSeek(curClientSeekPosition);
  }, [curClientSeekPosition, loading, onSeek]);

  // Send seek position changes to the onSeek callback.
  useEffect(notifyPlayerSeekPosition, [curClientSeekPosition]);

  return (
    <YouTube
      videoId={videoId}
      onReady={onReady}
      onStateChange={setClientStateFromInternal}
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
