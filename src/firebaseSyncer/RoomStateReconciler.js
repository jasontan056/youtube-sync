import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect, batch } from "react-redux";
import { desiredActionCreators, RoomPlaybackStates } from "../actions";
import { PlaybackStates } from "../actions";
import Firebase from "../Firebase";

/**
 * Reconciles room state into a desired state.
 */
const RoomStateReconciler = ({
  playbackState,
  isBuffering,
  seekPosition,
  videoId,
  playStartTimestamp,
  onDesiredStateChange,
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
    if (serverTimeOffset === null) {
      return;
    }

    let desiredPlaybackState;
    if (isBuffering) {
      desiredPlaybackState = PlaybackStates.BUFFERING;
    } else {
      if (playbackState === RoomPlaybackStates.PLAYING) {
        desiredPlaybackState = PlaybackStates.PLAYING;
      } else {
        desiredPlaybackState = PlaybackStates.PAUSED;
      }
    }

    /**
     * Calculate the current seek position. Seek positions are not updated while
     * playing, so we must estimate the seek position based on the amount of time
     * the video has been playing.
     */
    let desiredSeekPosition;
    if (playbackState === PlaybackStates.PLAYING) {
      const estimatedServerTimestamp = new Date().getTime() + serverTimeOffset;
      const elapsedTimeSec =
        (playStartTimestamp - estimatedServerTimestamp) / 1000;
      desiredSeekPosition = seekPosition + elapsedTimeSec;
    } else {
      desiredSeekPosition = seekPosition;
    }

    onDesiredStateChange({
      playbackState: desiredPlaybackState,
      seekPosition: desiredSeekPosition,
      videoId,
    });
  }, [
    isBuffering,
    onDesiredStateChange,
    playStartTimestamp,
    playbackState,
    seekPosition,
    serverTimeOffset,
    videoId,
  ]);

  return <div>Room state reconciler</div>;
};

RoomStateReconciler.propTypes = {
  playbackState: PropTypes.oneOf(Object.values(RoomPlaybackStates)).isRequired,
  seekPosition: PropTypes.number,
  videoId: PropTypes.string,
  playStartTimestamp: PropTypes.number,
  onDesiredStateChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  playbackState: state.room.playbackState,
  seekPosition: state.room.seekPosition,
  videoId: state.room.videoId,
  playStartTimestamp: state.room.playStartTimestamp,
  isBuffering: Object.keys(state.room.usersBuffering).length > 0,
});

const mapDispatchToProps = (dispatch) => ({
  onDesiredStateChange: ({ playbackState, seekPosition, videoId }) =>
    batch(() => {
      dispatch(desiredActionCreators.setPlaybackState(playbackState));
      dispatch(desiredActionCreators.seekTo(seekPosition));
      dispatch(desiredActionCreators.setVideoId(videoId));
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomStateReconciler);
