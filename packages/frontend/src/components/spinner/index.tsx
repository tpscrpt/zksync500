import * as React from "react";
import "./styles.css";

type P = {
  size: number | string;
};

export function Spinner({ size }: P): JSX.Element {
  return (
    <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
      <div className="loader" style={{ height: size, width: size }}></div>
    </div>
  );
}
