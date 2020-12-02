import * as React from "react";
import "./styles.css";

type Props = {
  symbol: string;
  icon: string;
};

export function TokenOption({ symbol, icon }: Props): JSX.Element {
  return (
    <>
      <span>{symbol}</span>
      <img src={icon} className="TokenOptionIcon" />
    </>
  );
}
