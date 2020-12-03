import * as React from "react";
import { Dropdown } from "react-bootstrap";
import { supportedTokensWithIcons } from "../../config/supported-tokens";
import { TokenOption } from "../token-option";

export const supportedTokensList = (salt: string, setter: (token: string) => void): JSX.Element[] =>
  Object.entries(supportedTokensWithIcons).map(([symbol, { icon }]) => (
    <Dropdown.Item
      key={`${salt}-${symbol}`}
      style={{ display: "flex", alignItems: "center" }}
      onClick={() => setter(symbol)}
    >
      <TokenOption symbol={symbol} icon={icon} />
    </Dropdown.Item>
  ));
