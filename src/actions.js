import { createActions } from "redux-actions";

/*
 * Other constants
 */
export const PlaybackStates = {
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  BUFFERING: "BUFFERING",
  OTHER: "OTHER",
};

/*
 * Action creators
 */
export const { setPlaybackState, seekTo, setVideoId } = createActions({
  SET_PLAYBACK_STATE: (playbackState) => ({ playbackState }),
  SEEK_TO: (seekPosition) => ({ seekPosition }),
  SET_VIDEO_ID: (videoId) => ({ videoId }),
});
