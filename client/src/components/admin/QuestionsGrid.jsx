import React from "react";
import { Spinner } from "react-bootstrap";

const QuestionGrid = ({
  questions,
  openQuestion,
  activeNumber,
  isLoading,
  createQuestion,
}) => {

  const handleCreateNewQuestion = async () => {
    const number = questions.length + 1;
    await createQuestion.mutate(number);
  };

  return isLoading && activeNumber ? (
    <Spinner className="spinner-div" variant="light" />
  ) : (
    <>
      <div className="number-grid-container">
        <div className="number-grid">
          {questions?.map((question, index) => (
            <div
              key={index}
              className={`number-cell ${
                parseInt(activeNumber) === index + 1 && "active"
              } ${" "}
              ${!question.status && "incompleted"}
              ${" "}
              ${question.isDeleted && "deleted"}
              `}
              onClick={() => openQuestion(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      <div
        className={`create-new-question-btn`}
        onClick={handleCreateNewQuestion}
        disabled={createQuestion.isLoading}
      >
        Add Question
      </div>
    </>
  );
};

export default QuestionGrid;
