import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { roomActionCreators } from "../actions";
import Firebase from "../Firebase";

/**
 * Listens to room state changes in the Firebase DB and updates the room state
 * in Redux.
 */
const DbToStoreSyncer = ({
  roomId,
  onVideoIdChange,
  onPlaybackStateChange,
  onSeekChange,
  onPlayStartTimestampChange,
  onUserBufferingAdded,
  onUserBufferingRemoved,
}) => {
  useEffect(() => {
    const roomRef = Firebase.database().ref(`room/${roomId}`);
    const videoIdRef = roomRef.child("videoId");
    videoIdRef.on("value", (snapshot) => {
      const videoId = snapshot.val();
      if (!videoId) {
        return;
      }
      onVideoIdChange(videoId);
    });

    const playbackStateRef = roomRef.child("playbackState");
    playbackStateRef.on("value", (snapshot) => {
      const playbackState = snapshot.val();
      if (!playbackState) {
        return;
      }
      onPlaybackStateChange(playbackState);
    });

    const seekPositionRef = roomRef.child("seekPosition");
    seekPositionRef.on("value", (snapshot) => {
      const seekPosition = snapshot.val();
      if (!seekPosition) {
        return;
      }
      onSeekChange(seekPosition);
    });

    const playStartTimestampRef = roomRef.child("playStartTimestamp");
    playStartTimestampRef.on("value", (snapshot) => {
      const playStartTimestamp = snapshot.val();
      if (!playStartTimestamp) {
        return;
      }
      onPlayStartTimestampChange(playStartTimestamp);
    });

    const usersBufferingRef = roomRef.child("usersBuffering");
    usersBufferingRef.on("child_added", (data) => {
      const userId = data.key;
      onUserBufferingAdded(userId);
    });
    usersBufferingRef.on("child_removed", (data) => {
      const userId = data.key;
      onUserBufferingRemoved(userId);
    });

    return function cleanup() {
      videoIdRef.off();
      playbackStateRef.off();
      seekPositionRef.off();
      playStartTimestampRef.off();
      usersBufferingRef.off();
    };
  }, [
    onPlayStartTimestampChange,
    onPlaybackStateChange,
    onSeekChange,
    onUserBufferingAdded,
    onUserBufferingRemoved,
    onVideoIdChange,
    roomId,
  ]);
  return <div>DbToStoreSyncer</div>;
};

DbToStoreSyncer.propTypes = {
  roomId: PropTypes.string.isRequired,
  onVideoIdChange: PropTypes.func.isRequired,
  onPlaybackStateChange: PropTypes.func.isRequired,
  onSeekChange: PropTypes.func.isRequired,
  onPlayStartTimestampChange: PropTypes.func.isRequired,
  onUserBufferingAdded: PropTypes.func.isRequired,
  onUserBufferingRemoved: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  roomId: state.roomId,
});

const mapDispatchToProps = (dispatch) => ({
  onVideoIdChange: (videoId) =>
    dispatch(roomActionCreators.setVideoId(videoId)),
  onPlaybackStateChange: (state) =>
    dispatch(roomActionCreators.setPlaybackState(state)),
  onSeekChange: (seekPosition) =>
    dispatch(roomActionCreators.seekTo(seekPosition)),
  onPlayStartTimestampChange: (playStartTimestamp) =>
    dispatch(roomActionCreators.setPlayStartTimestamp(playStartTimestamp)),
  onUserBufferingAdded: (userId) =>
    dispatch(roomActionCreators.addUserBuffering(userId)),
  onUserBufferingRemoved: (userId) =>
    dispatch(roomActionCreators.removeUserBuffering(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DbToStoreSyncer);
