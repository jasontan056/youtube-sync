import {
  PlaybackStates,
  SET_PLAYBACK_STATE,
  SEEK_TO,
  SET_VIDEO_ID
} from "./actions";

const initialState = {
  playbackState: PlaybackStates.PAUSED,
  seekPosition: 0,
  videoId: null
};

export default function syncingPlayerApp(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYBACK_STATE:
      return Object.assign({}, state, {
        playbackState: action.playbackState
      });
    case SEEK_TO:
      return Object.assign({}, state, {
        seekPosition: action.seekPosition
      });
    case SET_VIDEO_ID:
      return Object.assign({}, state, {
        videoId: action.videoId
      });
    default:
      return state;
  }
}
