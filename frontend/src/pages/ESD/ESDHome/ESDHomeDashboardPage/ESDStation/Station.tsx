import React, { useEffect, useState } from "react";
import { Tooltip, Modal, Button } from "antd";
import ComputerIcon from "@mui/icons-material/Computer";
import { Alert, Snackbar } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import "./Station.css"; // Importando o CSS
import MonitorForm from "../../../Monitor/MonitorForm/MonitorForm";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createMonitor } from "../../../../../api/monitorApi";
import {
  createStationMapper,
  getAllStationMapper,
  getAllStationView,
} from "../../../../../api/mapingAPI";
import Monitor from "../ESDMonitor/Monitor";

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

type SnackbarSeverity = "success" | "error";

const Station: React.FC<StationProps> = ({ stationEntry, onUpdate }) => {
  const { station, monitorsEsd } = stationEntry;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [modalText, setModalText] = useState<any | null>("-");
  const [modalTitleText, setModalTitleText] = useState<any | null>("-");
  const [modalIndexText, setModalIndexTitleText] = useState<any | null>("-");
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState<any | null>(null);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
    if (!selectedMonitor) return;

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
    } catch (error) {
      console.error("Erro ao criar monitor:", error);
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

  useEffect(() => {
    fetchStations();
  }, []); // Chamada inicial

  const cells = new Array(12).fill(null);

  monitorsEsd.forEach((monitor) => {
    cells[monitor.positionSequence] = monitor;
  });

  const handleCellClick = (
    cell: any | "null",
    index: number,
    stationInfo: StationEntry
  ) => {
    const selectedCell = {
      cell: cell ? cell.monitorsEsd : "celula vazia",
      index,
      stationInfo,
    };
    setSelectedMonitor(selectedCell);
    setModalText(selectedCell.cell.description);
    setModalTitleText(selectedCell.cell.serialNumber);
    setModalIndexTitleText(index);
    console.log("selectedCell", selectedCell);
  };

  //modal
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    // setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
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
                <ComputerIcon className="computer-icon" onClick={showModal} />
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
      <Modal
        title={modalTitleText}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Monitor monitor={{
          positionSequence: modalIndexText,
          monitorsEsd: {
            id: modalIndexText,
            serialNumber: modalTitleText,
            description: modalText,
            statusJig: "TRUE",
            statusOperador: "FALSE"
          }
        }}/>
      </Modal>
      <MonitorForm
        open={openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateMonitor}
      />
    </>
  );
};

export default Station;
