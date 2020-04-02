import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import TextInput from "./TextInput";

export default function YoutubeLinkInput(props) {
  const [renderError, setRenderError] = useState(false);

  let placeholder;
  if (props.videoId) {
    placeholder = `https://www.youtube.com/watch?v=${props.videoId}`;
  } else {
    placeholder = "Enter link to Youtube video";
  }

  const onSubmit = useCallback(
    value => {
      let matches = value.match(/.*youtube.com.*v=([^&]*)/);
      if (matches) {
        const videoId = matches[1];
        setRenderError(false);
        props.onSubmit(videoId);
      } else {
        setRenderError(true);
      }
    },
    [props]
  );

  return (
    <div>
      <TextInput onSubmit={onSubmit} placeholder={placeholder} />
      {renderError ? <p>Invalid Youtube link!</p> : null}
    </div>
  );
}

YoutubeLinkInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  videoId: PropTypes.string
};
