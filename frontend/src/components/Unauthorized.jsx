import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-danger text-center mb-3">
          403 - Unauthorized access
        </h2>
        <p className="text-center">
          You do not have permission to view this page.
        </p>
        <div className="text-center">
          <Link to="/" className="btn btn-primary">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
