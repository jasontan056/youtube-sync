import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { desiredActionCreators } from "../actions";
import { PlaybackStates } from "../actions";
import Firebase from "../Firebase";

/**
 * Reconciles room state into a desired state.
 */
const RoomStateReconciler = ({
  playbackState,
  seekPosition,
  videoId,
  playStartTimestamp,
  onVideoIdChange,
  onPlaybackStateChange,
  onSeekChange,
}) => {
  const [serverTimeOffset, setServerTimeOffset] = useState(null);

  // Subscribe to get estimated server time offset from firebase.
  useEffect(() => {
    const offsetRef = Firebase.database().ref(".info/serverTimeOffset");
    offsetRef.on("value", (snapshot) => {
      setServerTimeOffset(snapshot.val());
    });
    return function cleanup() {
      offsetRef.off();
    };
  }, []);

  useEffect(() => {
    onPlaybackStateChange(playbackState);
  }, [onPlaybackStateChange, playbackState]);

  useEffect(() => {
    onVideoIdChange(videoId);
  }, [onVideoIdChange, videoId]);

  /**
   * Calculate the current seek position. Seek positions are not updated while
   * playing, so we must estimate the seek position based on the amount of time
   * the video has been playing.
   */
  useEffect(() => {
    if (serverTimeOffset === null) {
      return;
    }

    let newSeekPosition;
    if (playbackState === PlaybackStates.PLAYING) {
      const estimatedServerTimestamp = new Date().getTime() + serverTimeOffset;
      const elapsedTimeSec =
        (playStartTimestamp - estimatedServerTimestamp) / 1000;
      newSeekPosition = seekPosition + elapsedTimeSec;
    } else {
      newSeekPosition = seekPosition;
    }
    onSeekChange(newSeekPosition);
  }, [
    seekPosition,
    playbackState,
    playStartTimestamp,
    serverTimeOffset,
    onSeekChange,
  ]);

  return <div>Room state reconciler</div>;
};

RoomStateReconciler.propTypes = {
  playbackState: PropTypes.oneOf(Object.values(PlaybackStates)).isRequired,
  seekPosition: PropTypes.number.isRequired,
  videoId: PropTypes.string.isRequired,
  playStartTimestamp: PropTypes.number.isRequired,
  onVideoIdChange: PropTypes.func.isRequired,
  onPlaybackStateChange: PropTypes.func.isRequired,
  onSeekChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  playbackState: state.room.playbackState,
  seekPosition: state.room.seekPosition,
  videoId: state.room.videoId,
  playStartTimestamp: state.room.playStartTimestamp,
});

const mapDispatchToProps = (dispatch) => ({
  onVideoIdChange: (videoId) =>
    dispatch(desiredActionCreators.setVideoId(videoId)),
  onPlaybackStateChange: (state) =>
    dispatch(desiredActionCreators.setPlaybackState(state)),
  onSeekChange: (seekPosition) =>
    dispatch(desiredActionCreators.seekTo(seekPosition)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomStateReconciler);
