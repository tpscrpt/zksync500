import React from "react";

export const Star = ({ color = "red" }): JSX.Element => (
  <span className="ml-1" style={{ color }}>
    *
  </span>
);
