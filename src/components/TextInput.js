import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

export default function TextInput({ placeholder, ...props }) {
  const [value, setValue] = useState("");

  const onChange = useCallback(event => {
    setValue(event.target.value);
  }, []);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      props.onSubmit(value);
    },
    [props, value]
  );

  return (
    <form onSubmit={onSubmit}>
      <label>
        Name:
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

TextInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};
