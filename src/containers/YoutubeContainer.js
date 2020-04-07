import { connect, batch } from "react-redux";
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
  onPlaybackStateChange: ({ playbackState, currentPlayerTime }) =>
    batch(() => {
      dispatch(clientActionCreators.setPlaybackState(playbackState));
      dispatch(clientActionCreators.seekTo(currentPlayerTime));
    }),
  onSeek: (seekPosition) => dispatch(clientActionCreators.seekTo(seekPosition)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);
