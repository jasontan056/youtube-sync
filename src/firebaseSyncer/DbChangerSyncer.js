import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { roomActionCreators, PlaybackStates } from "../actions";

export const DbChangerSyncer = ({
  roomId,
  onPlaybackStateChange,
  onSeekChange,
  onVideoIdChange,
  onPlayStartTimestampChange,
  onUserBufferingAdded,
  onUserBufferingRemoved,
}) => {
  useEffect(() => {}, [roomId]);
  return <div>dbChangeSyncer</div>;
};

DbChangerSyncer.propTypes = {
  roomId: PropTypes.string.isRequired,
  onPlaybackStateChange: PropTypes.func.isRequired,
  onSeekChange: PropTypes.func.isRequired,
  onVideoIdChange: PropTypes.func.isRequired,
  onPlayStartTimestampChange: PropTypes.func.isRequired,
  onUserBufferingAdded: PropTypes.func.isRequired,
  onUserBufferingRemoved: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  roomId: state.roomId,
});

const mapDispatchToProps = (dispatch) => ({
  onPlaybackStateChange: (state) =>
    dispatch(roomActionCreators.setPlaybackState(state)),
  onSeekChange: (seekPosition) =>
    dispatch(roomActionCreators.seekTo(seekPosition)),
  onVideoIdChange: (videoId) =>
    dispatch(roomActionCreators.setVideoId(videoId)),
  onPlayStartTimestampChange: (playStartTimestamp) =>
    dispatch(roomActionCreators.setPlayStartTimestamp(playStartTimestamp)),
  onUserBufferingAdded: (userId) =>
    dispatch(roomActionCreators.addUserBuffering(userId)),
  onUserBufferingRemoved: (userId) =>
    dispatch(roomActionCreators.removeUserBuffering(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DbChangerSyncer);
