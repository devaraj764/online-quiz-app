import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import TextEditor from "../common/TextEditor";

function EditTestInstrictions({ updateField, defaultValue }) {
  const [show, setShow] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [instructions, setInstructions] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (
      instructions === "" ||
      instructions === "<p><br></p>" ||
      instructions === defaultValue
    ) {
      setDirty(false);
    } else setDirty(true);
  }, [instructions]);

  useEffect(() => {
    if (defaultValue) {
      setInstructions(defaultValue);
      setDirty(false);
    }
  }, [defaultValue]);

  const saveChanges = () => {
    updateField("instructions", instructions);
    setShow(false);
  };

  return (
    <>
      <div
        className="d-flex sub-title"
        style={{ color: "#007fff", cursor: "pointer" }}
        onClick={() => setShow(true)}
      >
        <MdOutlineIntegrationInstructions size={24} /> &nbsp; Instructions
      </div>
      <Modal backdrop="static" size="lg" show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="d-flex justify-content-between  mb-3 alignitems-center">
            <div className="d-flex sub-title">
              <MdOutlineIntegrationInstructions size={24} /> &nbsp; Edit
              instructions
            </div>
            <div className="d-flex gap-2">
              {dirty ? (
                <Button size="sm" onClick={saveChanges}>
                  Save
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
          <TextEditor text={instructions} setText={setInstructions} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditTestInstrictions;
