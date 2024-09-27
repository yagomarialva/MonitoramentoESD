import React, { useState, useEffect } from "react";
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
  id?: number;
  name: string;
  sizeX: number;
  sizeY: number;
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

  const [lines, setLines] = useState<{ [key: number]: StationEntry[] }>({}); // Estado para armazenar os links agrupados

  // Função para buscar todas as linhas e estações da API
  const fetchLinks = async () => {
    // const linksData = await getAllLinks();
    // const groupedLines = groupLinesById(linksData); // Agrupa as linhas por ID
    // console.log('groupedLines', linksData)
    try {
      const linksData = await getAllLinks();
      const groupedLines = groupLinesById(linksData); // Agrupa as linhas por ID
      console.log('groupedLines', groupedLines)
      setLines(groupedLines); // Atualiza o estado com as linhas agrupadas
    } catch (error) {
      console.error("Erro ao buscar as linhas:", error);
    }
  };

  const handleStateChange = (changes: {
    open: boolean;
    openModal: boolean;
  }) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleOpenStationModal = () =>
    handleStateChange({
      openModal: true,
      open: false,
    });

  const handleCloseStationModal = () =>
    handleStateChange({
      openModal: false,
      open: false,
    });

  const handleClick = () => {
    console.log("Informações da linha clicada:", lineData);
    handleOpenStationModal(); // Abre o modal quando a linha é clicada
  };

  // Função para agrupar linhas por ID
  const groupLinesById = (links: Link[]) => {
    const grouped: { [key: number]: StationEntry[] } = {};

    links.forEach((link) => {
      const lineId = link.line.id || 0; // Caso o ID seja nulo, usa 0 como fallback

      if (!grouped[lineId]) {
        grouped[lineId] = [];
      }

      grouped[lineId] = [...grouped[lineId], ...link.stations];
    });

    return grouped;
  };

  useEffect(() => {
    fetchLinks(); // Chama a função para buscar os links quando o componente for montado
  }, []);

  const handleCreateStation = async (station: any) => {
    console.log("Informações da linha clicada:", lineData.line);
    try {
      const newStation = await createStation(station);
      // console.log("newStation", newStation);
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
    </>
  );
};

export default Line;
