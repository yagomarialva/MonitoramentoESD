import React, { useState, useEffect } from "react";
import ESDLine from "../ESDLine/ESDLine";
import { getAllStationMapper } from "../../../../../api/mapingAPI";
import Card from "antd/es/card/Card";
import ComputerIcon from "@mui/icons-material/Computer";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "antd"; // Importando o Tooltip do Ant Design

interface Station {
  id: number;
  name: string;
  sizeX: number;
  sizeY: number;
}

interface MonitorDetails {
  serialNumber: string;
  description: string;
}

interface Monitor {
  positionSequence: number;
  monitorsEsd: MonitorDetails;
}

interface StationEntry {
  station: Station;
  monitorsEsd: Monitor[];
}

interface Line {
  id: number;
  name: string;
}

interface Link {
  id: number;
  line: Line;
  stations: StationEntry[];
}

interface AppState {
  [key: string]: { links: Link[]; stations: Set<number> };
}

const ESDFactoryMap: React.FC = () => {
  const [columns, setColumns] = useState<AppState>({});

  const getAllLinksHandler = async () => {
    const factoryMap = await getAllStationMapper();

    const groupedByLines: AppState = {};

    factoryMap.forEach((element: Link) => {
      const lineId = element.line.id;
      if (!groupedByLines[lineId]) {
        groupedByLines[lineId] = { links: [], stations: new Set() };
      }
      groupedByLines[lineId].links.push(element);
      element.stations.forEach((stationEntry: StationEntry) => {
        groupedByLines[lineId].stations.add(stationEntry.station.id);
      });
    });
    setColumns(groupedByLines);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllLinksHandler();
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "40px", backgroundColor: "#f0f2f5" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {Object.keys(columns).map((lineName) => (
          <ESDLine key={lineName} title={lineName}>
            {Array.from(columns[lineName]?.stations || []).map((stationId) => {
              const stationEntry = columns[lineName].links
                .flatMap((link) => link.stations)
                .find((entry: StationEntry) => entry.station.id === stationId);

              if (stationEntry) {
                const maxCells = 12; // Maximo de 12 celulas
                const displayItems = Array.from({ length: maxCells }, (_, index) => {
                  const monitor = stationEntry.monitorsEsd[index];

                  return monitor ? (
                    <Tooltip
                      key={monitor.monitorsEsd.serialNumber}
                      title={
                        <div>
                          <strong>Serial Number:</strong> {monitor.monitorsEsd.serialNumber}
                          <br />
                          <strong>Description:</strong> {monitor.monitorsEsd.description}
                        </div>
                      }
                      placement="top" // Define o posicionamento do tooltip
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ComputerIcon style={{ fontSize: "24px", color: "#1890ff", marginRight: "8px" }} />
                      </div>
                    </Tooltip>
                  ) : (
                    <AddIcon key={index} style={{ fontSize: "24px", color: "#d9d9d9" }} />
                  );
                });

                return (
                  <Card key={stationEntry.station.id} title={stationEntry.station.name}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)", // Duas colunas
                        gap: "8px",
                      }}
                    >
                      {displayItems}
                    </div>
                  </Card>
                );
              }
              return null;
            })}
          </ESDLine>
        ))}
      </div>
    </div>
  );
};

export default ESDFactoryMap;
