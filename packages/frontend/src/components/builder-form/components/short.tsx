import * as React from "react";
import { backendUrl } from "../../../config/backend-url";

type P = {
  short: string;
};

export function Short({ short }: P): JSX.Element {
  return <a href={`${backendUrl}/${short}`}>{`${backendUrl}/${short}`}</a>;
}
