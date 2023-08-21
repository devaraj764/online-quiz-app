import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { MdOutlineClose } from "react-icons/md";
import { useMutation } from "react-query";
import { createTest } from "../../api/test";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminCreateTest({ show, handleClose }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();
  const [sections, setSections] = useState(['Primary']);
  const navigate = useNavigate();

  const createTestMutation = useMutation({
    mutationFn: createTest,
    onSuccess: (res) => {
      toast.success(res.message, { autoClose: 500 });
      reset();
      navigate(`/admin/test/edit/${res.data._id}`);
      handleClose();
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 500 });
    },
  });

  const addSection = () => {
    setSections([...sections, ""]);
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
    setValue("sections", updatedSections);
  };

  return (
    <Modal show={show} centered size="xl" onHide={handleClose}>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(createTestMutation.mutate)}
          className="test-from"
        >
          <div
            className="d-flex"
            style={{
              gap: "20px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 className="heading">Create Test</h2>
            <div
              className="d-flex"
              style={{ gap: "10px", justifyContent: "flex-end" }}
            >
              <Button style={{ minWidth: "120px" }} type="submit">
                Create
              </Button>
              <Button
                variant="secondary"
                style={{ minWidth: "120px" }}
                type="reset"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
          <br />
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="testName">
                <Form.Label>Test Name:</Form.Label>
                <Form.Control type="text" {...register("testName")} required />
                {errors.testName && (
                  <Form.Text className="text-danger">
                    Test Name is required.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="testDuration">
                <Form.Label>Test Duration (minutes):</Form.Label>
                <Form.Control
                  type="number"
                  {...register("testDuration")}
                  required
                />
                {errors.testDuration && (
                  <Form.Text className="text-danger">
                    Test Duration must be a positive integer greater than 0.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="totalMarks">
                <Form.Label>Total Marks:</Form.Label>
                <Form.Control
                  type="number"
                  {...register("totalMarks")}
                  required
                />
                {errors.totalMarks && (
                  <Form.Text className="text-danger">
                    Total Marks must be a positive integer greater than 0.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="passMark">
                <Form.Label>Pass Marks:</Form.Label>
                <Form.Control
                  type="number"
                  {...register("passMark")}
                  required
                />
                {errors.passMark && (
                  <Form.Text className="text-danger">
                    Total Marks must be a positive integer greater than 0.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <br />
          <Row>
            <Form.Label>Sections</Form.Label>
            {sections?.map((section, index) => {
              return (
                <Col key={index} md={4} style={{ padding: "10px" }}>
                  <Form.Group>
                    <div style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        value={section}
                        autoFocus={true}
                        onChange={(e) => {
                          const updatedSections = [...sections];
                          updatedSections[index] = e.target.value;
                          setSections(updatedSections);
                          setValue("sections", updatedSections);
                        }}
                      />
                      <div
                        onClick={() => removeSection(index)}
                        style={{
                          backgroundColor: "red",
                          display: "flex",
                          alignItems: "center",
                          padding: "10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <MdOutlineClose
                          variant="danger"
                          size={20}
                          style={{ color: "#fff" }}
                        />
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              );
            })}
            <Col md={4} style={{ padding: "10px" }}>
              <Button
                variant="outline-primary"
                onClick={addSection}
                style={{ width: "100%" }}
              >
                Add Section
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AdminCreateTest;
