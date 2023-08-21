import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import WatchQuestion from "../../components/user/WatchQuestion";
import UserQuestionGrid from "../../components/user/UserQuestionGrid";
import TestInstrictions from "../../components/user/TestInstrictions";
import CountdownTimer from "../../components/common/CountDownTimer";
import QuestionsNumberStatus from "../../components/user/QuestionsNumberStatus";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  MdAddAlert,
  MdInfo,
  MdOutlineIntegrationInstructions,
} from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import {
  getRegistrationDetails,
  submitTest,
  updateReistrationById,
} from "../../api/registration";
import { toast } from "react-toastify";
import { getItem, storeItem } from "../../helpers/store";
import { findQuestionById, getQuestionsWithAnswers } from "../../api/question";
import { createAnswer } from "../../api/answer";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import ConfirmModal from "../../components/common/ConfirmModal";

function randomizeArray(arr) {
  const randomized = [...arr]; // Create a shallow copy of the array
  for (let i = randomized.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
  }
  return randomized;
}

function UserTestPage() {
  const { regid } = useParams();
  const [test, setTest] = useState();
  const [registration, setRegistration] = useState();
  const [countDown, setCountDown] = useState();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Disable cut, copy, and paste events
    document.addEventListener("cut", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("paste", preventDefault);

    // Disable right-click context menu
    document.addEventListener("contextmenu", preventDefault);

    // Disable text selection on the protected element
    const protectedElement = document.getElementById("protectedElement");
    if (protectedElement) {
      protectedElement.addEventListener("selectstart", preventDefault);
    }

    // tab switch detect
    const handleVisibilityChange = async () => {
      if (registration) {
        updateRegistration.mutate({
          tabSwitches: registration?.tabSwitches + 1,
        });
        submitTestMutation.mutate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Clean up the event listeners when the component unmounts
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("paste", preventDefault);
      document.removeEventListener("contextmenu", preventDefault);
      if (protectedElement) {
        protectedElement.removeEventListener("selectstart", preventDefault);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line
  }, []);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const defaultSection = queryParams.get("section");
  const questionNumber = queryParams.get("question");
  const [activeNumber, setActiveNumber] = useState(questionNumber || 1);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [islastQuestion, setisLastQuestion] = useState(true);

  const [section, setSection] = useState(defaultSection);

  const getRegistrationDetailsQuery = useQuery({
    queryKey: "/regisration/get-registration-details",
    enabled: regid ? true : false,
    queryFn: () => getRegistrationDetails({ id: regid }),
    onSuccess: async (data) => {
      if (data?.registration) {
        setRegistration(data?.registration);
        setTest(data.registration.test);
        setSection(defaultSection || data.registration.test.sections[0]);
        const lastStoredDuration = await getItem({ key: regid });
        setCountDown(
          parseInt(lastStoredDuration) || data.registration.test.testDuration
        );
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const getQuestionsMutation = useMutation({
    mutationFn: async () =>
      await getQuestionsWithAnswers({
        testid: test?._id,
        section: section || test?.sections[0],
        regid: registration?._id,
      }),
    onSuccess: async (data) => {
      setQuestions([]);
      console.log(data);
      if (!data) return;
      const ques = await randomizeArray(data.questions);
      setQuestions(ques);
      setisLastQuestion(ques.length);
    },
  });

  const openQuestion = async (number) => {
    if (section) navigate(`.?section=${section}&question=${number}`);
    else navigate(`.?question=${number}`);
  };

  const handleOpenQuestion = async (index, data) => {
    try {
      if (questions[index]?.answer === null) {
        await createAnswer({
          questionid: questions[index]._id,
          regid: registration?._id,
          ...data,
        });
        getQuestionsMutation.mutate();
      }
      await openQuestion(index + 1);
    } catch (err) {
      toast.error(err.message, { autoClose: true });
    }
  };

  const updateRegistration = useMutation({
    mutationFn: async (data) =>
      registration?._id &&
      data &&
      (await updateReistrationById(data, registration?._id)),
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const submitTestMutation = useMutation({
    mutationFn: () =>
      registration?._id &&
      test?._id &&
      submitTest({
        regid: registration?._id,
        testid: test?._id,
        completedTime: test?.testDuration - countDown,
      }),
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
    onSuccess: (data) => {
      getRegistrationDetailsQuery.refetch();
      toast.success(data.message, { autoClose: 500 });
    },
  });

  const getQuestion = useMutation({
    mutationFn: async (number) => {
      if (questions[number - 1])
        return await findQuestionById(questions[number - 1]?._id);
    },
    onSuccess: async (data) => {
      setActiveQuestion(await data?.question);
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const changeStatus = async (value, index) => {
    const number = index || activeNumber - 1;
    const data = questions;
    if (value === "marked") {
      data[number].answer.isMarked = !data[number].answer.isMarked;
    } else {
      data[number].answer.answerStatus = value;
    }
    setQuestions(data);
  };

  useEffect(() => {
    storeItem({ key: regid, value: countDown });
    if (countDown <= 0) submitTestMutation.mutate();
    // eslint-disable-next-line
  }, [countDown]);

  useEffect(() => {
    const fetch = async () => {
      const questionNumber = queryParams.get("question");
      setActiveNumber(questionNumber);
      if (questions && parseInt(questionNumber) === questions.length) {
        setisLastQuestion(true);
      } else setisLastQuestion(false);

      if (questions) getQuestion.mutate(parseInt(questionNumber));
    };
    fetch();
    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    const query = async () => {
      if (registration.status === "registered") {
        updateRegistration.mutate({ status: "pending" });
      }
      updateRegistration.mutate({
        attempts: registration?.attempts + 1,
      });
      await getQuestionsMutation.mutate();
      navigate(`?section=${section}&question=1`);
    };
    if (section && test && registration) query();
  }, [section, registration, test]);

  return getRegistrationDetailsQuery.isLoading ? (
    <FullScreenLoader message={"Loading test..."} />
  ) : countDown < 0 || registration?.status === "completed" ? (
    <div className="full-page-loader p-5">
      <Alert variant="info" className="d-flex align-items-center gap-2">
        <MdInfo size="24" />
        <h6 className="heading">Your test had submitted successfully!</h6>
      </Alert>
    </div>
  ) : new Date(test?.endTime) < Date.now() ? (
    <div className="full-page-loader p-5">
      <Alert variant="warning" className="d-flex align-items-center gap-2">
        <MdAddAlert size="24" />
        <h6 className="heading">Sorry! Test has been ended!</h6>
      </Alert>
    </div>
  ) : (
    <div className="test-container">
      <Helmet>
        <title>{`${test?.testName} - ${section} - Question ${activeNumber}`}</title>
        <meta name="description" content="This is a description of my page." />
        {/* Add more meta tags or head elements as needed */}
      </Helmet>
      <div className="test-edit-left">
        {/* Left side content */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <h3 className="heading">{test?.testName}</h3>
            <h5
              style={{
                margin: 0,
                backgroundColor: "#000",
                color: "#fff",
                padding: "5px 10px",
              }}
            >
              {test?.totalMarks} Marks
            </h5>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <TestInstrictions
              instructions={test?.instructions}
              closeable={true}
            >
              <h6 className="d-flex heading" style={{ color: "#007fff" }}>
                <MdOutlineIntegrationInstructions size={24} /> &nbsp;
                Instructions
              </h6>
            </TestInstrictions>
            <ConfirmModal
              title={"Submit Test"}
              varaiant="primary"
              confirmFn={submitTestMutation.mutate}
              isLoading={submitTestMutation.isLoading}
            >
              <Alert variant="warning">
                The questions which are saved and answered will be submitted.
              </Alert>
            </ConfirmModal>
            {countDown && (
              <CountdownTimer minutes={countDown} setTimer={setCountDown} />
            )}
          </div>
        </div>
        <h3 className="sub-title mb-3">sections</h3>
        <div className="d-flex gap-3 align-items-center">
          {test?.sections?.length > 0 &&
            test?.sections?.map((name, index) => (
              <div
                className={`section-div ${name === section && "active"}`}
                key={index}
                onClick={() => setSection(name)}
              >
                {name}
              </div>
            ))}
        </div>
        <br />
        {questions && <QuestionsNumberStatus questions={questions} />}
        <br />
        <WatchQuestion
          data={activeQuestion}
          activeNumber={activeNumber}
          isLoading={getQuestion.isLoading}
          changeStatus={changeStatus}
          handleOpenQuestion={handleOpenQuestion}
          islastQuestion={islastQuestion}
          regid={registration?._id}
        />
      </div>
      <div className="test-edit-right">
        {/* Right side content */}
        {section && <h1 className="title">{section}</h1>}
        <UserQuestionGrid
          section={section}
          questions={questions}
          activeNumber={activeNumber}
          handleOpenQuestion={handleOpenQuestion}
        />
      </div>
    </div>
  );
}

export default UserTestPage;
