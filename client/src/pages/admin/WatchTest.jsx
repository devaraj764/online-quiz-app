import React, { useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getWatchTestDetails, updateTestById } from "../../api/test";
import { toast } from "react-toastify";
import Timer from "../../components/common/Timer";
import ConfirmModal from "../../components/common/ConfirmModal";
import { FaRegistered, FaShare } from "react-icons/fa";
import { registerTest, unregisterTest } from "../../api/registration";
import PublishButton from "../../components/admin/PublishButton";
import {
  MdOutlineIntegrationInstructions,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import formatDate from "../../helpers/formatDate";
import CountdownTimer from "../../components/common/CountDownTimer";
import { openPopUpWindow } from "../../components/user/UserTests";
import TestInstrictions from "../../components/user/TestInstrictions";

function WatchTest() {
  const { testid } = useParams();
  const [test, setTest] = useState();
  const currentURL = window.location.href;
  const domainURL = currentURL.substring(0, currentURL.indexOf("/", 8));
  const navigate = useNavigate();
  const [showWriteTestBtn, setShowWriteTestBtn] = useState(false);

  // queries
  const getTestDetails = useQuery({
    queryKey: "/watch/get-test-details",
    enabled: testid ? true : false,
    queryFn: () => getWatchTestDetails({ testid }),
    onSuccess: (data) => {
      if (data?.test) {
        setTest(data.test);
      }
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const shareTest = async () => {
    if (!test) return;
    await navigator.share({
      title: test?.testName,
      text: `${test?.totalMarks} Marks, ${test?.questionsCount} Questions, ${test?.testDuration}min long`,
      url: `${domainURL}/test/view/${testid}`,
    });
  };

  const registerMutation = useMutation({
    mutationFn: () =>
      registerTest(testid, { totalQuestions: test?.questionsCount }),
    onSuccess: (data) => {
      getTestDetails.refetch();
      toast.success(data.message, { autoClose: 500 });
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const unRegisterMutation = useMutation({
    mutationFn: () => unregisterTest(testid),
    onSuccess: (data) => {
      getTestDetails.refetch();
      toast.success(data.message, { autoClose: 500 });
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const unpublishMutation = useMutation({
    mutationFn: async () => {
      await updateTestById({ status: "unpublished" }, testid);
    },
    onSuccess: (data) => {
      navigate(`/admin/test/edit/${testid}`);
      toast.success("Unpublished", { autoClose: 500 });
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const endTestMutation = useMutation({
    mutationFn: async () => {
      await updateTestById({ status: "completed" }, testid);
    },
    onSuccess: (data) => {
      navigate(`/admin/test/details/${testid}`);
      toast.success("Unpublished", { autoClose: 500 });
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const bombFn = () => {
    setShowWriteTestBtn(true);
  };

  const handleWriteTest = async () => {
    if (!test?.isRegistered) {
      await registerMutation.mutate();
    }
    openPopUpWindow(`/test/write/${testid}`);
  };
  return getTestDetails.isLoading || !test ? (
    <Spinner className="spinner-div" />
  ) : (
    <div className="watch-test py-3">
      <Container>
        <div className="flex-between">
          <h3 className="heading">{test?.testName}</h3>
          {test?.isEditor && (
            <div className="d-flex gap-3">
              <ConfirmModal
                confirmFn={unpublishMutation.mutate}
                title="Unpublish"
                variant="outline-danger"
              >
                <Alert variant="danger">
                  Want to unpublsih <b>{test?.testName}</b>
                </Alert>
              </ConfirmModal>
              <PublishButton title={"Reschedule"} />
            </div>
          )}
        </div>
        <br />
        <div className="quick-actions-grid-container mb-3">
          <div className="quick-actions-grid-item">
            <FaRegistered
              size={52}
              className="quick-actions-icon"
              style={{ color: "#007fff" }}
            />
            <h5 className="m-0">{test?.registrations} Registrations</h5>
          </div>
          <div className="quick-actions-grid-item">
            {!showWriteTestBtn ? (
              <div className="quick-actions-icon">
                <Timer timestamp={test.startTime} bombFn={bombFn} />
              </div>
            ) : (
              <div className="quick-actions-icon">
                <Timer timestamp={test.endTime} bombFn={bombFn} />
              </div>
            )}
            <h5 className="m-0">
              {showWriteTestBtn ? "Test Started & Ends In" : " Start In"}
            </h5>
          </div>
          <div className="quick-actions-grid-item">
            {test?.isEditor ? (
              <Button
                variant="danger"
                style={{ minWidth: "200px", marginBottom: "10px" }}
                onClick={endTestMutation.mutate}
              >
                End Test
              </Button>
            ) : showWriteTestBtn ? (
              test?.isRegistered ? (
                <Button
                  variant="primary"
                  style={{ minWidth: "200px", marginBottom: "10px" }}
                  onClick={() => navigate(`/user/dashboard`)}
                >
                  <MdOutlineModeEditOutline size={18} /> Write Test
                </Button>
              ) : (
                <Button
                  variant="danger"
                  style={{ minWidth: "200px", marginBottom: "10px" }}
                  onClick={unRegisterMutation.mutate}
                >
                  UnRegister
                </Button>
              )
            ) : (
              <Button
                variant="success"
                style={{ minWidth: "200px", marginBottom: "10px" }}
                onClick={registerMutation.mutate}
              >
                Register
              </Button>
            )}
            <Button
              variant="outline-primary"
              style={{ minWidth: "200px" }}
              onClick={shareTest}
            >
              <FaShare /> &nbsp; Share
            </Button>
          </div>
        </div>
        <br />
        <h6 className="sub-title mb-2">
          <MdOutlineIntegrationInstructions size={24} /> &nbsp; Instructions
        </h6>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          <ul style={{ fontSize: "20px" }}>
            <li>Total Questions in test {test?.questionsCount}</li>
            <li>Test Duration {test?.testDuration} min</li>
            <li>Last Date for ending test is {formatDate(test?.endTime)}</li>
            <li>Test is for {test?.totalMarks} marks</li>
            <li>Test pass marks are {test?.passMark}</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}

export default WatchTest;
