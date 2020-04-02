import React from "react";
import { action } from "@storybook/addon-actions";
import Youtube from "./Youtube";
import { withKnobs, text, number } from "@storybook/addon-knobs";
import { PlaybackStates } from "../actions";

export default {
  component: Youtube,
  title: "Youtube",
  decorators: [withKnobs],
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/
};

export const actionsData = {
  onPlaybackStateChange: action("onPlaybackStateChange"),
  onSeek: action("onSeek")
};

export const Default = () => <Youtube {...actionsData} />;

export const WithAllProps = () => (
  <Youtube
    videoId={text("videoId", "qQjMMEWaWsc")}
    playbackState={text("playbackState", PlaybackStates.PLAYING)}
    seekPosition={number("seekPosition", 30)}
    width={number("width", 640)}
    height={number("height", 480)}
    {...actionsData}
  />
);
