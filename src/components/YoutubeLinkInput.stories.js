import React from "react";
import { action } from "@storybook/addon-actions";
import YoutubeLinkInput from "./YoutubeLinkInput";
import { withKnobs, text } from "@storybook/addon-knobs";

export default {
  component: YoutubeLinkInput,
  title: "YoutubeLinkInput",
  decorators: [withKnobs],
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/
};

export const actionsData = {
  onSubmit: action("onSubmit")
};

export const Default = () => <YoutubeLinkInput {...actionsData} />;

export const WithAllProps = () => (
  <YoutubeLinkInput videoId={text("videoId", "qQjMMEWaWsc")} {...actionsData} />
);
