import React, { useState } from "react";
import Line from "../ESDLine/Line";
import "./FactoryMap.css"; // Importando o CSS
import AddIcon from "@mui/icons-material/Add"; // Importando o ícone Add
import LineForm from "../../../Line/LineForm/LineForm";
import {
  createLine,
  getAllLines,
  getLineByName,
} from "../../../../../api/linerApi";
import {
  createStation,
  getAllStations,
  getStationByName,
} from "../../../../../api/stationApi";
import { createLink } from "../../../../../api/linkStationLine";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; // Importa o botão do Ant Design
import { PlusOutlined } from "@ant-design/icons"; // Importa o ícone de adicionar
import { Alert, Snackbar } from "@mui/material";

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

// Definir os tipos possíveis de severidade para o snackbar
type SnackbarSeverity = "success" | "error";

const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onUpdate }) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    openModal: false,
    openLineModal: false,
    snackbarMessage: "", // Mensagem do Snackbar
    snackbarOpen: false,
    snackbarSeverity: "success" as SnackbarSeverity, // Severidade do Snackbar
  });

  // Atualiza o estado com os tipos corretos
  const handleStateChange = (changes: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const showSnackbar = (
    message: string,
    severity: SnackbarSeverity = "success"
  ) => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true, // Abrir o Snackbar
    });
  };

  // Função para agrupar as linhas por id, removendo duplicados por linkStationAndLineID
  const groupLinesById = (lines: Link[]) => {
    const grouped: { [key: number]: Link } = {};

    function filterMonitors(uniqueStations: StationEntry[]) {
      uniqueStations.forEach((stationEntry) => {
        const uniqueMonitors: Monitor[] = [];

        stationEntry.monitorsEsd.forEach((monitor) => {
          // Verifica se já existe um monitor com o mesmo ID
          const exists = uniqueMonitors.find(
            (m) => m.monitorsEsd.id === monitor.monitorsEsd.id
          );

          // Se não existir, adiciona o monitor à lista
          if (!exists) {
            uniqueMonitors.push(monitor);
          }
        });

        // Atualiza a lista de monitores sem duplicatas
        stationEntry.monitorsEsd = uniqueMonitors;
      });
    }

    lines.forEach((link) => {
      const lineId = link.line.id || 0; // Caso o id seja indefinido, usar 0 como fallback

      if (!grouped[lineId]) {
        grouped[lineId] = {
          ...link,
          stations: [],
        };
      }

      // Remover duplicados com o mesmo linkStationAndLineID
      const uniqueStations = link.stations.filter(
        (stationEntry) =>
          !grouped[lineId].stations.some(
            (existingStation) =>
              existingStation.linkStationAndLineID ===
              stationEntry.linkStationAndLineID
          )
      );

      // Remover monitores duplicados com o mesmo ID dentro de cada estação
      filterMonitors(uniqueStations);

      grouped[lineId].stations = [
        ...grouped[lineId].stations,
        ...uniqueStations,
      ];
    });

    return Object.values(grouped); // Retorna um array de linhas agrupadas
  };

  const groupedLines = groupLinesById(lines); // Agrupa as linhas antes de renderizar

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
      await getAllLines();
      const lineName = await getLineByName(createdLine.name);
      const station = {
        name: createdLine.name,
        sizeX: 6,
        sizeY: 6,
      };
      const stationCreated = await createStation(station);
      await getAllStations();
      const stationName = await getStationByName(stationCreated.name);
      const link = {
        ordersList: 0,
        lineID: createdLine.id,
        stationID: stationName.id,
      };
      await createLink(link);
      onUpdate();

      // Exibir mensagem de sucesso no Snackbar
      showSnackbar("Linha criada com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao criar e mapear o monitor:", error);
      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem("token");
        navigate("/");
      }

      // Exibir mensagem de erro no Snackbar
      showSnackbar("Erro ao criar a linha.", "error");
    }
  };

  return (
    <>
      <div className="container">
        <div className="line-container">
          {groupedLines.map((link) => (
            <Line key={link.id} lineData={link} />
          ))}
        </div>
        {/* Botão fixo no canto inferior direito */}
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size="large"
          className="add-icon-fixed"
          onClick={handleOpenLineModal}
        >
          Adicionar linha
        </Button>
        <LineForm
          open={state.openLineModal}
          handleClose={handleCloseLineModal}
          onSubmit={handleCreateLine}
        />
        <Snackbar
          open={state.snackbarOpen}
          autoHideDuration={6000}
          onClose={() => handleStateChange({ snackbarOpen: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          className={`ant-snackbar ant-snackbar-${state.snackbarSeverity}`}
        >
          <Alert
            onClose={() => handleStateChange({ snackbarOpen: false })}
            severity={state.snackbarSeverity}
            className="ant-alert"
          >
            {state.snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default FactoryMap;
