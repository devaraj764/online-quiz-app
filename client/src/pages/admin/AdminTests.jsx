import React, { useEffect, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { Badge, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LiaEyeSolid } from "react-icons/lia";
import { MdOutlineModeEditOutline } from "react-icons/md";
import formatDate from "../../helpers/formatDate";
import MonthYearSelector from "../../components/common/MonthYearSelector";
import { useQuery } from "react-query";
import { getTests } from "../../api/test";
import { toast } from "react-toastify";

const columns = [
  {
    Header: "ID",
    accessor: "_id", // The key of the data object for this column
    Cell: ({ row }) => row.index + 1,
  },
  {
    Header: "Test Name",
    accessor: "testName",
  },
  {
    Header: "Duration",
    accessor: "testDuration",
    Cell: ({ row }) =>
      row.original.testDuration && <span>{row.original.testDuration} min</span>,
  },

  {
    Header: "Sections",
    accessor: "sections",
    Cell: ({ row }) => (
      <div className="d-flex">
        {row.original.sections?.length <= 0
          ? "No Sections"
          : row.original.sections?.map((section, index) => (
              <span key={index.toString()}>{section},&nbsp;</span>
            ))}
      </div>
    ),
  },
  {
    Header: "CreatedOn",
    accessor: "createdAt",
    Cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ row }) =>
      row.original.status && (
        <Badge
          size="sm"
          bg={
            row.original.status === "unpublished"
              ? "secondary"
              : row.original.status === "published"
              ? "success"
              : row.original.status === "completed"
              ? "primary"
              : null
          }
          className="status-badge"
        >
          {row.original.status}
        </Badge>
      ),
  },
  {
    Header: "Actions",
    accessor: "actions",
    Cell: ({ row }) =>
      row.original.status === "completed" ||
      row.original.endTime < Date.now() ? (
        <Button
          className="action-buttons"
          as={Link}
          variant="outline-primary"
          to={`/admin/test/details/${row.original._id}`}
        >
          View Score
        </Button>
      ) : row.original.status === "published" ||
        row.original.startTime < Date.now() ? (
        <Button
          className="action-buttons"
          as={Link}
          variant="warning"
          to={`/admin/test/watch/${row.original._id}`}
        >
          <LiaEyeSolid size={24} />
          &nbsp; Watch test
        </Button>
      ) : row.original.status === "unpublished" ? (
        <Button
          className="action-buttons"
          as={Link}
          variant="primary"
          to={`/admin/test/edit/${row.original._id}`}
        >
          <MdOutlineModeEditOutline size={18} /> Edit
        </Button>
      ) : null,
  },
];

function AdminTests() {
  const [timestamps, setTimestamps] = useState();
  const [tests, setTests] = useState([]);

  const { isLoading, refetch } = useQuery({
    queryKey: "/test/get-tests",
    enabled: timestamps ? true : false,
    queryFn: () => getTests(timestamps),
    onSuccess: (data) => {
      setTests(data.tests);
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 500 });
    },
  });

  useEffect(() => {
    if (timestamps) {
      refetch();
    }
    // eslint-disable-next-line
  }, [timestamps]);

  return (
    <div className="admin-tests-page">
      <Container fluid>
        <h3 className="heading mb-2">Tests</h3>
        <MonthYearSelector setTimestamps={setTimestamps} />
        <BaseTable data={tests} columns={columns} loading={isLoading} />
      </Container>
    </div>
  );
}

export default AdminTests;
