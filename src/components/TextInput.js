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
    <form onSubmit={onSubmit} className="w-full max-w-sm">
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        />
      <input type="submit" value="Submit" className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" />
      </div>
    </form>
  );
}

TextInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};
