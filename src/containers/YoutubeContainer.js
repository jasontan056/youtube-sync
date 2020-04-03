import { connect } from "react-redux";
import { clientActionCreators } from "../actions";
import Youtube from "../components/Youtube";

const mapStateToProps = (state, ownProps) => ({
  videoId: state.desired.videoId,
  playbackState: state.desired.playbackState,
  seekPosition: state.desired.seekPosition,
  width: ownProps.width,
  height: ownProps.height,
});

const mapDispatchToProps = (dispatch) => ({
  onPlaybackStateChange: (state) =>
    dispatch(clientActionCreators.setPlaybackState(state)),
  onSeek: (seekPosition) => dispatch(clientActionCreators.seekTo(seekPosition)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);
