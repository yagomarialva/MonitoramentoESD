import React from "react";
import Menu from "../../../pages/Menu/Menu";
import LineTable from "../../../pages/ESD/Line/LineTable/LineTable";

function Line() {
  return <Menu componentToShow={<LineTable />} />;
}

export default Line;
