import React from "react";
import { action } from "@storybook/addon-actions";
import TextInput from "./TextInput";
import { withKnobs, text } from "@storybook/addon-knobs";

export default {
  component: TextInput,
  title: "TextInput",
  decorators: [withKnobs],
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/
};

export const actionsData = {
  onSubmit: action("onSubmit")
};

export const Default = () => <TextInput {...actionsData} />;

export const WithAllProps = () => (
  <TextInput
    placeholder={text("placeholder", "placeholder")}
    {...actionsData}
  />
);
