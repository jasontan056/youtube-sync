import {
  PlaybackStates,
  setPlaybackState,
  seekTo,
  setVideoId,
} from "./actions";
import { handleAction } from "redux-actions";
import { combineReducers } from "redux";

const playbackState = handleAction(
  setPlaybackState,
  (state, { payload: { playbackState } }) => playbackState,
  PlaybackStates.PAUSED
);
const seekPosition = handleAction(
  seekTo,
  (state, { payload: { seekPosition } }) => seekPosition,
  0
);
const videoId = handleAction(
  setVideoId,
  (state, { payload: { videoId } }) => videoId,
  null
);

export default combineReducers({ playbackState, seekPosition, videoId });
