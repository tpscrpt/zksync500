import * as React from "react";
import { Navbar, Nav as BSNav } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Nav(): JSX.Element {
  const [pathname, setPathname] = React.useState(window.location.pathname);

  return (
    <Navbar bg="light">
      <BSNav className="mx-auto">
        <BSNav.Link as={Link} to="/" active={pathname === "/"} onClick={() => setPathname("/")}>
          Send
        </BSNav.Link>
        <BSNav.Link
          as={Link}
          to="/create"
          active={pathname === "/create"}
          onClick={() => setPathname("/create")}
        >
          Create Link
        </BSNav.Link>
      </BSNav>
    </Navbar>
  );
}
