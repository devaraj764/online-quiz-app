import React from "react";
import { Spinner } from "react-bootstrap";

function FullScreenLoader({ message }) {
  return (
    <div className="full-screen-loader">
      <Spinner animation="grow" />
      <br />
      {message || "Loading..."}
    </div>
  );
}

export default FullScreenLoader;
