import React, { useEffect, useState } from "react";
import { Tooltip, message, Modal, Card, Button, Row, Col, Typography, Alert } from 'antd';
import { PlusCircleOutlined, LaptopOutlined } from '@ant-design/icons';
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
} from "../../../../../api/mapingAPI";
import ReusableModal from "../../ReausableModal/ReusableModal";
import MonitorForm from "../../MonitorForm/MonitorForm";
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

type AlertType = "success" | "info" | "warning" | "error";

const Station: React.FC<StationProps> = ({ stationEntry, onUpdate }) => {
  const { station, monitorsEsd } = stationEntry;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [modalText, setModalText] = useState<string>("-");
  const [modalTitleText, setModalTitleText] = useState<string>("-");
  const [modalIndexText, setModalIndexTitleText] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState<any | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [monitorStatuses, setMonitorStatuses] = useState<{[key: string]: number}>({});

  const [alertState, setAlertState] = useState({
    message: "",
    type: "success" as AlertType,
    show: false,
  });

  const showAlert = (message: string, type: AlertType = "success") => {
    setAlertState({
      message,
      type,
      show: true,
    });
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }));
    }, 6000);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleModalClose = () => setModalVisible(false);

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
      showAlert(`Monitor ${result.serialNumber} adicionado com sucesso!`, "success");
    } catch (error: any) {
      console.error("Erro ao criar monitor:", error);
      showAlert(`Monitor não foi adicionado!`, "error");
      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
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
        showAlert(`Erro no monitor ${log.serialNumber}: ${log.description}`, "error");
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
      showAlert(t("ESD_MONITOR.TOAST.UPDATE_SUCCESS", { appName: "App for Translations" }), "success");
      onUpdate();
      return result;
    } catch (error: any) {
      showAlert(t("ESD_MONITOR.TOAST.TOAST_ERROR", { appName: "App for Translations" }), "error");
      if (error.message === "Request failed with status code 401") {
        message.error("Sessão Expirada.");
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const handleCellClick = (
    cell: any | null,
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
    showAlert(t("ESD_MONITOR.TOAST.DELETE_SUCCESS", { appName: "App for Translations" }), "success");
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "#4caf50 ";
      case 0:
        return "#f44336";
      default:
        return '#d9d9d9';
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
                  <LaptopOutlined
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
                <PlusCircleOutlined className="cell-icon" />
              </div>
            )}
          </div>
        ))}
      </div>

      {alertState.show && (
        <Alert
          message={alertState.message}
          type={alertState.type}
          showIcon
          closable
          onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
          style={{
            backgroundColor:'white',
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        />
      )}

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

