import React, { useState } from "react";
import Line from "../ESDLine/Line";
import "./FactoryMap.css"; // Importando o CSS
import AddIcon from "@mui/icons-material/Add"; // Importando o ícone Add
import LineForm from "../../../Line/LineForm/LineForm";
import { createLine } from "../../../../../api/linerApi";
import { createStation } from "../../../../../api/stationApi";
import { createLink } from "../../../../../api/linkStationLine";

interface Station {
  id: number;
  linkStationAndLineID: number;
  name: string;
  sizeX: number;
  sizeY: number;
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
  monitorsEsd: Monitor[];
}

interface LineData {
  id?: number;
  name: string;
}

interface Link {
  id: number;
  line: LineData;
  stations: StationEntry[];
}

interface FactoryMapProps {
  lines: Link[];
  onUpdate: () => void;
}

const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onUpdate }) => {
  const [state, setState] = useState({
    openModal: false,
    openLineModal: false,
  });

  const handleStateChange = (changes: {
    openModal: boolean;
    openLineModal?: boolean;
  }) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleOpenLineModal = () =>
    handleStateChange({
      openLineModal: true,
      openModal: false,
    });

  const handleCloseLineModal = () =>
    handleStateChange({
      openLineModal: false,
      openModal: false,
    });

  const handleCreateLine = async (line: LineData) => {
    try {
      const createdLine = await createLine(line);
      const station = {
        id: line.id,
        name: createdLine.name,
        sizeX: 6,
        sizeY: 6,
      };
      const stationCreated = await createStation(station);
      const link = {
        ordersList: 0,
        lineID: createdLine.id,
        stationID: stationCreated.id,
      };
    //   console.log("mappMonitor", station);
      await createLink(link);
      onUpdate();
    } catch (error) {
      console.error("Erro ao criar e mapear o monitor:", error);
    }
  };
  return (
    <>
      <div className="container">
        <div className="line-container">
          {lines.map((link) => (
            <>
              <AddIcon className="add-icon" onClick={handleOpenLineModal} />{" "}
              <Line key={link.id} lineData={link} />
            </>
          ))}
        </div>
        <LineForm
          open={state.openLineModal}
          handleClose={handleCloseLineModal}
          onSubmit={handleCreateLine}
        />
      </div>
    </>
  );
};

export default FactoryMap;
