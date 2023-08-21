import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { createAnswer, updateAnswer } from "../../api/answer";

function WatchQuestion({
  data,
  activeNumber,
  isLoading,
  handleOpenQuestion,
  islastQuestion,
  regid,
  changeStatus,
}) {
  const [selectedOption, setSelectedOption] = useState();
  const [question, setQuestion] = useState();
  const [status, setStatus] = useState("not-answered");
  const [marked, setMarked] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSelectedOption();
    setStatus("not-answered");
    setMarked(false);
    setDirty(false);
    if (data) setQuestion(data);
    if (data?.answer) {
      if (data?.answer?.chooseOption && data?.answer?.chooseOption !== -1) {
        setSelectedOption(parseInt(data?.answer?.chooseOption));
        setDirty(true);
      } else {
        setSelectedOption("");
        setDirty(false);
      }
      if (data?.answer?.answerStatus) setStatus(data?.answer?.answerStatus);
      if (data?.answer?.isMarked === true) setMarked(data?.answer?.isMarked);
    }
  }, [data]);

  const handleOptionChange = async (event) => {
    if (!dirty) setDirty(true);
    const option = parseInt(event.target.value);
    setSelectedOption(option);
    await updateAnswerMutation({
      chooseOption: option,
      answerStatus: "not-answered",
    });
    setStatus('not-answered')
    changeStatus("not-answered");
    setDirty(true);
  };

  const updateAnswerMutation = async (data) => {
    try {
      if (question?.answer?._id) await updateAnswer(data, question.answer?._id);
      else if (question?._id && regid)
        await createAnswer({ ...data, questionid: question?._id, regid });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearResponse = async () => {
    await updateAnswerMutation({
      chooseOption: -1,
      answerStatus: "not-answered",
    });
    setStatus('not-answered');
    changeStatus("not-answered");
    setSelectedOption("");
    setDirty(false);
  };

  const handleMarkQuestion = async () => {
    await updateAnswerMutation({
      isMarked: true,
    });
    setMarked(true)
    changeStatus("marked")
  };

  const handleUnMarkQuestion = async () => {
    await updateAnswerMutation({
      isMarked: false,
    });
    setMarked(false)
    changeStatus("marked")
  };

  const handeleSaveAnswer = async () => {
    await updateAnswerMutation({
      answerStatus: "answered",
    });
    setStatus('answered')

    changeStatus("answered");
    if (!islastQuestion) handleOpenQuestion(parseInt(activeNumber));
  };

  return isLoading ? (
    <Spinner className="spinner-div" />
  ) : (
    <div className="edit-question">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h4 className="heading">Question {activeNumber}</h4>
        </div>
        <div className="sub-title">{question?.marksAssigned} Marks</div>
      </div>
      <hr />
      <div className="mt-3">
        <h3>{question?.title}</h3>
        <Form.Group className="mt-2">
          <Form.Label className="sub-title">Options:</Form.Label>

          {question?.options.map((option, index) => (
            <Form.Check
              type="radio"
              label={option}
              name="optionGroup1"
              value={index + 1}
              checked={selectedOption === index + 1}
              onChange={handleOptionChange}
              key={index}
              style={{ fontSize: "20px" }}
            />
          ))}
        </Form.Group>
        <div className="flex-between mt-4">
          {dirty && (
            <>
              <div className="d-flex gap-4" style={{ margin: 0 }}>
                <Button
                  style={{ minWidth: "100px" }}
                  variant="outline-secondary"
                  onClick={handleClearResponse}
                >
                  Clear Response
                </Button>
                {marked ? (
                  <Button
                    style={{ minWidth: "100px" }}
                    variant="outline-danger"
                    onClick={handleUnMarkQuestion}
                  >
                    Unmark
                  </Button>
                ) : (
                  <Button
                    style={{ minWidth: "100px" }}
                    variant="warning"
                    onClick={handleMarkQuestion}
                  >
                    Mark for Review
                  </Button>
                )}
              </div>
              <div className="d-flex gap-4" style={{ margin: 0 }}>
                <Button
                  style={{ minWidth: "100px" }}
                  variant="success"
                  disabled={status === "answered"}
                  onClick={handeleSaveAnswer}
                >
                  {status !== "answered"
                    ? islastQuestion === false
                      ? "Save and Next"
                      : "Save"
                    : "Saved"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchQuestion;
