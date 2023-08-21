import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

function TestInstrictions({ testid, closeFn, children, instructions }) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    if (closeFn) closeFn();
    setShow(false);
  };

  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={() => setShow(true)}>
        {children}
      </div>
      <Modal
        backdrop={!closeFn ? true : "static"}
        size="xl"
        show={show}
        onHide={handleClose}
      >
        <Modal.Body style={{ overflowY: "auto", maxHeight: "90vh" }}>
          <div className="d-flex d-flex sub-title">
            <MdOutlineIntegrationInstructions size={24} /> &nbsp; Instructions
          </div>
          <ol
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          >
            <li className="mt-1 mb-1">
              The clock will be set at the server. The countdown timer in the
              top right corner of screen will display the remaining time
              available for you to complete the examination. When the timer
              reaches zero, the examination will end by itself. You will not be
              required to end or submit your examination.
            </li>
            <li className="mt-1 mb-1">
              Switching Tabs will automatically submit your response. Even
              though the Test window is in background.
            </li>
            <li className="mt-2 mb-1">
              The Question Palette displayed on the right side of screen will
              show the status of each question using one of the following
              symbols:
              <br />
              <div>
                <div className="status-div d-flex gap-2 align-items-center mb-2 mt-2">
                  <div className="status-box not-visited">20</div>
                  <div className="sub-title">Not Visited</div>
                </div>
                <div className="status-div d-flex gap-2 align-items-center mb-2 mt-2">
                  <div className="status-box not-answred">10</div>
                  <div className="sub-title">Visited but Not Answered</div>
                </div>
                <div className="status-div d-flex gap-2 align-items-center mb-2 mt-2">
                  <div className="status-box marked-for-review">6</div>
                  <div className="sub-title">
                    Answered and Marked for Review
                  </div>
                </div>
                <div className="status-div d-flex gap-2 align-items-center mb-2 mt-2">
                  <div className="status-box saved">6</div>
                  <div className="sub-title">Answered And Saved</div>
                </div>
              </div>
            </li>
            <li className="mt-2 mb-2">
              The Question palette is on the right side of the screen.
            </li>
            <h6 className="heading">
              Navigating From One Question to Another Question:
            </h6>
            <li className="mt-2 mb-2">
              To answer a question, do the following:
              <br /> a) Click on the question number in the Question Palette at
              the right of your screen to go to that numbered question directly.
              Note that using this option does NOT save your answer to the
              current question.
              <br />
              b) Click on Save & Next to save your answer for the current
              question and then go to the next question.
              <br />
              c) Click on Mark for Review & Next to save your answer for the
              current question, mark it for review, and then go to the next
              question.
              <br />
            </li>
            <h6 className="heading">Answering a Question :</h6>
            <li className="mb-2 mt-2">
              Procedure for answering a multiple choice type question: <br />
              a) To answer a question, Click on the button against the chosen
              option among the given four options.
              <br />
              b) To change your chosen answer, click on the button of another
              option.
              <br />
              c) To deselect your chosen answer, click on the button of the
              chosen option again or click on the Clear Response button. <br />
              d) To save your answer, you MUST click on the Save & Next button.{" "}
              <br />
              e) To mark the question for review, click on the Mark for Review &
              Next button. If an answer is selected for a question that is
              Marked for Review, that answer will be considered in the
              evaluation.
            </li>
            <li className="mb-2 mt-2">
              Note that ONLY Questions for which answers are saved or marked for
              review after answering will be considered for evaluation.
            </li>
            <h6 className="heading">Navigating through sections:</h6>
            <li className="mb-2 mt-2">
              Various section names in this question paper are displayed on the
              top bar of the screen. Questions in a section can be viewed by
              clicking on the section name. The section name you are currently
              viewing is highlighted.
            </li>
            <li className="mb-2 mt-2">
              After clicking the Save & Next button on the last question for a
              section, you will automatically be taken to the first question of
              the next section.
            </li>
            <li className="mb-2 mt-2">
              You can shuffle between sections (subjects) and questions anytime
              during the examination as per your convenience only during the
              time stipulated.
            </li>
          </ol>
          {instructions && (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                margin: "10px 0",
              }}
              dangerouslySetInnerHTML={{ __html: instructions }}
            ></div>
          )}
          {closeFn && (
            <div className="d-flex justify-content-end">
              <Button variant="success" onClick={handleClose}>
                Okay!
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TestInstrictions;
