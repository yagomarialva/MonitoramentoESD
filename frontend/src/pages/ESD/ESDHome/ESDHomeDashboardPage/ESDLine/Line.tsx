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
  onUpdate: () => void; // Nova prop para receber a função onUpdate
}

const Line: React.FC<ESDStationProps> = ({ lineData, onUpdate }) => {
  const [createdLinks, setCreatedLinks] = useState<Set<number>>(new Set()); // Estado para controlar os links criados
  const [stations, setStations] = useState<StationEntry[]>(lineData.stations); // Estado para armazenar as estações

  const fetchStations = async () => {
    try {
      const stationsData = await getAllStations();
      setStations(stationsData); // Atualiza o estado com as estações
    } catch (error) {
      console.error("Erro ao buscar as estações:", error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []); // Agora ele será chamado quando `stations` mudar

  const handleCreateStation = async () => {
    const randomStationName = `Estação ${Math.floor(Math.random() * 1000000)}`;
    const linkId = lineData.id;
    const station = {
      name: randomStationName,
      sizeX: 6,
      sizeY: 6,
    };

    if (createdLinks.has(linkId)) {
      return; // Se o link já foi criado, não faz nada
    }

    try {
      const newStation = await createStation(station);
      const stationName = await getStationByName(newStation.name);
      const link = {
        ordersList: stationName.id,
        lineID: lineData.line.id,
        stationID: stationName.id,
      };

      await createLink(link);

      // Adiciona a nova estação ao estado
      setStations((prevStations) => [
        ...prevStations,
        {
          station: {
            id: stationName.id,
            name: stationName.name,
            sizeX: newStation.sizeX,
            sizeY: newStation.sizeY,
            linkStationAndLineID: linkId,
          },
          linkStationAndLineID: linkId,
          monitorsEsd: [], // Adiciona um array vazio de monitores, se necessário
        },
      ]);
      // Chama a função onUpdate após a criação da nova estação
      onUpdate();
    } catch (error) {
      console.error("Erro ao criar e mapear a estação:", error);
    }
  };

  return (
    <div className="line-container">
      <div className="esd-line-container">
        {lineData.stations.map((stationEntry) => (
          <Station key={stationEntry.station.id} stationEntry={stationEntry} />
        ))}
        <div className="add-button-container">
          <AddIcon onClick={handleCreateStation} style={{ cursor: "pointer" }} />
        </div>
      </div>
    </div>
  );
};

export default Line;
