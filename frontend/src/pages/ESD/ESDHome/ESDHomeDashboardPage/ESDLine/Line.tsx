import React, { useState, useEffect } from "react";
import Station from "../ESDStation/Station";
import AddIcon from "@mui/icons-material/Add"; // Importando o ícone Add
import "./Line.css"; // Importando o CSS
import {
  createStation,
  getAllStations,
  getStationByName,
} from "../../../../../api/stationApi";
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
}

const Line: React.FC<ESDStationProps> = ({ lineData }) => {
  const [state, setState] = useState({
    open: false,
    openModal: false,
  });

  const [lines, setLines] = useState<{ [key: number]: StationEntry[] }>({}); // Estado para armazenar os links agrupados
  const [createdLinks, setCreatedLinks] = useState<Set<number>>(new Set()); // Estado para controlar os links criados
  const [stations, setStations] = useState<StationEntry[]>(lineData.stations); // Estado para armazenar as estações

  const fetchStations = async () => {
    try {
      const stationsData = await getAllStations();
      console.log("stationsData", stationsData);
      setStations(stationsData); // Atualiza o estado com as estações
    } catch (error) {
      console.error("Erro ao buscar as estações:", error);
    }
  };

  // Função para buscar todas as linhas e estações da API
  const fetchLinks = async () => {
    try {
      const linksData = await getAllLinks();
      setLines(linksData); // Atualiza o estado com as linhas agrupadas
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

  useEffect(() => {
    fetchLinks();
    fetchStations();
  }, []); // Agora ele será chamado quando `lineData` ou `stations` mudar

  const handleCreateStation = async (station: any) => {
    const linkId = lineData.id;

    if (createdLinks.has(linkId)) {
      return;
    }

    try {
      const newStation = await createStation(station);
      const stationName = await getStationByName(newStation.name);
      const link = {
        ordersList: lineData.id,
        lineID: lineData.line.id,
        stationID: stationName.id,
      };

      await createLink(link);
      // Atualiza o estado de lines para incluir o novo link
      setLines((prevLines) => ({
        ...prevLines,
        [linkId]: [
          ...(prevLines[linkId] || []),
          {
            station: {
              id: stationName.id,
              name: stationName.name,
              sizeX: station.sizeX,
              sizeY: station.sizeY,
              linkStationAndLineID: linkId, // Adiciona a propriedade linkStationAndLineID
            },
            linkStationAndLineID: linkId,
            monitorsEsd: [], // Inicialize conforme necessário
          } as StationEntry, // Força a tipagem correta
        ],
      }));
      setCreatedLinks((prevLinks) => new Set(prevLinks).add(linkId));
      await getAllLinks();
    } catch (error) {
      console.error("Erro ao criar e mapear a estação:", error);
    }
  };

  return (
    <>
      <div className="line-container">
        <div className="esd-line-container">
          <div className="add-button-container">
            <AddIcon onClick={handleClick} style={{ cursor: "pointer" }} />
          </div>
          {/* <div className="esd-line-title">
            {lineData.line.name || "Sem Nome"}
          </div> */}
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
