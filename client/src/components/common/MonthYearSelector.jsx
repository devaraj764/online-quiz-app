import React, { useState, useEffect } from "react";
import moment from "moment";
import { Button, Form } from "react-bootstrap";

const MonthSelector = ({ setTimestamps }) => {
  const today = moment();
  const [selectedMonth, setSelectedMonth] = useState(today);
  const [startOfMonth, setStartOfMonth] = useState(
    today.clone().startOf("month")
  );
  const [endOfMonth, setEndOfMonth] = useState(today.clone().endOf("month"));

  const handleNextMonth = () => {
    setSelectedMonth(selectedMonth.clone().add(1, "month"));
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(selectedMonth.clone().subtract(1, "month"));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth((prev) => prev.clone().month(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedMonth((prev) => prev.clone().year(e.target.value));
  };

  useEffect(() => {
    console.log("Selected Month Changed:", selectedMonth.format("MMMM YYYY"));
    setStartOfMonth(selectedMonth.clone().startOf("month").valueOf());
    setEndOfMonth(selectedMonth.clone().endOf("month").valueOf());
  }, [selectedMonth]);

  useEffect(() => {
    if (startOfMonth && endOfMonth) {
      const timestamps = {
        startTimestamp: startOfMonth,
        endTimestamp: endOfMonth,
      };
      setTimestamps(timestamps);
    }
  }, [startOfMonth, endOfMonth, setTimestamps]);

  const yearsBefore = 10; // Number of years to go back before the current year
  const startingYear = today.year() - yearsBefore;
  const yearOptions = Array.from(
    { length: yearsBefore + 1 },
    (_, index) => startingYear + index
  );

  return (
    <div className="flex-between mb-3" style={{ width: "100%" }}>
      <div className="d-flex gap-2">
        <Form.Select
          value={selectedMonth.month().toString()}
          onChange={handleMonthChange}
        >
          {moment.months().map((month, index) => (
            <option key={month} value={index.toString()}>
              {month}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          value={selectedMonth.year().toString()}
          onChange={handleYearChange}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </Form.Select>
      </div>
      <div>
        <Button
          variant="outline-dark"
          onClick={handlePreviousMonth}
          disabled={selectedMonth.isSameOrAfter(
            today.clone().endOf("year"),
            "month"
          )}
        >
          Previous Month
        </Button>{" "}
        <Button
          variant="outline-dark"
          onClick={handleNextMonth}
          disabled={selectedMonth.isSameOrAfter(
            today.clone().month("year"),
            "month"
          )}
        >
          Next Month
        </Button>
      </div>
    </div>
  );
};

export default MonthSelector;
