import React, { useEffect } from "react";
import EditableTextInput from "../common/EditabletextInput";
import { Badge, Table } from "react-bootstrap";
import { toast } from "react-toastify";

function EditTestActions({ test, updateField, usedMarks }) {
  useEffect(() => {
    if (usedMarks && usedMarks > test.totalMarks) {
      toast.warning("Please update your total marks! You have used more than Marks Alloted to the test");
    }
  }, [usedMarks]);
  return (
    <div className="mb-3">
      <Table bordered>
        <tbody>
          <tr>
            <td>
              <div className="sub-title">Test Duration :</div>
            </td>
            <td>
              <div className="sub-title">Total Marks :</div>
            </td>
            <td>
              <div className="sub-title">Pass Marks :</div>
            </td>
            <td>
              <div className="sub-title">Number of Questions :</div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="d-flex align-items-center">
                <EditableTextInput
                  defaultValue={test?.testDuration || ""}
                  changeFn={updateField}
                  fieldName="testDuration"
                  styles={{ width: "100px" }}
                />
                Minutes
              </div>
            </td>
            <td>
              <div className="d-flex align-items-center">
                <EditableTextInput
                  defaultValue={test?.totalMarks || ""}
                  changeFn={updateField}
                  fieldName="totalMarks"
                  styles={{ width: "100px" }}
                />
                Marks &nbsp;
                <Badge
                  bg={
                    test?.totalMarks < usedMarks
                      ? "danger"
                      : test?.totalMarks === usedMarks
                      ? "success"
                      : "primary"
                  }
                >
                  <b>{usedMarks}</b> Used
                </Badge>
              </div>
            </td>
            <td>
              <div className="d-flex align-items-center">
                <EditableTextInput
                  defaultValue={test?.passMark || "--"}
                  changeFn={updateField}
                  fieldName="passMark"
                  styles={{ width: "100px" }}
                />
                Marks
              </div>
            </td>
            <td>
              <div className="title">{test?.questionsCount}</div>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default EditTestActions;
