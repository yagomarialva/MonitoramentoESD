import React, { useState } from "react";
import { Card, Switch, Button } from "antd";
import ComputerIcon from "@mui/icons-material/Computer";
import AddIcon from "@mui/icons-material/Add";

interface LineProps {
  title: string;
  children: React.ReactNode;
}

const ESDLine: React.FC<LineProps> = ({ title, children }) => (
  <div
    style={{
      flex: 1,
      padding: "20px",
      minHeight: "500px",
      border: "2px dashed #d9d9d9",
      borderRadius: "8px",
      backgroundColor: "#fafafa",
      margin: "0 15px",
      textAlign: "center",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
      transition: "background-color 0.3s ease",
    }}
  >
    {/* <h3 style={{ marginBottom: "20px", fontSize: "18px", color: "#333" }}>
      {title}
    </h3> */}
    {children}
  </div>
);
export default ESDLine;
