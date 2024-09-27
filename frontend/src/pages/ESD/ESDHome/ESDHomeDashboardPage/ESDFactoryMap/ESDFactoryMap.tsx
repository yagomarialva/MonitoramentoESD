import React, { useState, useEffect } from "react";
import { getAllStationMapper } from "../../../../../api/mapingAPI";
import "./ESDFactoryMap.css";
import FactoryMap from "./FactoryMap";
import { useNavigate } from "react-router-dom";

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

interface Line {
  id?: number;
  name: string;
}

interface Link {
  id: number;
  line: Line;
  stations: StationEntry[];
}

const ESDFactoryMap: React.FC = () => {
  const [stationsData, setStationsData] = useState<Link[]>([]);
  const navigate = useNavigate();

  // Função para buscar os dados da API e atualizar o estado
  const fetchStations = async () => {
    try {
      const factoryMap = await getAllStationMapper();
      setStationsData(factoryMap); // Atualiza o estado com os dados das estações
    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
    }
  };

  // useEffect para buscar os dados na montagem do componente
  useEffect(() => {
    fetchStations(); // Chama a função para buscar os dados
  }, [navigate]);

    // Função para atualizar os dados ao chamar o `onUpdate` no componente filho
    const handleUpdate = () => {
      fetchStations(); // Atualiza ao ser chamado
    };
  

  return (
    <>
    <FactoryMap lines={stationsData} onUpdate={handleUpdate} />
    </>
  );
};

export default ESDFactoryMap;
