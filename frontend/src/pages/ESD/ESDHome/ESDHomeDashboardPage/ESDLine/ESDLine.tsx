import React from "react";
import "./ESDLine.css";

interface LineProps {
  title: string;
  children: React.ReactNode;
}

const ESDLine: React.FC<LineProps> = ({ title, children }) => (
  <>
    {/* <h3 className="esd-line-title">{title}</h3> */}
    <div className="esd-line-container">{children}</div>
  </>
);

export default ESDLine;
