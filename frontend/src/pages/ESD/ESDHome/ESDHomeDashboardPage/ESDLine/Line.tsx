import React, { useState, useEffect } from "react";
import Station from "../ESDStation/Station";
import AddIcon from "@mui/icons-material/Add"; // Importando o ícone Add
import "./Line.css"; // Importando o CSS
import {
  Alert,
  IconButton,
  Snackbar,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  createStation,
  deleteStation,
  getAllStations,
  getStationByName,
} from "../../../../../api/stationApi";
import { createLink, deleteLink } from "../../../../../api/linkStationLine";
import { useNavigate } from "react-router-dom";

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

type SnackbarSeverity = "success" | "error";

const Line: React.FC<ESDStationProps> = ({ lineData, onUpdate }) => {
  const [createdLinks, setCreatedLinks] = useState<Set<number>>(new Set()); // Estado para controlar os links criados
  const [stations, setStations] = useState<StationEntry[]>(
    lineData.stations || []
  ); // Estado para armazenar as estações
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [state, setState] = useState({
    snackbarMessage: "", // Mensagem do Snackbar
    snackbarOpen: false,
    snackbarSeverity: "success" as SnackbarSeverity, // Severidade do Snackbar
  });

  // Atualiza o estado com os tipos corretos
  const handleStateChange = (changes: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleOpenModal = () => {
    setModalOpen(true); // Abrir o modal de confirmação
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Fechar o modal de confirmação
  };

  const navigate = useNavigate();

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

  const handleStationSelect = (stationEntry: StationEntry) => {
    setSelectedStationId(stationEntry.station.id);
    const selectedInfo = {
      line: lineData.line,
      station: stationEntry.station,
      linkId: stationEntry.linkStationAndLineID,
    };
    console.log("Informações da estação selecionada:", selectedInfo);
    return selectedInfo;
  };

  // const handleCreateStation = async () => {
  //   const randomStationName = `Estação ${Math.floor(Math.random() * 1000000)}`;
  //   const linkId = lineData.id;
  //   const station = {
  //     name: randomStationName,
  //     sizeX: 6,
  //     sizeY: 6,
  //   };

  //   if (createdLinks.has(linkId)) {
  //     return; // Se o link já foi criado, não faz nada
  //   }

  //   try {
  //     const newStation = await createStation(station);
  //     const stationName = await getStationByName(newStation.name);
  //     const link = {
  //       ordersList: stationName.id,
  //       lineID: lineData.line.id,
  //       stationID: stationName.id,
  //     };

  //     await createLink(link);

  //     // Adiciona a nova estação ao estado
  //     setStations((prevStations) => [
  //       ...prevStations,
  //       {
  //         station: {
  //           id: stationName.id,
  //           name: stationName.name,
  //           sizeX: newStation.sizeX,
  //           sizeY: newStation.sizeY,
  //           linkStationAndLineID: linkId,
  //         },
  //         linkStationAndLineID: linkId,
  //         monitorsEsd: [], // Adiciona um array vazio de monitores, se necessário
  //       },
  //     ]);
  //     // Chama a função onUpdate após a criação da nova estação
  //     onUpdate();
  //   } catch (error) {
  //     console.error("Erro ao criar e mapear a estação:", error);
  //   }
  // };

  // const handleReturnStationInfo = async () => {
  //   if (
  //     !lineData?.stations ||
  //     lineData.stations.length === 0 ||
  //     !selectedStationId
  //   ) {
  //     console.error(
  //       "Lista de estações ou ID de estação selecionada não estão definidos."
  //     );
  //     return;
  //   }

  //   const selectedStation = lineData.stations.find(
  //     (stationEntry) => stationEntry?.station?.id === selectedStationId
  //   );

  //   if (!selectedStation) {
  //     console.error("Estação selecionada não encontrada.");
  //     return;
  //   }

  //   try {
  //     const selectedInfo = handleStationSelect(selectedStation);
  //     console.log("Informações retornadas pelo botão:", selectedInfo.linkId);

  //     await deleteLink(selectedInfo.linkId);
  //     console.log(
  //       "Informações retornadas pelo botão:",
  //       selectedInfo.station.id
  //     );

  //     await deleteStation(selectedInfo.station.id);
  //     onUpdate();
  //     showSnackbar("Estação criada com sucesso!", "success");
  //   } catch (error: any) {
  //     console.error("Erro ao criar e mapear a estação:", error);
  //     if (error.message === "Request failed with status code 401") {
  //       localStorage.removeItem("token");
  //       navigate("/");
  //     }
  //   }
  // };
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

      // Mostra o Snackbar de sucesso
      showSnackbar("Estação criada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao criar e mapear a estação:", error);

      // Mostra o Snackbar de erro
      showSnackbar("Erro ao criar a estação.", "error");
    }
  };

  const handleReturnStationInfo = async () => {
    if (
      !lineData?.stations ||
      lineData.stations.length === 0 ||
      !selectedStationId
    ) {
      console.error(
        "Lista de estações ou ID de estação selecionada não estão definidos."
      );
      return;
    }

    const selectedStation = lineData.stations.find(
      (stationEntry) => stationEntry?.station?.id === selectedStationId
    );

    if (!selectedStation) {
      console.error("Estação selecionada não encontrada.");
      return;
    }

    try {
      const selectedInfo = handleStationSelect(selectedStation);
      console.log("Informações retornadas pelo botão:", selectedInfo.linkId);

      await deleteLink(selectedInfo.linkId);
      console.log(
        "Informações retornadas pelo botão:",
        selectedInfo.station.id
      );

      await deleteStation(selectedInfo.station.id);

      // Chama a função onUpdate após a exclusão da estação
      onUpdate();

      // Mostra o Snackbar de sucesso
      showSnackbar("Estação excluída com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao excluir a estação:", error);

      // Mostra o Snackbar de erro
      showSnackbar("Erro ao excluir a estação.", "error");

      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  return (
    <div className="line-container">
      <div className="esd-line-container">
        {lineData.stations.map((stationEntry) => (
          <div key={stationEntry.station.id}>
            <Station stationEntry={stationEntry} />
            <input
              type="radio"
              name="selectedStation"
              value={stationEntry.station.id}
              onChange={() => handleStationSelect(stationEntry)}
              checked={selectedStationId === stationEntry.station.id}
            />
          </div>
        ))}
      </div>
      <div className="add-button-container">
        <AddIcon
          onClick={handleCreateStation}
          style={{ cursor: "pointer", fontSize: "40px" }} // Tamanho do ícone aumentado para melhor usabilidade
        />
      </div>
      <button
        onClick={handleReturnStationInfo}
        disabled={selectedStationId === null}
      >
        Excluir Estação Selecionada
      </button>
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
  );
};

export default Line;
