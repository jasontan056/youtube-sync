import React, { useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";

export default function Room() {
  const { roomId } = useParams();
  const [youtubeTarget, setYoutubeTarget] = useState(null);

  const youtubePlayerOpts = {
    height: "576",
    width: "1024",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const onReady = (event) => {
    setYoutubeTarget(event.target);
  };

  const videoId = "qQjMMEWaWsc";
  return (
    <div>
      <p>In room page for {roomId}</p>
      <YouTube videoId={videoId} opts={youtubePlayerOpts} onReady={onReady} />
    </div>
  );
}
