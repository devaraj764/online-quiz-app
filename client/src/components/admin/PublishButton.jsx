import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import DateTimeInput from "../common/DateTimeInput";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useMutation } from "react-query";
import { publishTest } from "../../api/test";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function PublishButton({ title, preCallBack }) {
  const [show, setShow] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [endTimestamp, setEndTimestamp] = useState(null);
  const { testid } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    setEndTimestamp(null);
    setStartTimestamp(null);
    setShow(false);
  };

  const handleConfirm = () => {
    if (startTimestamp && endTimestamp) {
      mutate();
      setEndTimestamp(null);
      setStartTimestamp(null);
      setShow(false);
    }
  };

  const handlePublish = async () => {
    return await publishTest(
      {
        startTimestamp,
        endTimestamp,
      },
      testid
    );
  };

  const { isLoading, mutate } = useMutation({
    mutationFn: () => {
      if (preCallBack) preCallBack();
      return handlePublish();
    },
    onSuccess: (data) => {
      toast.success("publshed successfully", { autoClose: 500 });
      navigate("/admin/dashboard");
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 500 });
    },
  });

  return (
    <>
      <Button onClick={() => setShow(true)} style={{ borderRadius: 0 }}>
        {title || "Publish"}
      </Button>
      <Modal size="lg" backdrop="static" show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="d-flex justify-content-between  mb-3 align-items-center">
            <div className="d-flex title align-items-center">
              <AiOutlineCloudUpload size={24} /> &nbsp; {title || "Publish"}{" "}
              Test
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Button
                variant="secondary"
                style={{ borderRadius: 0 }}
                onClick={handleClose}
              >
                Close
              </Button>
              {startTimestamp && endTimestamp && (
                <Button
                  variant="success"
                  style={{ borderRadius: 0 }}
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner className="spinner-div" /> : "Confirm"}
                </Button>
              )}
            </div>
          </div>
          <hr />
          <div className="sub-title mb-2" style={{ color: "gray" }}>
            Start Test Time
          </div>
          <DateTimeInput setTimestamp={setStartTimestamp} />
          <hr />
          <div className="sub-title mb-2 mt-3" style={{ color: "gray" }}>
            End Test Time
          </div>
          <DateTimeInput setTimestamp={setEndTimestamp} />
          <br />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PublishButton;
