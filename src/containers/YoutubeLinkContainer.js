import { connect } from "react-redux";
import { clientActionCreators } from "../actions";
import YoutubeLinkInput from "../components/YoutubeLinkInput";

const mapStateToProps = (state) => ({
  videoId: state.desired.videoId,
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (videoId) => dispatch(clientActionCreators.setVideoId(videoId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeLinkInput);
