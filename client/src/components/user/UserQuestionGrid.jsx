import React from "react";
import { Button, Spinner } from "react-bootstrap";

const UserQuestionGrid = ({
  questions,
  handleOpenQuestion,
  activeNumber,
  isLoading,
  isSubmitted,
}) => {
  return isLoading && activeNumber ? (
    <Spinner className="spinner-div" variant="light" />
  ) : (
    <>
      <div className="number-grid">
        {questions?.map((question, index) => (
          <div
            key={index}
            className={`number-cell ${
              parseInt(activeNumber) === index + 1 && "active"
            } ${" "}
              ${
                question?.answer?.answerStatus === "not-answered" &&
                !isSubmitted &&
                "not-answered"
              }${" "}
              ${question?.answer?.isMarked && !isSubmitted && "marked"}${" "}
              ${
                question?.answer?.answerStatus === "answered" &&
                !isSubmitted &&
                "answered"
              }
              `}
            onClick={() => handleOpenQuestion(index || 0)}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div
        className="d-flex gap-3"
        style={{
          position: "fixed",
          bottom: "10px",
          maxWidth: "360px",
          width: "100%",
        }}
      >
        <Button
          variant="outline-light"
          style={{ width: "100%" }}
          disabled={activeNumber <= 1}
          onClick={() => handleOpenQuestion(parseInt(activeNumber) - 2)}
        >
          Previous
        </Button>
        <Button
          variant="outline-light"
          style={{ width: "100%" }}
          disabled={activeNumber >= questions.length}
          onClick={() => handleOpenQuestion(parseInt(activeNumber))}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default UserQuestionGrid;
