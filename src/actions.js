/*
 * Action types
 */

export const SET_PLAYBACK_STATE = "SET_PLAYBACK_STATE";
export const SEEK_TO = "SEEK_TO";
export const SET_VIDEO_ID = "SET_VIDEO_ID";

/*
 * Other constants
 */

export const PlaybackStates = {
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  BUFFERING: "BUFFERING"
};

/*
 * Action creators
 */

export function setPlaybackState(playbackState) {
  return { type: SET_PLAYBACK_STATE, playbackState };
}

export function seekTo(seekPosition) {
  return { type: SEEK_TO, seekPosition };
}

export function setVideoId(videoId) {
  return { type: SET_VIDEO_ID, videoId };
}
