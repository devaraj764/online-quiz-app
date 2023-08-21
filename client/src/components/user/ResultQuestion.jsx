import React from "react";
import { Form } from "react-bootstrap";
import { MdCheck, MdClose } from "react-icons/md";

function ResultQuestion({ questionNumber, question }) {
  return (
    <div className="edit-question">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h4 className="heading">Question {questionNumber}</h4>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="sub-title">{question?.marksAssigned} marks</div>
          {question?.correctOption === question?.answer?.chooseOption ? (
            <div
              className="status-box correct-answer"
              style={{ width: "fit-content" }}
            >
              <MdCheck size={24} /> &nbsp; Correct
            </div>
          ) : (
            <div
              className="status-box wrong-answer"
              style={{ width: "fit-content" }}
            >
              <MdClose size={24} /> &nbsp; Wrong
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className="mt-3">
        <h3>{question?.title}</h3>
        <Form.Group className="mt-2">
          <Form.Label className="sub-title">Options:</Form.Label>

          {question?.options.map((option, index) => (
            <div
              className={` px-2 mb-2
            ${
              question.correctOption === index + 1
                ? "correct-answer-option"
                : question?.answer?.chooseOption === index + 1 &&
                  "wrong-answer-option"
            }
              `}
              key={index}
            >
              <Form.Check
                type="radio"
                label={option}
                name="option"
                value={option}
                checked={question?.answer?.chooseOption === index + 1}
                onChange={() => null}
                key={index}
                style={{ fontSize: "20px" }}
              />
            </div>
          ))}
        </Form.Group>
      </div>
    </div>
  );
}

export default ResultQuestion;
