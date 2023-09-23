import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

function Layout() {
  return (
    <div className="container-fluid">
      <div >
        <div >
          <Menu />
        </div>
        <div className="col">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
