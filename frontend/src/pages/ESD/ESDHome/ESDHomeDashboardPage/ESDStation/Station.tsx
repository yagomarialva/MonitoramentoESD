import React, { useEffect, useState, useCallback } from "react";
import { Tooltip, message } from "antd";
import ComputerIcon from "@mui/icons-material/Computer";
import { Alert, Snackbar } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import "./Station.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  createMonitor,
  getMonitor,
  updateMonitor,
} from "../../../../../api/monitorApi";
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
import signalRService from "../../../../../api/signalRService";

interface Station {
  id?: number;
  linkStationAndLineID: number;
  name: string;
  sizeX: number;
  sizeY: number;
}

interface LogData {
  serialNumber: string;
  status: number;
  description: string;
  messageType: string;
  timestamp: string;
  lastUpdated: string;
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
  onUpdate: () => void;
}

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
  const [error, setError] = useState<string | null>(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [monitorStatuses, setMonitorStatuses] = useState<{[key: string]: number}>({});
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleModalClose = () => {
    setModalVisible(false);
  };

  const [state, setState] = useState({
    snackbarMessage: "",
    snackbarOpen: false,
    snackbarSeverity: "success" as SnackbarSeverity,
  });

  const showSnackbar = (
    message: string,
    severity: SnackbarSeverity = "success"
  ) => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

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

      onUpdate();
      setOpenModal(false);
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

  const showMessage = (content: string, type: "success" | "error") => {
    message[type](content);
  };

  useEffect(() => {
    const connectToSignalR = async () => {
      try {
        await signalRService.startConnection();
        setError(null);
      } catch (err) {
        setError("Falha ao conectar ao SignalR");
      } finally {
        setLoading(false);
      }
    };

    connectToSignalR();

    signalRService.onReceiveAlert((log: LogData) => {
      setMonitorStatuses(prevStatuses => ({
        ...prevStatuses,
        [log.serialNumber]: log.status
      }));
      if (![0, 1].includes(log.status)) {
        const updatedLog = {
          ...log,
          status: -1,
          description: "Monitor desconectado",
          lastUpdated: new Date().toISOString(),
        };
        setLogs((prevLogs) => [updatedLog, ...prevLogs].slice(0, 100));
      } else {
        setLogs((prevLogs) => [log, ...prevLogs].slice(0, 100));
      }
      if (log.status === 0) {
        showSnackbar(
          `Erro no monitor ${log.serialNumber}: ${log.description}`,
          "error"
        );
      }
    });

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const cells = new Array(12).fill(null);

  monitorsEsd.forEach((monitor) => {
    cells[monitor.positionSequence] = monitor;
  });

  const handleEditCellChange = async (params: any) => {
    try {
      const monitorView = await getMonitor(selectedMonitor.cell.serialNumber);
      const updatedResult = {
        id: monitorView.id,
        serialNumber: params.serialNumber,
        description: params.description,
      };
      const result = await updateMonitor(updatedResult);
      showSnackbar(
        t("ESD_MONITOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      onUpdate();
      return result;
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

  const handleDelete = () => {
    console.log("Monitor deletado com sucesso!");
    showSnackbar(
      t("ESD_MONITOR.TOAST.DELETE_SUCCESS", {
        appName: "App for Translations",
      })
    );
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "green";
      case 0:
        return "red";
      default:
        return "grey";
    }
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
                    className={
                      monitorStatuses[cell.monitorsEsd.serialNumber] === 1
                        ? "dut-icon-success"
                        : monitorStatuses[cell.monitorsEsd.serialNumber] === 0
                        ? "dut-icon-error"
                        : "dut-icon-default"
                    }
                    style={{
                      color: getStatusColor(monitorStatuses[cell.monitorsEsd.serialNumber] ?? -1)
                    }}
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
        onDelete={handleDelete}
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