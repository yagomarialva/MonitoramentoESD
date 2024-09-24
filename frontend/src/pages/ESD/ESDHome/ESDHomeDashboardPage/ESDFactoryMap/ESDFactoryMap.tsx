import React, { useState, useEffect } from "react";
import ESDLine from "../ESDLine/ESDLine";
import { getAllStationMapper } from "../../../../../api/mapingAPI";
import Card from "antd/es/card/Card";
import ComputerIcon from "@mui/icons-material/Computer";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "antd"; // Importando o Tooltip do Ant Design
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import "./ESDFactoryMap.css";

interface Station {
  id: number;
  linkStationAndLineID:number;
  name: string;
  sizeX: number;
  sizeY: number;
}

interface MonitorDetails {
  serialNumber: string;
  description: string;
  statusJig: string;      // Novo campo statusJig
  statusOperador: string; // Novo campo statusOperator
  linkStationAndLineID:number;
}

interface Monitor {
  positionSequence: number;
  monitorsEsd: MonitorDetails;
}

interface StationEntry {
  station: Station;
  linkStationAndLineID:number;
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
      const lineName = element.line.name || "Sem Nome"; // Usa o nome da linha ou "Sem Nome" se for nulo
      if (!groupedByLines[lineName]) {
        groupedByLines[lineName] = { links: [], stations: new Set() };
      }
      groupedByLines[lineName].links.push(element);
      element.stations.forEach((stationEntry: StationEntry) => {
        groupedByLines[lineName].stations.add(stationEntry.station.id);
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
    <div className="container">
      <div className="line-container">
        {Object.keys(columns).map((lineName) => (
          <ESDLine key={lineName} title={lineName}>
            {Array.from(columns[lineName]?.stations || []).map((stationId) => {
              const stationEntry = columns[lineName].links
                .flatMap((link) => link.stations)
                .find((entry: StationEntry) => entry.station.id === stationId);

              if (stationEntry) {
                const maxCells = 6;
              //  console.log('stationEntry', stationEntry.linkStationAndLineID)
                // Ordena os monitores pelo positionSequence
                const sortedMonitors = [...stationEntry.monitorsEsd].sort(
                  (a, b) => a.positionSequence - b.positionSequence
                );

                const displayItems = Array.from({ length: maxCells }, (_, index) => {
                  const monitor = sortedMonitors[index]; // Usa os monitores ordenados

                  return monitor ? (
                    <Tooltip
                      key={monitor.monitorsEsd.serialNumber}
                      title={
                        <div>
                          <strong>Position Sequence:</strong> {monitor.positionSequence}
                          <br />
                          <strong>Serial Number:</strong> {monitor.monitorsEsd.serialNumber}
                          <br />
                          <strong>Description:</strong> {monitor.monitorsEsd.description}
                          <br />
                          <strong>Status Jig:</strong> {monitor.monitorsEsd.statusJig}
                          <br />
                          <strong>Status Operator:</strong> {monitor.monitorsEsd.statusOperador}
                        </div>
                      }
                      placement="top"
                    >
                      <div
                        className="icon-container"
                        onClick={() =>
                          console.log(
                            `Link ID: ${stationEntry.linkStationAndLineID}, Linha: ${lineName}, Estação: ${stationEntry.station.name},Status Jig:${monitor.monitorsEsd.statusJig}, Status Operador:${monitor.monitorsEsd.statusOperador} Posição: ${monitor.positionSequence}`
                          )
                        }
                      >
                        <PointOfSaleOutlinedIcon className="computer-icon" />
                      </div>
                    </Tooltip>
                  ) : (
                    <AddIcon
                      key={index}
                      className="add-icon"
                      onClick={() =>
                        console.log(
                          `Link ID: ${stationEntry.linkStationAndLineID}, Linha: ${lineName}, Estação: ${stationEntry.station.name}, Posição: célula vazia ${index + 1}`
                        )
                      }
                    />
                  );
                });

                return (
                  <Card key={stationEntry.station.id} title={stationEntry.station.name}>
                    <div className="card-grid">{displayItems}</div>
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
