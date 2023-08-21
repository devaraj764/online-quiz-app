import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QuestionGrid from "../../components/admin/QuestionsGrid";
import EditableTextInput from "../../components/common/EditabletextInput";
import EditQuestion from "../../components/admin/EditQuestion";
import EditTestInstrictions from "../../components/admin/EditTestInstrictions";
import EditTestActions from "../../components/admin/EditTestActions";
import PublishButton from "../../components/admin/PublishButton";
import { MdArrowBack } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { getTestById, updateTestById } from "../../api/test";
import DisplaySections from "../../components/admin/DisplaySections";
import {
  createQuestion,
  findQuestionById,
  getQuestions,
} from "../../api/question";

function AdminEditTest() {
  // handling default params
  const location = useLocation();
  const navigate = useNavigate();
  const { testid } = useParams();
  const queryParams = new URLSearchParams(location.search);

  // setting default section
  const defaultSection = queryParams.get("section");
  const defaultQuestion = queryParams.get("question");
  const [section, setSection] = useState(defaultSection);
  const [questions, setQuestions] = useState(null);
  const [usedMarks, setUsedMarks] = useState(0);
  // handleing questions
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeNumber, setActiveNumber] = useState(defaultQuestion || 1);

  // for test
  const [test, setTest] = useState();

  // queries
  const getTestDetails = useQuery({
    queryKey: "/test/get-test-details",
    onSuccess: async (data) => {
      if (data?.test) {
        setTest(await data.test);
        setUsedMarks(data.test.marksUsed);
        if (!defaultSection) setSection(data.test?.sections[0]);
      }
    },
    queryFn: () => getTestById({ testid }),
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
    retry: 1,
  });

  // handling sections
  const handleCreateSection = async (sectionName) => {
    if (sectionName) {
      const newSections = [...test.sections, sectionName];
      await updateTestById({ sections: newSections }, testid);
      const { refetch } = getTestDetails;
      await refetch();
    }
  };

  const handleDeleteSection = async (sectionName) => {
    if (sectionName) {
      const newSections = test.sections.filter(
        (section) => section !== sectionName
      );
      await updateTestById({ sections: newSections }, testid);
      const { refetch } = getTestDetails;
      await refetch();
    }
  };

  const updateField = async (key, value) => {
    await updateTestById({ [key]: value }, testid);
  };

  const getQuestionsMutation = useMutation({
    mutationFn: async () =>
      await getQuestions({
        test: test?._id,
        section: section || test?.sections[0],
      }),
    onSuccess: async (data) => {
      if (!data) return;
      setQuestions(data?.questions);
      if (data.questions.length <= 0) {
        createQuestionMutation.mutate(1);
        openQuestion(1);
      } else {
        openQuestion(activeNumber);
      }
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (number) =>
      section &&
      number &&
      test?._id &&
      (await createQuestion({ section, unqNumber: number, test: test?._id })),
    onSuccess: (data) => {
      getTestDetails.refetch();
      getQuestionsMutation.mutate();
      openQuestion(data?.question?.unqNumber);
    },
    onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const getQuestion = useMutation({
    mutationFn: async (number) =>
      questions?.length > 0 &&
      number &&
      findQuestionById(questions[number - 1]?._id),
    onSuccess: (data) => {
      setActiveQuestion(data?.question);
    },
    // onError: (error) => toast.error(error.message, { autoClose: 500 }),
  });

  const openQuestion = async (number) => {
    if (section) navigate(`.?section=${section}&question=${number || 1}`);
    else navigate(`.?question=${number}`);
  };

  useEffect(() => {
    const fetch = async () => {
      const questionNumber = queryParams.get("question");
      setActiveNumber(questionNumber);
      if (questions) getQuestion.mutate(questionNumber);
    };
    // execute on location change
    fetch();
  }, [location]);

  useEffect(() => {
    const query = async () => {
      console.log("query");
      await getQuestionsMutation.mutate();
      navigate(`?section=${section}&question=1`);
    };
    if (section && test) query();
  }, [section, test]);

  const preCallBack = async () => {
    if (usedMarks > test?.totalMarks) {
      return toast.error("Update Total Marks");
    }
  };

  return (
    <div className="test-edit-container">
      <div className="test-edit-left">
        {/* Left side content */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-3 align-items-center">
            <div
              className="back-btn"
              title="go back"
              onClick={() => navigate("/admin/dashboard")}
            >
              <MdArrowBack size={32} />
            </div>
            <EditableTextInput
              defaultValue={test?.testName || ""}
              styles={{ fontSize: "30px" }}
              fieldName={"testName"}
              changeFn={updateField}
            />
          </div>
          <div className="d-flex gap-3 align-items-center">
            <EditTestInstrictions
              updateField={updateField}
              testid={testid}
              defaultValue={test?.instructions}
            />
            <PublishButton preCallBack={preCallBack} />
          </div>
        </div>
        <EditTestActions
          usedMarks={usedMarks}
          test={test}
          updateField={updateField}
        />
        {test?.sections?.length > 0 && (
          <DisplaySections
            sections={test.sections}
            handleCreateSection={handleCreateSection}
            handleDeleteSection={handleDeleteSection}
            setSection={setSection}
            section={section}
          />
        )}
        <br />
        <EditQuestion
          defaultQuestionDetails={activeQuestion}
          section={section}
          activeNumber={activeNumber}
          openQuestion={openQuestion}
          isLoading={getQuestion.isLoading}
          marksRemained={test?.totalMarks - usedMarks}
          getTestDetails={getTestDetails}
        />
      </div>
      <div className="test-edit-right">
        {/* Right side content */}
        {section && <h1 className="title">{section}</h1>}
        <QuestionGrid
          section={section}
          questions={questions || []}
          activeNumber={activeNumber}
          openQuestion={openQuestion}
          createQuestion={createQuestionMutation}
        />
      </div>
    </div>
  );
}

export default AdminEditTest;
