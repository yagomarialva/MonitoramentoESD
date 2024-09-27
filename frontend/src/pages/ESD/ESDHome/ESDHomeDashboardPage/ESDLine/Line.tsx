import React, { useState } from "react";
import Station from "../ESDStation/Station";
import AddIcon from "@mui/icons-material/Add"; // Importando o ícone Add
import "./Line.css"; // Importando o CSS
import { createStation } from "../../../../../api/stationApi";
import { createLink, getAllLinks } from "../../../../../api/linkStationLine";
import StationForm from "../../../Station/StationForm/StationForm";

interface StationLine {
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
  station: StationLine;
  linkStationAndLineID: number;
  monitorsEsd: Monitor[];
}

interface StationData {
  id?: number; // Deve ser sempre um número
  name: string;
  sizeX: number; // Aqui, deve ser um número, não um número ou undefined
  sizeY: number; // O mesmo se aplica aqui
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

interface ESDStationProps {
  lineData: Link;
  // onUpdate: () => void;
}

const Line: React.FC<ESDStationProps> = ({ lineData }) => {
  const [state, setState] = useState({
    open: false,
    openModal: false,
  });

  const handleStateChange = (changes: { open: boolean; openModal: boolean }) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleOpenStationModal = () => handleStateChange({
    openModal: true,
    open: false
  });

  const handleCloseStationModal = () => handleStateChange({
    openModal: false,
    open: false
  });

  const handleClick = () => {
    console.log("Informações da linha clicada:", lineData);
    handleOpenStationModal(); // Abre o modal quando a linha é clicada
  };

  const handleCreateStation = async (station: any) => {
    console.log("Informações da linha clicada:", lineData.line);
    try {
      const newStation = await createStation(station);
      console.log('newStation',newStation)
      const link = {
        ordersList: lineData.id,
        lineID: lineData.line.id,
        stationID: newStation.id,
      };
      await createLink(link);
    } catch (error) {
      console.error("Erro ao criar e mapear o monitor:", error);
    }
  };
  

  return (
    <>
      <div className="line-container">
        <div className="esd-line-container">
          <div className="add-button-container">
            <AddIcon onClick={handleClick} style={{ cursor: "pointer" }} />
          </div>
          <div className="esd-line-title">
            {lineData.line.name || "Sem Nome"}
          </div>
          {lineData.stations.map((stationEntry) => (
            <Station
              key={stationEntry.station.id}
              stationEntry={stationEntry}
            />
          ))}
        </div>
      </div>
      <StationForm
        open={state.openModal}
        handleClose={handleCloseStationModal}
        onSubmit={handleCreateStation}
      />

      {/* <StationForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateStation}
      /> */}
    </>
  );
};

export default Line;
