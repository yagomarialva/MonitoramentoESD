import React from "react";
import Monitor from "../ESDMonitor/Monitor";
import { Tooltip } from "antd";
import ComputerIcon from "@mui/icons-material/Computer";
import AddIcon from "@mui/icons-material/Add";
import "./Station.css"; // Importando o CSS

interface Station {
  id?: number;
  linkStationAndLineID: number;
  name: string;
  sizeX: number; // Usado apenas para referência
  sizeY: number; // Usado apenas para referência
}

interface MonitorDetails {
  id: number;
  serialNumber: string;
  description: string;
  statusJig: string;
  statusOperador: string;
  linkStationAndLineID: number;
}

interface Monitor {
  positionSequence: number;
  monitorsEsd: MonitorDetails;
}

interface StationEntry {
  station: Station;
  linkStationAndLineID: number;
  monitorsEsd: Monitor[]; // Array de monitores
}

interface StationProps {
  stationEntry: StationEntry;
}

const Station: React.FC<StationProps> = ({ stationEntry }) => {
  const { monitorsEsd } = stationEntry;

  // Cria um array de 12 células inicializadas como null
  const cells = new Array(12).fill(null);

  // Preenche as células com monitores com base em positionSequence
  monitorsEsd.forEach((monitor) => {
    cells[monitor.positionSequence] = monitor;
  });

  return (
    <>
    <div className="card-grid">
      {cells.map((cell, index) => (
        <div key={index} className="icon-container">
          {cell ? (
            <Tooltip title={cell.monitorsEsd.serialNumber}>
              <ComputerIcon className="computer-icon" />
            </Tooltip>
          ) : (
            <AddIcon className="add-icon" />
          )}
        </div>
      ))}
    </div>
    </>
  );
};

export default Station;
