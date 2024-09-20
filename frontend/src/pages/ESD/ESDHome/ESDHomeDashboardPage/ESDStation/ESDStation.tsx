import React, { useState } from "react";
import { Card, Switch, Button } from "antd";
import ComputerIcon from "@mui/icons-material/Computer";
import AddIcon from "@mui/icons-material/Add";

interface CardProps {
  id: string;
  title: string;
  content?: boolean[];
}

const ESDStation: React.FC<CardProps> = ({ title, content = [] }) => {
  const maxCells = 6;

  return (
    <Card
      title={title}
      style={{
        width: "120px",
        height: "200px",
        padding: "10px",
        gap: "10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          width: "100%",
        }}
      >
        {Array.from({ length: maxCells }).map((_, index) => (
          <div
            key={index}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
            }}
          >
            {content[index] ? (
              <ComputerIcon style={{ fontSize: "24px", color: "#1890ff" }} />
            ) : (
              <AddIcon style={{ fontSize: "24px", color: "#d9d9d9" }} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
export default ESDStation;
