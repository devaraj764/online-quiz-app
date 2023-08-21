import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

function ConfirmModal({
  children,
  confirmFn,
  variant,
  title,
  size,
  isLoading,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    if (confirmFn) confirmFn();
    handleClose();
  };
  return (
    <div>
      <Button variant={variant} onClick={() => setShow(true)}>
        {title}
      </Button>
      <Modal
        centered
        backdrop="static"
        show={show}
        onHide={handleClose}
        size={size || "md"}
      >
        <Modal.Body
          className="p-10 d-flex align-ietms-center justify-content-center"
          style={{
            width: "100%",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          {children}
          <div className="d-flex gap-3 justify-content-end">
            <Button
              variant="secondary"
              style={{ minWidth: "100px" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              style={{ minWidth: "100px" }}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading && <Spinner size="sm" />}
              Confirm
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ConfirmModal;
