import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Spinner } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { deleteQuestion, updateQuestion } from "../../api/question";
import { useQueryClient } from "react-query";
import ConfirmModal from "../common/ConfirmModal";

const saveChanges = async (formValues, id) => {
  // Check if options are above 2
  if (formValues.options.length < 2) {
    toast.error("There must be at least 2 options.", { autoClose: 1000 });
    return;
  }
  // Check if title, marksAssigned, and correctOption are not empty
  if (
    formValues.title === "" ||
    formValues.marksAssigned === "" ||
    formValues.correctOption === ""
  ) {
    toast.error("All fields must be filled.", { autoClose: 1000 });
    return;
  }
  // Check if marksAssigned and correctOption are positive numbers
  if (
    parseInt(formValues.marksAssigned) <= 0 ||
    parseInt(formValues.correctOption) <= 0
  ) {
    toast.error("Assigned Marks and Correct Option must be positive numbers.", {
      autoClose: 1000,
    });
    return;
  }
  // Check if correctOption is within the valid range of options
  if (
    formValues.correctOption > formValues.options.length ||
    formValues.correctOption < 1
  ) {
    toast.error("Correct Option must be within the valid range of options.", {
      autoClose: 1000,
    });
    return;
  }
  // Check if options are not empty
  if (formValues.options.some((option) => option === "")) {
    toast.error("Options cannot be empty.", { autoClose: 1000 });
    return;
  }

  // Check if correctOption is less than options length
  if (formValues.correctOption > formValues.options.length) {
    toast.error("Correct Option must be less than options length.", {
      autoClose: 1000,
    });
    return;
  }
  // If all validations pass, handle form submission here
  try {
    await updateQuestion(formValues, id);
    toast.success("Saved Changes", { autoClose: 500 });
    return true;
  } catch (error) {
    toast.error(error.message, { autoClose: 500 });
  }
};

function EditQuestion({
  defaultQuestionDetails,
  activeNumber,
  openQuestion,
  isLoading,
  getTestDetails,
  marksRemained,
}) {
  const [formValues, setFormValues] = useState(defaultQuestionDetails);
  const [dirty, setDirty] = useState(false);
  const queryClient = useQueryClient();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
    setDirty(true);
  };

  const handleOptionChange = (index, value) => {
    setFormValues((prevState) => {
      const options = [...prevState.options];
      options[index] = value;
      return { ...prevState, options };
    });
    setDirty(true);
  };

  const handleAddOption = () => {
    setFormValues((prevState) => ({
      ...prevState,
      options: [...prevState.options, ""],
    }));
    setDirty(true);
  };

  const handleDeleteOption = (index) => {
    setFormValues((prevState) => {
      const options = [...prevState.options];
      options.splice(index, 1);
      return { ...prevState, options };
    });
    setDirty(true);
  };

  useEffect(() => {
    if (defaultQuestionDetails) {
      setFormValues({});
      setFormValues({
        title: defaultQuestionDetails?.title || "",
        options:
          defaultQuestionDetails.options.length > 0
            ? defaultQuestionDetails.options
            : ["", ""],
        marksAssigned: defaultQuestionDetails?.marksAssigned || "",
        correctOption: defaultQuestionDetails?.correctOption || "",
      });
    }
  }, [defaultQuestionDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formValues.marksAssigned - (defaultQuestionDetails.marksAssigned || 0) >
      marksRemained
    ) {
      toast.error("Assigned marks exceeding Total Marks", {autoClose:1000});
      return;
    }
    try {
      const result = await saveChanges(formValues, defaultQuestionDetails._id);
      if (result) {
        getTestDetails.refetch();
        setDirty(false);
      }
      console.log(result);
    } catch (error) {
      toast.error(error.message, { autoClose: 500 });
    }
  };

  const handleDelete = async (e) => {
    try {
      const result = await deleteQuestion(defaultQuestionDetails._id);
      if (result) {
        queryClient.invalidateQueries(["/question/get-questions"]);
        getTestDetails.refetch();
        openQuestion(activeNumber);
        toast.success("Deleted Question", { autoClose: 500 });
      }
    } catch (error) {
      toast.error(error.message, { autoClose: 500 });
    }
  };

  const restoreQuestion = async (e) => {
    try {
      const result = await updateQuestion(
        { isDeleted: false },
        defaultQuestionDetails?._id
      );
      if (result) {
        queryClient.invalidateQueries(["/question/get-questions"]);
        getTestDetails.refetch();
        toast.success("Question Restored", { autoClose: 500 });
        openQuestion(activeNumber);
      }
    } catch (error) {
      toast.error(error.message, { autoClose: 500 });
    }
  };

  if (!formValues) return <Spinner className="spinner-div" />;

  return isLoading ? (
    <Spinner className="spinner-div" />
  ) : (
    <div className="edit-question">
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="heading">Question {activeNumber}</h4>
          </div>
          <div className="d-flex gap-4" style={{ margin: 0 }}>
            {defaultQuestionDetails?.isDeleted ? (
              <Button
                style={{ minWidth: "100px" }}
                variant="warning"
                onClick={restoreQuestion}
              >
                Restore
              </Button>
            ) : (
              <>
                <ConfirmModal
                  confirmFn={handleDelete}
                  title="Delete"
                  variant="outline-danger"
                >
                  <Alert variant="danger">
                    Are you sure you want to delete Question {activeNumber}{" "}
                    <br /> <b>{formValues?.title}</b>
                  </Alert>
                </ConfirmModal>
                {dirty && (
                  <Button
                    type="submit"
                    style={{ minWidth: "100px" }}
                    variant="outline-success"
                  >
                    Save Changes
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <br />
        <div>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              disabled={defaultQuestionDetails?.isDeleted}
              as="textarea"
              name="title"
              value={formValues?.title}
              onChange={handleInputChange}
              placeholder="Write your question.."
              style={{ fontSize: "20px" }}
            />
          </Form.Group>

          <Form.Group className="mt-4" controlId="options">
            <div className="d-flex justify-content-between">
              <Form.Label className="sub-title">Options:</Form.Label>
              <Button variant="primary" size="sm" onClick={handleAddOption}>
                Add Option
              </Button>
            </div>

            {formValues?.options.map((option, index) => (
              <div key={index} className="option-input d-flex gap-3 mt-3">
                <h3>{index + 1}</h3>
                <Form.Control
                  disabled={defaultQuestionDetails?.isDeleted}
                  type="text"
                  value={option}
                  placeholder={`Option ${index + 1}`}
                  style={{ fontSize: "18px" }}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {formValues?.options.length > 2 &&
                  !defaultQuestionDetails?.isDeleted && (
                    <Button
                      variant="danger"
                      size="sm"
                      style={{ padding: "0 24px" }}
                      onClick={() => handleDeleteOption(index)}
                    >
                      <MdDelete size={24} />
                    </Button>
                  )}
              </div>
            ))}
          </Form.Group>

          <div className="row mt-4">
            <Col md={3}>
              <Form.Group controlId="marksAssigned">
                <Form.Label className="sub-title">
                  Marks to question:
                </Form.Label>
                <Form.Control
                  disabled={defaultQuestionDetails?.isDeleted}
                  type="number"
                  name="marksAssigned"
                  value={formValues?.marksAssigned}
                  onChange={handleInputChange}
                  placeholder="Marks for this question"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="correctOption">
                <Form.Label className="sub-title">Answer option:</Form.Label>
                <Form.Control
                  disabled={defaultQuestionDetails?.isDeleted}
                  type="number"
                  name="correctOption"
                  value={formValues?.correctOption}
                  onChange={handleInputChange}
                  placeholder="Choose answer option"
                />
              </Form.Group>
            </Col>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default EditQuestion;
