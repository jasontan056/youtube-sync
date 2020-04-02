import React from "react";
import { action } from "@storybook/addon-actions";
import YoutubeWrapper from "./YoutubeWrapper";
import { withKnobs, text, number } from "@storybook/addon-knobs";
import { PlaybackStates } from "../actions";

export default {
  component: YoutubeWrapper,
  title: "YoutubeWrapper",
  decorators: [withKnobs],
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/
};

export const actionsData = {
  onPlaybackStateChange: action("onPlaybackStateChange"),
  onSeek: action("onSeek")
};

export const Default = () => <YoutubeWrapper {...actionsData} />;

export const WithAllProps = () => (
  <YoutubeWrapper
    videoId={text("videoId", "qQjMMEWaWsc")}
    playbackState={text("playbackState", PlaybackStates.PLAYING)}
    seekPosition={number("seekPosition", 30)}
    width={number("width", 640)}
    height={number("height", 480)}
    {...actionsData}
  />
);
