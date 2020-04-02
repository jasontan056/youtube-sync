import React from "react";
import { action } from "@storybook/addon-actions";
import TextInput from "./TextInput";

export default {
  component: TextInput,
  title: "TextInput",
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/
};

export const actionsData = {
  onSubmit: action("onSubmit")
};

export const Default = () => <TextInput {...actionsData} />;
