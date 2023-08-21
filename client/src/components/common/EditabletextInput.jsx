import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const EditableTextInput = ({ defaultValue, styles, changeFn, fieldName }) => {
  const [editable, setEditable] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setText(defaultValue);
  }, [defaultValue]);

  const handleFocus = () => {
    setEditable(true);
  };

  const handleBlur = () => {
    setEditable(false);
  };

  // Set the delay in milliseconds after typing stops before saving
  const saveDelay = 1000; // 1 second

  // Function to handle text change
  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    setIsTyping(true);
  };

  // Function to save the text when typing is stopped
  const saveChanges = () => {
    setIsTyping(false);
    // Perform your save operation here (e.g., API call to save the text)
    if (changeFn) changeFn(fieldName, text);
    console.log("Saved:", text);
  };

  useEffect(() => {
    let timer;
    if (isTyping) {
      // Set a timer to save the changes after the delay
      timer = setTimeout(saveChanges, saveDelay);
    } else {
      // Clear the timer if user starts typing again before the delay
      clearTimeout(timer);
    }

    // Clean up the timer on unmount to avoid memory leaks
    return () => clearTimeout(timer);

    // eslint-disable-next-line
  }, [isTyping, text]);

  return (
    <Form.Control
      type="text"
      value={text}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      readOnly={!editable}
      style={{
        width: "fit-content",
        ...styles,
        border: "none",
        borderBottom: editable ? "1px solid #007fff" : "1px solid #ccc",
        borderRadius: 0,
        backgroundColor: "#0000",
      }}
      className="editable-text-input"
    />
  );
};

export default EditableTextInput;
