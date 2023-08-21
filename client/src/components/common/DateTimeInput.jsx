import React, { useEffect, useState } from "react";
import { Form, Button, Container, Col, Row } from "react-bootstrap";

const DateTimeInput = ({ setTimestamp }) => {
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  const handleDateChange = (event) => {
    setDateInput(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTimeInput(event.target.value);
  };

  useEffect(() => {
    if (dateInput && timeInput) {
      const dateTimeString = `${dateInput} ${timeInput}`;
      const newTimestamp = new Date(dateTimeString).toISOString();
      setTimestamp(newTimestamp);
      console.log(newTimestamp);
    } else {
      // Handle the case when either date or time is missing
      console.log("Please enter both date and time.");
    }
  }, [dateInput, timeInput]);

  return (
    <Row>
      <Col>
        <Form.Group controlId="dateInput">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={dateInput}
            onChange={handleDateChange}
            required
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="timeInput">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            value={timeInput}
            onChange={handleTimeChange}
            required
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default DateTimeInput;
