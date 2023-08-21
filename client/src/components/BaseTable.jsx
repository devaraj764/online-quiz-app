import React, { useEffect, useMemo } from "react";
import { useTable, useFilters } from "react-table";
import { Form, Row, Col, Table, Spinner } from "react-bootstrap";

const BaseTable = ({ columns, data, loading }) => {
  const defaultColumn = useMemo(
    () => ({
      Filter: ({ column }) => (
        <Form.Control
          type="text"
          value={column.filterValue || ""}
          onChange={(e) => column.setFilter(e.target.value)}
          placeholder={`Filter ${column.Header}`}
        />
      ),
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn, // Added defaultColumn for Filter
      },
      useFilters // Using useFilters hook here
    );

  // useEffect(()=>{
  //   console.log('changed Data')
  // }, [data])

  return (
    <>
      <Table striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {column.render("Header") === "ID" ||
                  column.render("Header") === "Actions" ? null : (
                    <Form.Group key={column.id} className="mt-2">
                      {column.render("Filter")}
                    </Form.Group>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {loading ? (
            <tr
              className="heading"
              style={{ textAlign: "center", margin: "10px 0" }}
            >
              <td colSpan={columns.length}>
                <Spinner className="spinner-div" />
              </td>
            </tr>
          ) : data.length <= 0 ? (
            <tr
              className="heading"
              style={{ textAlign: "center", margin: "10px 0" }}
            >
              <td colSpan={columns.length}>
                No Results
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </>
  );
};

export default BaseTable;
