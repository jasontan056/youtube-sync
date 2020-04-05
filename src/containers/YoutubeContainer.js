import { connect, batch } from "react-redux";
import { clientActionCreators, ClientPlaybackStates } from "../actions";
import Youtube from "../components/Youtube";

const mapStateToProps = (state, ownProps) => ({
  videoId: state.desired.videoId,
  playbackState: state.desired.playbackState,
  seekPosition: state.desired.seekPosition,
  width: ownProps.width,
  height: ownProps.height,
});

const mapDispatchToProps = (dispatch) => ({
  onPlaybackStateChange: (playbackState, playerCurrentTime) =>
    batch(() => {
      dispatch(clientActionCreators.setPlaybackState(playbackState));
      if (
        playbackState !== ClientPlaybackStates.PLAYING &&
        playbackState !== ClientPlaybackStates.OTHER
      ) {
        console.log(`playerCurrentTime: ${playerCurrentTime}`);
        dispatch(clientActionCreators.seekTo(playerCurrentTime));
      }
    }),
  onSeek: (seekPosition) => dispatch(clientActionCreators.seekTo(seekPosition)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);
