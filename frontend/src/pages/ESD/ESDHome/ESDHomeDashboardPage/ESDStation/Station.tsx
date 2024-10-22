import React, { useEffect, useState, useCallback } from "react";
import { Tooltip, message } from "antd";
import ComputerIcon from "@mui/icons-material/Computer";
import { Alert, Snackbar } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import "./Station.css"; // Importando o CSS
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createMonitor, getMonitor, updateMonitor } from "../../../../../api/monitorApi";
import {
  createStationMapper,
  getAllStationMapper,
  getAllStationView,
} from "../../../../../api/mapingAPI";
import Monitor from "../ESDMonitor/Monitor";
import ReusableModal from "../../ReausableModal/ReusableModal";
import MonitorForm from "../../MonitorForm/MonitorForm";
import { deleteStation } from "../../../../../api/stationApi";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Description } from "@mui/icons-material";
// import MonitorEditForm from "../../MonitorEditForm/MonitorEditForm";

interface Station {
  id?: number;
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

interface StationProps {
  stationEntry: StationEntry;
  onUpdate: () => void; // Prop para disparar a atualização
}

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

type SnackbarSeverity = "success" | "error";

const Station: React.FC<StationProps> = ({ stationEntry, onUpdate }) => {
  const { station, monitorsEsd } = stationEntry;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [modalText, setModalText] = useState<any | null>("-");
  const [modalTitleText, setModalTitleText] = useState<any | null>("-");
  const [modalIndexText, setModalIndexTitleText] = useState<any | null>("-");

  const [modalVisible, setModalVisible] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState<any | null>(null);

  const [socketUrl, setSocketUrl] = useState("wss://echo.websocket.org");
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleModalClose = () => {
    setModalVisible(false);
  };

  const [state, setState] = useState({
    snackbarMessage: "", // Mensagem do Snackbar
    snackbarOpen: false,
    snackbarSeverity: "success" as SnackbarSeverity, // Severidade do Snackbar
  });

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

  // Atualiza o estado com os tipos corretos
  const handleStateChange = (changes: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleCreateMonitor = async (monitor: any) => {
    try {
      const result = await createMonitor(monitor);
      const selectedCell = {
        monitorEsdId: result.id,
        linkStationAndLineId: selectedMonitor.stationInfo.linkStationAndLineID,
        positionSequence: selectedMonitor.index,
      };

      await createStationMapper(selectedCell);

      onUpdate(); // Dispara a atualização
      setOpenModal(false); // Fecha o modal após a criação
      // Mostra o Snackbar de sucesso
      showSnackbar(
        `Monitor ${result.serialNumber} adicionado com sucesso!`,
        "success"
      );
    } catch (error: any) {
      console.error("Erro ao criar monitor:", error);
      showSnackbar(`Monitor não foi adicionado!`, "error");
      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const fetchStations = async () => {
    try {
      await getAllStationView();
      await getAllStationMapper();
    } catch (error: any) {
      console.error("Erro ao buscar estações:", error);
      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const showMessage = (content: string, type: "success" | "error") => {
    message[type](content); // Exibe uma mensagem de sucesso ou erro
  };

  useEffect(() => {
    fetchStations();

    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("wss://demos.kaazing.com/echo"),
    []
  );
  const cells = new Array(12).fill(null);
  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  monitorsEsd.forEach((monitor) => {
    cells[monitor.positionSequence] = monitor;
  });

  const handleEditCellChange = async (params: any) => {
    try {
      const monitorView = await getMonitor(selectedMonitor.cell.serialNumber);
      const updatedResult = {
        id: monitorView.id,
        serialNumber: params.serialNumber,
        description: params.description
      }
      const result = await updateMonitor(updatedResult)
      showSnackbar(
        t("ESD_MONITOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      onUpdate(); // Chama a função onUpdate para atualizar a visualização
      return result; // Retorna os resultados atualizados
    } catch (error: any) {
      showSnackbar(
        t("ESD_MONITOR.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
      if (error.message === "Request failed with status code 401") {
        showMessage("Sessão Expirada.", "error");
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const handleCellClick = (
    cell: any | "null",
    index: number,
    stationInfo: any
  ) => {
    const selectedCell = {
      cell: cell
        ? cell.monitorsEsd
        : {
            serialNumber: "N/A",
            description: "Célula vazia",
            stationInfo,
          },
      index,
      stationInfo,
    };
    setSelectedMonitor(selectedCell);
    setModalText(selectedCell.cell.description);
    setModalTitleText(selectedCell.cell.serialNumber);
    setModalIndexTitleText(index);
  };

  return (
    <>
      <div className="card-grid">
        {cells.map((cell, index) => (
          <div
            key={index}
            className="icon-container"
            onClick={() => handleCellClick(cell, index, stationEntry)}
          >
            {cell ? (
              <Tooltip title={cell.monitorsEsd.serialNumber}>
                <div className="computer-icon">
                  <ComputerIcon
                    className="dut-icon"
                    onClick={() => setModalVisible(true)}
                  />
                </div>
              </Tooltip>
            ) : (
              <div className="add-icon" onClick={handleOpenModal}>
                <AddCircleOutlineRoundedIcon className="cell-icon" />
              </div>
            )}
          </div>
        ))}
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

      <ReusableModal
        visible={modalVisible}
        onClose={handleModalClose}
        onEdit={() => console.log("Editar")}
        onDelete={() => console.log("Excluir")}
        onUpdate={onUpdate}
        title={modalTitleText}
        monitor={{
          positionSequence: selectedMonitor?.index,
          monitorsESD: {
            id: selectedMonitor?.index,
            serialNumber: modalTitleText,
            description: selectedMonitor?.cell.description,
            statusJig: "TRUE",
            statusOperador: "FALSE",
          },
        }}
        onSubmit={handleEditCellChange}
      />
      <MonitorForm
        open={openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateMonitor}
      />
    </>
  );
};

export default Station;
