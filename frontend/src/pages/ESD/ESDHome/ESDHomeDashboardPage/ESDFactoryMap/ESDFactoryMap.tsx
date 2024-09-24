import React, { useState, useEffect } from "react";
import ESDLine from "../ESDLine/ESDLine";
import { getAllStationMapper } from "../../../../../api/mapingAPI";
import "./ESDFactoryMap.css";
import ESDStation from "../ESDStation/ESDStation";

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

              return stationEntry ? (
                <ESDStation
                  key={stationEntry.station.id}
                  stationEntry={stationEntry}
                  lineName={lineName}
                />
              ) : null;
            })}
          </ESDLine>
        ))}
      </div>
    </div>
  );
};

export default ESDFactoryMap;
