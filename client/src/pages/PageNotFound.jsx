import React from "react";
import { Image } from "react-bootstrap";

function PageNotFound({ message }) {
  return (
    <div className="page-not-found">
      <Image src="/assets/404-error.png" alt="404" height="300px" />
      <div className="heading">{message || "This page is out of website!"}</div>
    </div>
  );
}

export default PageNotFound;
