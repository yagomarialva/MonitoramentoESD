import React, { useState, useEffect } from "react";
import { Card, Switch, Button } from "antd";
import ComputerIcon from "@mui/icons-material/Computer";
import AddIcon from "@mui/icons-material/Add";
import ESDStation from "../ESDStation/ESDStation";
import ESDLine from "../ESDLine/ESDLine";
import { getAllLines } from "../../../../../api/linerApi";
import { getAllLinks } from "../../../../../api/linkStationLine";
interface AppState {
  [key: string]: {
    id: string;
    title: string;
    content: boolean[];
  }[];
}

const ESDFactoryMap: React.FC = () => {
  const [columns, setColumns] = useState<AppState>({});
  async function getAllLinersHandler(
    setColumns: React.Dispatch<React.SetStateAction<AppState>>
  ) {
    const lines = await getAllLinks();
    console.log("lines", lines);
    lines.map((line: any) => {
      const newColumnKey = `${line.name}`;
      setColumns((prevColumns) => ({
        ...prevColumns,
        [newColumnKey]: [],
      }));
    });
  }

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        await getAllLinersHandler(setColumns);
        const linkedStation = await getAllLinks();
        linkedStation.map((link: any)=>{
            console.log('link',link.line.name)
            // const newCard = {
            //     id: `card${Date.now()}`,
            //     title: `New Card ${Date.now()}`,
            //     content: [false, false, false, false, false, false],
            //   };
          
            //   setColumns((prevColumns) => ({
            //     ...prevColumns,
            //     column1: [...prevColumns.column1, newCard],
            //   }));
        })
        // console.log('links', linkedStation)
      } catch (error: any) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
        }
      }
    };
    fetchDataAllUsers();
  }, []);

  const createNewCard = () => {
    const newCard = {
      id: `card${Date.now()}`,
      title: `New Card ${Date.now()}`,
      content: [false, false, false, false, false, false],
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      column1: [...prevColumns.column1, newCard],
    }));
  };

  const createNewColumn = () => {
    const newColumnKey = `column${Date.now()}`;
    setColumns((prevColumns) => ({
      ...prevColumns,
      [newColumnKey]: [],
    }));
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f0f2f5" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button type="primary" onClick={createNewCard}>
          Create New Card
        </Button>
        <Button
          type="default"
          onClick={createNewColumn}
          style={{ marginLeft: "10px" }}
        >
          Create New Column
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {Object.keys(columns).map((columnKey) => (
          <ESDLine key={columnKey} title={columnKey}>
            {columns[columnKey].map((card) => (
              <ESDStation
                key={card.id}
                title={card.title}
                content={card.content}
                id={""}
              />
            ))}
          </ESDLine>
        ))}
      </div>
    </div>
  );
};

export default ESDFactoryMap;
