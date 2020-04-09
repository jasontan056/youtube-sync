import {
  ClientPlaybackStates,
  PlaybackStates,
  setRoomId,
  clientActionCreators,
  desiredActionCreators,
  roomActionCreators,
} from "./actions";
import { handleAction, handleActions } from "redux-actions";
import { combineReducers } from "redux";

const roomId = handleAction(
  setRoomId,
  (state, { payload: { roomId } }) => roomId,
  null
);

const client = combineReducers({
  playbackState: handleAction(
    clientActionCreators.setPlaybackState,
    (state, { payload: { playbackState } }) => playbackState,
    null
  ),
  seekPosition: handleAction(
    clientActionCreators.seekTo,
    (state, { payload: { seekPosition } }) => seekPosition,
    null
  ),
  videoId: handleAction(
    clientActionCreators.setVideoId,
    (state, { payload: { videoId } }) => videoId,
    null
  ),
});

const desired = combineReducers({
  playbackState: handleAction(
    desiredActionCreators.setPlaybackState,
    (state, { payload: { playbackState } }) => playbackState,
    PlaybackStates.PAUSED
  ),
  seekPosition: handleAction(
    desiredActionCreators.seekTo,
    (state, { payload: { seekPosition } }) => seekPosition,
    0
  ),
  videoId: handleAction(
    desiredActionCreators.setVideoId,
    (state, { payload: { videoId } }) => videoId,
    null
  ),
});

const usersBuffering = handleActions(
  {
    [roomActionCreators.addUserBuffering]: (
      state,
      { payload: { userId } }
    ) => ({
      ...state,
      [userId]: true,
    }),
    [roomActionCreators.removeUserBuffering]: (
      state,
      { payload: { userId } }
    ) => {
      const { [userId]: removedVal, ...otherUsers } = state;
      return otherUsers;
    },
  },
  {}
);

const room = combineReducers({
  playbackState: handleAction(
    roomActionCreators.setPlaybackState,
    (state, { payload: { playbackState } }) => playbackState,
    PlaybackStates.PAUSED
  ),
  seekPosition: handleAction(
    roomActionCreators.seekTo,
    (state, { payload: { seekPosition } }) => seekPosition,
    0
  ),
  videoId: handleAction(
    roomActionCreators.setVideoId,
    (state, { payload: { videoId } }) => videoId,
    null
  ),
  playStartTimestamp: handleAction(
    roomActionCreators.setPlayStartTimestamp,
    (state, { payload: { playStartTimestamp } }) => playStartTimestamp,
    null
  ),
  usersBuffering,
});

export default combineReducers({ roomId, client, desired, room });
