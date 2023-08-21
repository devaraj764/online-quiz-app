import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { FaCheck, FaRegistered, FaUsers } from "react-icons/fa";
import ScoreTable from "../../components/admin/ScoreTable";
import { useParams } from "react-router-dom";
import { getScoreBoard } from "../../api/test";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

function ScoreBoard() {
  const { testid } = useParams();
  const [scores, setScores] = useState([]);
  const [test, setTest] = useState();
  const [timestamp, setTimestamp] = useState(Date.now());

  const getScoreBoardQuery = useQuery({
    queryKey: "/test/get-score-board",
    queryFn: () => testid && getScoreBoard(testid, { timestamp }),
    onError: (err) => toast.warning(err.message, { autoClose: 500 }),
    onSuccess: (data) => {
      console.log(data);
      if (!data) return;
      setScores((scores) => [...scores, ...data.scores]);
      setTest(data.test);
      setTimestamp(data.scores[data.scores.length - 1].updatedAt);
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return getScoreBoardQuery.isLoading ? (
    <FullScreenLoader message={"Loading scores..."} />
  ) : (
    <div className="score-board py-3">
      <Container>
        <div className="flex-between mb-3">
          <h2 className="m-0">Weekly Test 1</h2>
          <div className="d-flex gap-2">
            <h4
              style={{
                margin: 0,
                backgroundColor: "#000",
                color: "#fff",
                padding: "5px 10px",
              }}
            >
              {test?.totalMarks} Marks
            </h4>
          </div>
        </div>
        <div className="quick-actions-grid-container mb-3">
          <div className="quick-actions-grid-item">
            <FaRegistered
              size={52}
              className="quick-actions-icon"
              style={{ color: "#007fff" }}
            />
            <h5 className="m-0">
              {getScoreBoardQuery.data.regCount} Registrations
            </h5>
          </div>
          <div className="quick-actions-grid-item">
            <FaUsers
              size={52}
              className="quick-actions-icon"
              style={{ color: "orange" }}
            />
            <h5 className="m-0">
              {getScoreBoardQuery.data.participants} Participants
            </h5>
          </div>
          <div className="quick-actions-grid-item">
            <FaCheck
              size={52}
              className="quick-actions-icon"
              style={{ color: "green" }}
            />
            <h5 className="m-0">{getScoreBoardQuery.data.passed} Passed</h5>
          </div>
        </div>
        <ScoreTable scores={scores} sections={test?.sections} />
      </Container>
    </div>
  );
}

export default ScoreBoard;
