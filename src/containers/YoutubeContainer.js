import { connect } from "react-redux";
import { setPlaybackState, seekTo } from "../actions";
import Youtube from "../components/Youtube";

const mapStateToProps = (state, ownProps) => ({
  videoId: state.videoId,
  playbackState: state.playbackState,
  seekPosition: state.seekPosition,
  width: ownProps.width,
  height: ownProps.height
});

const mapDispatchToProps = dispatch => ({
  onPlaybackStateChange: state => dispatch(setPlaybackState(state)),
  onSeek: seekPosition => dispatch(seekTo(seekPosition))
});

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);
