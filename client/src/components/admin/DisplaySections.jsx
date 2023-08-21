import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { MdDelete } from "react-icons/md";

function DisplaySections({
  sections,
  handleCreateSection,
  section,
  setSection,
  handleDeleteSection,
}) {
  const [createSection, setCreateSection] = useState(false);
  const [newSection, setNewSection] = useState("");

  const handleAddSection = () => {
    handleCreateSection(newSection);
    setNewSection("");
    setCreateSection(false);
  };

  return (
    <>
      <h3 className="sub-title mb-3">sections</h3>
      <div className="d-flex gap-3 align-items-center">
        {sections?.map((name, index) => (
          <div className="d-flex align-items-center" key={index}>
            <div
              className={`section-div ${name === section && "active"}`}
              onClick={() => setSection(name)}
            >
              {name}
            </div>
            <ConfirmModal
              confirmFn={() => handleDeleteSection(name)}
              title={<MdDelete />}
              variant="danger"
            >
              <Alert variant="danger">Delete {name} section</Alert>
            </ConfirmModal>
          </div>
        ))}
        {sections.length >= 4 ? null : createSection ? (
          <div className="section-div d-flex">
            <Form.Control
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="Enter new section"
            />
            <Button onClick={handleAddSection}>Add</Button>
          </div>
        ) : (
          <div
            className={`section-div create-btn`}
            onClick={() => setCreateSection(true)}
          >
            +&nbsp;&nbsp;section
          </div>
        )}
      </div>
    </>
  );
}

export default DisplaySections;
