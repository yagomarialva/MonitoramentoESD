import React, { useState, useEffect } from "react";
import ESDLine from "../ESDLine/ESDLine";
import { getAllStationMapper } from "../../../../../api/mapingAPI";
import "./ESDFactoryMap.css";
import ESDStation from "../ESDStation/ESDStation";

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

interface AppState {
  [key: string]: { links: Link[]; stations: Set<number> };
}

const ESDFactoryMap: React.FC = () => {
  const [columns, setColumns] = useState<AppState>({});
  const [stationsData, setStationsData] = useState<StationEntry[]>([]);

  // Função para buscar os dados da API e atualizar o estado
  const fetchStations = async () => {
    try {
      const factoryMap = await getAllStationMapper();

      const groupedByLines: AppState = {};
      
      factoryMap.forEach((element: Link) => {
        const lineName = element.line.name || "Sem Nome";
        if (!groupedByLines[lineName]) {
          groupedByLines[lineName] = { links: [], stations: new Set() };
        }
        groupedByLines[lineName].links.push(element);
        element.stations.forEach((stationEntry: StationEntry) => {
          groupedByLines[lineName].stations.add(stationEntry.station.id);
        });
      });

      setColumns(groupedByLines); // Atualizando o estado de colunas
      setStationsData(factoryMap); // Atualizando o estado com os dados das estações
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  // useEffect para buscar os dados na montagem do componente
  useEffect(() => {
    fetchStations(); // Chama a função para buscar os dados
  }, []);

  // Função para atualizar os dados ao chamar o `onUpdate` no componente filho
  const handleUpdate = () => {
    fetchStations(); // Atualiza ao ser chamado
  };

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
                  onUpdate={handleUpdate} // Passa a função de atualização
                  lineName={lineName} // Passa o nome da linha
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
