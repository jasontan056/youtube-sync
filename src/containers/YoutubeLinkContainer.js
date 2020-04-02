import { connect } from "react-redux";
import { setVideoId } from "../actions";
import YoutubeLinkInput from "../components/YoutubeLinkInput";

const mapStateToProps = state => ({
  videoId: state.videoId
});

const mapDispatchToProps = dispatch => ({
  onSubmit: videoId => dispatch(setVideoId(videoId))
});

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeLinkInput);
