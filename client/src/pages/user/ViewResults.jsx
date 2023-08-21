import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserQuestionGrid from "../../components/user/UserQuestionGrid";
import { Helmet } from "react-helmet";
import ResultQuestion from "../../components/user/ResultQuestion";
import { findQuestionById, getQuestionsWithAnswers } from "../../api/question";
import { getRegistrationDetails } from "../../api/registration";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { MdArrowBack } from "react-icons/md";

function ViewResults() {
  const { regid } = useParams();
  const [test, setTest] = useState();
  const [registration, setRegistration] = useState();
  const [questions, setQuestions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const defaultSection = queryParams.get("section");
  const questionNumber = queryParams.get("question");
  const [activeNumber, setActiveNumber] = useState(questionNumber || 1);
  const [activeQuestion, setActiveQuestion] = useState(null);

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
      }
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const getQuestionsQuery = useQuery({
    queryKey: "/question/get-questions",
    enabled: test && test?._id ? true : false,
    queryFn: () =>
      section &&
      test &&
      test?._id &&
      registration?._id &&
      getQuestionsWithAnswers({
        testid: test?._id,
        section: section || test?.sections[0],
        regid: registration?._id,
      }),
    onSuccess: async (data) => {
      setQuestions([]);
      if (!data) return;
      setQuestions(data.questions);
      openQuestion(activeNumber);
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const openQuestion = async (number) => {
    if (section) navigate(`.?section=${section}&question=${number}`);
    else navigate(`.?question=${number}`);
  };

  const handleOpenQuestion = async (index, data) => {
    try {
      await openQuestion(index + 1);
    } catch (err) {
      toast.error(err.message, { autoClose: true });
    }
  };

  const getQuestion = useMutation({
    mutationFn: async (number) =>
      number &&
      questions[number - 1]?._id &&
      (await findQuestionById(questions[number - 1]?._id)),
    onSuccess: async (data) => {
      setActiveQuestion(await data?.question);
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  useEffect(() => {
    const fetch = async () => {
      const questionNumber = queryParams.get("question");
      const defaultSection = queryParams.get("section");

      setActiveNumber(questionNumber);
      if (defaultSection !== section) await getQuestionsQuery.refetch();
      if (questions) getQuestion.mutate(questionNumber);
    };
    // execute on location change
    fetch();
    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    navigate(`?section${section}&question=1`);
    // eslint-disable-next-line
  }, [section]);

  return getRegistrationDetailsQuery.isLoading ? (
    <FullScreenLoader message={"Loading test..."} />
  ) : (
    <div className="test-container">
      <Helmet>
        <title>{`Results of ${test?.testName} - ${section} - Question ${activeNumber}`}</title>
        <meta name="description" content="This is a description of my page." />
        {/* Add more meta tags or head elements as needed */}
      </Helmet>
      <div className="test-edit-left">
        {/* Left side content */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{cursor:'pointer'}}
              title="go back"
              onClick={() => navigate("/user/dashboard")}
            >
              <MdArrowBack size={32} />
            </div>
            <h3 className="heading">{test?.testName}</h3>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <h3 className="heading">Score: </h3>
            <h5
              style={{
                margin: 0,
                backgroundColor: "#000",
                color: "#fff",
                padding: "5px 10px",
              }}
            >
              {registration?.score} / {test?.totalMarks}
            </h5>
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
        <div className="d-flex align-items-center justify-content-end questions-status gap-3">
          <div className="status-div d-flex gap-2 align-items-center">
            <div className="status-box correct-answer">
              {registration?.correctCount}
            </div>
            <div className="sub-title">Correct Answers</div>
          </div>
          <div className="status-div d-flex gap-2 align-items-center">
            <div className="status-box wrong-answer">
              {registration?.wrongCount}
            </div>
            <div className="sub-title">Wrong Answers</div>
          </div>
        </div>
        <br />
        <ResultQuestion
          question={activeQuestion}
          questionNumber={activeNumber}
          section={section}
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
          isSubmitted={true}
        />
      </div>
    </div>
  );
}

export default ViewResults;
