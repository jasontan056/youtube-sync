import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, batch } from "react-redux";
import { roomActionCreators, RoomPlaybackStates } from "../actions";
import Firebase from "../Firebase";

/**
 * Listens to room state changes in the Firebase DB and updates the room state
 * in Redux.
 */
const DbToStoreSyncer = ({ roomId, onRoomStateChange }) => {
  useEffect(() => {
    const roomRef = Firebase.database().ref(`room/${roomId}`);
    let prevUsersBuffering = new Set();
    roomRef.on("value", (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const room = snapshot.val();
      let newUsersBuffering = [];
      let removedUsersBuffering = [];
      if (room.usersBuffering) {
        const usersBuffering = new Set(Object.keys(room.usersBuffering));
        newUsersBuffering = [...usersBuffering].filter(
          (userId) => !prevUsersBuffering.has(userId)
        );
        removedUsersBuffering = [...prevUsersBuffering].filter(
          (userId) => !usersBuffering.has(userId)
        );
        prevUsersBuffering = usersBuffering;
      } else {
        removedUsersBuffering = [...prevUsersBuffering];
        prevUsersBuffering = new Set();
      }

      onRoomStateChange({
        playbackState: room.playbackState,
        seekPosition: room.seekPosition,
        videoId: room.videoId,
        playStartTimestamp: room.playStartTimestamp,
        newUsersBuffering,
        removedUsersBuffering,
      });
    });
    return () => {
      roomRef.off();
    };
  }, [onRoomStateChange, roomId]);

  return <div>DbToStoreSyncer</div>;
};

DbToStoreSyncer.propTypes = {
  roomId: PropTypes.string.isRequired,
  onRoomStateChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  roomId: ownProps.roomId,
});

const mapDispatchToProps = (dispatch) => ({
  onRoomStateChange: ({
    playbackState = RoomPlaybackStates.PAUSED,
    seekPosition = 0,
    videoId = null,
    playStartTimestamp = null,
    newUsersBuffering = [],
    removedUsersBuffering = [],
  }) =>
    batch(() => {
      dispatch(roomActionCreators.setPlaybackState(playbackState));
      dispatch(roomActionCreators.seekTo(seekPosition));
      dispatch(roomActionCreators.setVideoId(videoId));
      dispatch(roomActionCreators.setPlayStartTimestamp(playStartTimestamp));
      for (let userId of newUsersBuffering) {
        dispatch(roomActionCreators.addUserBuffering(userId));
      }
      for (let userId of removedUsersBuffering) {
        dispatch(roomActionCreators.removeUserBuffering(userId));
      }
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DbToStoreSyncer);
