import React from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import BaseTable from "../BaseTable";
import formatDate from "../../helpers/formatDate";

const columns = [
  {
    Header: "ID",
    accessor: "id", // The key of the data object for this column
    Cell: ({ row }) => row.index + 1,
  },
  {
    Header: "User Name",
    accessor: "user.fullName",
  },
  {
    Header: "Completion Time",
    accessor: "completedTime",
    Cell: ({ row }) =>
      row.original.completedTime && (
        <span>{row.original.completedTime} min</span>
      ),
  },
  {
    Header: "Submmited On",
    accessor: "updatedAt",
    Cell: ({ row }) => formatDate(row.original.updatedAt),
  },
  {
    Header: "Wrong Answers",
    accessor: "wrongCount",
  },
  {
    Header: "Correct Answers",
    accessor: "correctCount",
  },
  {
    Header: "Pass / Fail",
    accessor: "result",
    Cell: ({ row }) => (
      <Badge
        bg={row.original.result === "pass" ? "success" : "danger"}
        style={{
          textTransform: "capitalize",
          fontSize: "18px",
          width: "100%",
          borderRadius: 0,
          fontWeight: "500",
        }}
      >
        {row.original.result}
      </Badge>
    ),
  },
  {
    Header: "Marks",
    accessor: "score",
    Cell: ({ row }) => <h5 className="heading">{row.original.score}</h5>,
  },
];

function ScoreTable({ sections, scores }) {
  return (
    <div className="score-table mt-3">
      <div className="flex-between mb-3">
        <h3 className="heading">Score</h3>
      </div>
      <BaseTable data={scores} columns={columns} />
    </div>
  );
}

export default ScoreTable;
