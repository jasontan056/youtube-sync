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
  onPlaybackStateChange: ({ playbackState, currentPlayerTime }) =>
    batch(() => {
      dispatch(clientActionCreators.setPlaybackState(playbackState));
      // Only update the seek position in the store if the player has
      // transitioned to a state where it isn't playing.
      if (
        playbackState === ClientPlaybackStates.PAUSED ||
        playbackState === ClientPlaybackStates.BUFFERING ||
        playbackState === ClientPlaybackStates.WAITING
      ) {
        dispatch(clientActionCreators.seekTo(currentPlayerTime));
      }
    }),
  onSeek: (seekPosition) => dispatch(clientActionCreators.seekTo(seekPosition)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);
