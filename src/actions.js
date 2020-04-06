import { createActions } from "redux-actions";

/*
 * Other constants
 */
export const ClientPlaybackStates = {
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  BUFFERING: "BUFFERING",
  WAITING: "WAITING",
  OTHER: "OTHER",
};

export const RoomPlaybackStates = {
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
};

export const PlaybackStates = {
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  BUFFERING: "BUFFERING",
};

/*
 * Action creators
 */
export const {
  setRoomId,
  client: clientActionCreators,
  desired: desiredActionCreators,
  room: roomActionCreators,
} = createActions({
  SET_ROOM_ID: (roomId) => ({ roomId }),
  CLIENT: {
    SET_PLAYBACK_STATE: (playbackState) => ({ playbackState }),
    SEEK_TO: (seekPosition) => ({ seekPosition }),
    SET_VIDEO_ID: (videoId) => ({ videoId }),
    SET_PLAYER_LOADING: (playerLoading) => ({ playerLoading }),
  },
  DESIRED: {
    SET_PLAYBACK_STATE: (playbackState) => ({ playbackState }),
    SEEK_TO: (seekPosition) => ({ seekPosition }),
    SET_VIDEO_ID: (videoId) => ({ videoId }),
  },
  ROOM: {
    SET_PLAYBACK_STATE: (playbackState) => ({ playbackState }),
    SEEK_TO: (seekPosition) => ({ seekPosition }),
    SET_VIDEO_ID: (videoId) => ({ videoId }),
    SET_PLAY_START_TIMESTAMP: (playStartTimestamp) => ({ playStartTimestamp }),
    ADD_USER_BUFFERING: (userId) => ({ userId }),
    REMOVE_USER_BUFFERING: (userId) => ({ userId }),
  },
});
