import React, { useEffect, useState } from "react";

function QuestionsNumberStatus({ questions }) {
  const [notVisited, setNotVisited] = useState(0);
  const [notAnswered, setNotAnswered] = useState(0);
  const [marked, setMarked] = useState(0);
  const [answered, setAnswered] = useState(0);

  useEffect(() => {
    const filterQuestions = (value) => {
      return questions.filter((q) => q.answer?.answerStatus === value).length;
    };

    console.log(questions);
    if (questions) {
      setNotVisited(filterQuestions(null));
      setNotAnswered(filterQuestions("not-answered"));
      setMarked(filterQuestions("marked"));
      setAnswered(filterQuestions("answered"));
    }
  }, [questions]);

  return (
    <div className="d-flex align-items-center justify-content-end questions-status gap-3">
      <div className="status-div d-flex gap-2 align-items-center">
        <div className="status-box not-visited">{notVisited}</div>
        <div className="sub-title">Not Visited</div>
      </div>
      <div className="status-div d-flex gap-2 align-items-center">
        <div className="status-box not-answred">{notAnswered}</div>
        <div className="sub-title">Not Answered</div>
      </div>
      <div className="status-div d-flex gap-2 align-items-center">
        <div className="status-box marked-for-review">{marked}</div>
        <div className="sub-title">Marked for Review</div>
      </div>
      <div className="status-div d-flex gap-2 align-items-center">
        <div className="status-box saved">{answered}</div>
        <div className="sub-title">Saved Answers</div>
      </div>
    </div>
  );
}

export default QuestionsNumberStatus;
