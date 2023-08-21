import React from "react";
import BaseTable from "../../components/BaseTable";
import { Badge, Button } from "react-bootstrap";
import { MdOutlineModeEditOutline } from "react-icons/md";
import formatDate from "../../helpers/formatDate";
import { Link } from "react-router-dom";
import TestInstrictions from "./TestInstrictions";
import Timer from "../common/Timer";

export const openPopUpWindow = (url) => {
  const windowFeatures =
    "fullscreen=yes,menubar=no,toolbar=no,location=no,status=no";
  const popup = window.open(url, "popup", windowFeatures);
  if (
    popup.outerWidth < window.screen.availWidth ||
    popup.outerHeight < window.screen.availHeight
  ) {
    popup.moveTo(0, 0);
    popup.resizeTo(window.screen.availWidth, window.screen.availHeight);
  }
};

const columns = [
  {
    Header: "ID",
    accessor: "test._id", // The key of the data object for this column
    Cell: ({ row }) => row.index + 1,
  },

  {
    Header: "Test Name",
    accessor: "test.testName",
  },
  {
    Header: "Applied On",
    accessor: "createdAt",
    Cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    Header: "Duration",
    accessor: "test.testDuration",
    Cell: ({ row }) =>
      row.original.test.testDuration && (
        <span>{row.original.test.testDuration} min</span>
      ),
  },
  {
    Header: "Completed In",
    accessor: "completedTime",
    Cell: ({ row }) =>
      row.original.completedTime && (
        <span>{row.original.completedTime} min</span>
      ),
  },
  {
    Header: "Score",
    accessor: "score",
    Cell: ({ row }) =>
      row.original.status !== "registered" ? (
        <span>
          {row.original.score} / {row.original.test.totalMarks}
        </span>
      ) : (
        <span>- - -</span>
      ),
  },

  {
    Header: "Result",
    accessor: "test.result",
    Cell: ({ row }) =>
      row.original.result && (
        <Badge
          bg={row.original.result === "pass" ? "success" : "danger"}
          className="status-badge"
          style={{
            textTransform: "capitalize",
          }}
        >
          {row.original.result}
        </Badge>
      ),
  },
  {
    Header: "Actions",
    accessor: "actions",
    Cell: ({ row }) =>
      row.original.status === "completed" ? (
        <Button
          as={Link}
          className="action-buttons"
          variant="outline-success"
          to={`/test/results/${row.original._id}`}
          disabled={row.original.test.status === "completed"}
        >
          View Results
        </Button>
      ) : row.original.test.endTime < Date.now() ? (
        <Button className="action-buttons" variant="dark" disabled>
          Test Ended
        </Button>
      ) : row.original.status === "pending" ? (
        <Button
          className="action-buttons"
          variant="warning"
          // onClick={() => openPopUpWindow(`/test/write/${row.original._id}`)}
          onClick={() => window.open(`/test/write/${row.original._id}`)}
        >
          <MdOutlineModeEditOutline size={24} />
          Complete Test
        </Button>
      ) : new Date(row.original.test.startTime) > Date.now() ? (
        <Timer style={{fontSize:'16px', width:'max-content'}} timestamp={row.original.test.startTime} />
      ) : row.original.status === "registered" && row ? (
        <TestInstrictions
          // closeFn={() => openPopUpWindow(`/test/write/${row.original._id}`)}
          closeFn={() => window.open(`/test/write/${row.original._id}`)}
        >
          <Button className="action-buttons" variant="primary">
            <MdOutlineModeEditOutline size={18} /> Write Test
          </Button>
        </TestInstrictions>
      ) : null,
  },
];

function UserTests({ registrations, isLoading }) {
  return <BaseTable data={registrations} columns={columns} loading={isLoading} />;
}

export default UserTests;
