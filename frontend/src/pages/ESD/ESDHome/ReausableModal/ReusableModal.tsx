import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  LaptopOutlined,
} from "@mui/icons-material";
import Monitor from "../ESDHomeDashboardPage/ESDMonitor/Monitor";
import "./ReusableModal.css";
import { useTranslation } from "react-i18next";
import { Modal, Tooltip, Checkbox, Input, message, Table, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  deleteMonitor,
  getMonitor,
  getMonitorLogs,
  getMonitorSN,
} from "../../../../api/monitorApi";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr"; // Importa o SignalR
import { HubConnectionBuilder } from "@microsoft/signalr";
import signalRService from "../../../../api/signalRService";
import RealTimeLogTable from "./RealTimeLogTable";

const { TabPane } = Tabs;

interface Monitor {
  positionSequence: string;
  monitorsESD: {
    id: number;
    description: string;
    serialNumber: string;
    statusOperador: string;
    statusJig: string;
  };
}

interface LogData {
  serialNumber: string;
  status: number;
  description: string;
  // Adicione outros campos conforme necessário
}
interface monitorsESD {
  id: number;
  serialNumber: string;
  description: string;
}

interface LogData {
  key: string;
  message: string;
  date: string;
  hour: string;
}

interface DataType {
  key: string;
  serialNumber: string;
  description: string;
  statusJig: string;
  statusOperador: string;
}

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSubmit: (data: monitorsESD) => Promise<void>;
  title: string;
  monitor: Monitor;
  onUpdate: () => void;
}

const { confirm } = Modal; // Modal de confirmação do Ant Design
type SnackbarSeverity = "success" | "error";
const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const API_URL = process.env.REACT_APP_HOST;

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  title,
  onSubmit,
  monitor,
  onUpdate,
}) => {
  const [isFooterVisible, setFooterVisible] = useState(false);
  const [actionType, setActionType] = useState<"editar" | "excluir" | null>(
    null
  );
  const [selectedOperatorFailures, setSelectedOperatorFailures] = useState<
    string[]
  >([]);
  const [selectedMonitorFailures, setSelectedMonitorFailures] = useState<
    string[]
  >([]);
  const [operatorOtherFailure, setOperatorOtherFailure] = useState<
    string | null
  >(null);
  const [monitorOtherFailure, setMonitorOtherFailure] = useState<string | null>(
    null
  );
  const [showOperatorInput, setShowOperatorInput] = useState(false);
  const [showMonitorInput, setShowMonitorInput] = useState(false);
  const [isMonitorTabActive, setMonitorTabActive] = useState(false);
  const [activeKey, setActiveKey] = useState("1");

  const [operatorLogData, setOperatorLogData] = useState([]); // Renomeado para evitar conflitos
  const [jigLogData, setJigLogData] = useState([]);

  // SignalR
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogData[]>([]);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [state, setState] = useState({
    allStations: [],
    station: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    stationToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    filterSerialNumber: "",
    filterDescription: "",
    page: 1,
    rowsPerPage: 10,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<monitorsESD>(
    monitor.monitorsESD
  );

  useEffect(() => {
    try {
      const connectToSignalR = async () => {
        signalRService.onReceiveAlert((message) => {
          setLogs(message);
          const newFilteredLogs = message.filter(
            (log: LogData) => log.status !== 1
          );
          setFilteredLogs((prevLogs) => [...prevLogs, ...newFilteredLogs]);
        });
        await signalRService.startConnection();
      };
      connectToSignalR();
      console.log("filteredLogs", logs);
      if (visible) {
        setFooterVisible(false);
        setActiveKey("1");
        setActionType(null);
        setSelectedOperatorFailures([]);
        setSelectedMonitorFailures([]);
        setShowOperatorInput(false);
        setShowMonitorInput(false);
        setOperatorOtherFailure(null);
        setMonitorOtherFailure(null);
        setMonitorOtherFailure(null);
        setIsEditing(false); // Reseta o estado de edição
        setEditableData({
          id: 0, // Valores iniciais para limpar o formulário
          serialNumber: "",
          description: "",
        });
      }
    } catch (error) {
      console.log(error);
    }

    return () => {
      signalRService.stopConnection();
    };
  }, [visible]);

  const showMessage = (content: string, type: "success" | "error") => {
    message[type](content); // Exibe uma mensagem de sucesso ou erro
  };

  // Garante que a lista de falhas seja exibida corretamente ao ativar o modo de edição
  useEffect(() => {
    setEditableData(monitor.monitorsESD);

    if (isFooterVisible && actionType === "editar") {
      setMonitorTabActive(true);
    }
  }, [isFooterVisible, actionType]);

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

  const handleEdit = () => {
    setFooterVisible(!isFooterVisible);
    setActionType("editar");
    setIsEditing(!isEditing);
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false); // Resetando o estado de edição ao fechar o modal
    setEditableData({
      id: 0,
      serialNumber: "",
      description: "",
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!visible) return;
    const updatedMonitorESD = {
      id: editableData.id,
      serialNumber: editableData.serialNumber,
      description: editableData.description,
    };

    try {
      await onSubmit(updatedMonitorESD); // Envia o objeto atualizado
      handleClose(); // Fecha o modal após o envio bem-sucedido
    } catch (error) {
      console.error("Erro ao salvar monitor:", error);
    }
  };

  const handleConfirmDelete = () => {
    confirm({
      title: "Confirmação de Exclusão",
      content: "Tem certeza de que deseja excluir este monitor?",
      className: "custom-modal", // Adiciona a classe personalizada ao modal
      onOk: async () => {
        try {
          const monitorToDelete = await getMonitor(
            monitor.monitorsESD.serialNumber
          );
          await deleteMonitor(monitorToDelete.id);
          onUpdate();
          onDelete(); // Chama o callback após a exclusão
          onClose();
          showSnackbar("Linha excluída com sucesso!", "success");
        } catch (error: any) {
          showMessage("Erro ao excluir a linha:", error);
          if (error.message === "Request failed with status code 401") {
            showMessage("Sessão Expirada.", "error");
            localStorage.removeItem("token");
            navigate("/");
          }
        }
      },
      okButtonProps: {
        className: "custom-button", // Adiciona a classe personalizada ao botão OK
      },
      cancelButtonProps: {
        className: "custom-cancel-button", // Adiciona a classe personalizada ao botão Cancelar
      },
    });
  };

  //table
  const monitorColumns: ColumnsType<DataType> = [
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (text: string) => (
        <Tooltip title={text || "N/A"}>
          {isEditing ? (
            <Input
              value={editableData.serialNumber || ""}
              onChange={(e) =>
                setEditableData({
                  ...editableData,
                  serialNumber: e.target.value,
                })
              }
            />
          ) : (
            <span className="ellipsis-text">
              {truncateText(text || "N/A", 15)}
            </span>
          )}
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Tooltip title={text || "N/A"}>
          {isEditing ? (
            <Input
              value={editableData.description || ""}
              onChange={(e) =>
                setEditableData({
                  ...editableData,
                  description: e.target.value,
                })
              }
            />
          ) : (
            <span className="ellipsis-text">
              {truncateText(text || "N/A", 15)}
            </span>
          )}
        </Tooltip>
      ),
    },
  ];

  const monitorData: DataType[] = [
    {
      key: monitor.monitorsESD?.id?.toString() || "N/A",
      serialNumber: monitor.monitorsESD.serialNumber,
      description: monitor.monitorsESD.description,
      statusJig: monitor.monitorsESD.statusJig,
      statusOperador: monitor.monitorsESD.statusOperador,
    },
  ];

  const logColumns: ColumnsType<any> = [
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="ellipsis-text">{truncateText(text, 15)}</span>
        </Tooltip>
      ),
    },
    {
      title: "created",
      dataIndex: "created",
      key: "created",
    },
  ];

  const operatorLogs: LogData[] = operatorLogData;

  const jigLogs: LogData[] = jigLogData;

  const handleTabChange = async (key: React.SetStateAction<string>) => {
    setActiveKey(key);
    console.log("key", key);

    if (key !== "2") return; // Caso o key não seja "2", retorna imediatamente

    try {
      // Configura o SignalR
      const monitorToDelete = await getMonitor(
        monitor.monitorsESD.serialNumber
      );
      const allLogs = await getMonitorLogs(monitor.monitorsESD.serialNumber);
      // Filtrando logs em categorias de "Operador" e "Jig"
      const filteredOperatorLogs = allLogs.filter(
        (log: { messageType: string }) => log.messageType === "operador"
      );
      const filteredJigLogs = allLogs.filter(
        (log: { messageType: string }) => log.messageType === "jig"
      );

      // Atualizando os estados
      setOperatorLogData(filteredOperatorLogs);
      setJigLogData(filteredJigLogs);
    } catch (error: any) {
      // Tratamento de erro (código de status HTTP 401 ou 404)
      if (error?.response?.status === 401) {
        showMessage("Sessão Expirada.", "error");
        localStorage.removeItem("token");
        navigate("/");
      } else if (error?.response?.status === 404) {
        showMessage("Dados não encontrados.", "error");
      } else {
        showMessage("Ocorreu um erro inesperado.", "error");
      }
    }
  };

  return (
    <>
      <Modal
        className="ellipsis-modal"
        title={
          <div className="modal-title-container">
            <div className="title-content">
              <LaptopOutlined
                style={{ marginRight: "8px", fontSize: "18px" }}
              />
              <Tooltip title={title}>
                <span className="ellipsis-text">
                  {title.length > 5 ? `${title.slice(0, 20)}` : title}
                </span>
              </Tooltip>
            </div>
            <div className="title-icons">
              <Tooltip title="Editar">
                <EditOutlined className="icon-action" onClick={handleEdit} />
              </Tooltip>
              {/* Renderiza o ícone de deletar apenas se isEditing for falso */}
              {!isEditing && (
                <Tooltip title="Excluir">
                  <DeleteOutlined
                    className="icon-action"
                    onClick={handleConfirmDelete}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        }
        visible={visible}
        onCancel={handleClose}
        style={{ border: "none" }} // Remove bordas do modal
        footer={
          isFooterVisible && (
            <div className="modal-footer">
              <button
                className="modal-button-monitor-cancel"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                className="modal-button-monitor-save"
                onClick={actionType === "editar" ? handleSubmit : onDelete}
              >
                {actionType === "editar" ? "Salvar" : "Excluir"}
              </button>
            </div>
          )
        }
      >
        <div>
          <Tabs activeKey={activeKey} onChange={handleTabChange}>
            <TabPane tab="Monitor" key="1">
              <div
                style={{
                  maxWidth: "400px",
                  maxHeight: "400px",
                }}
              >
                {" "}
                {/* Definindo altura fixa com rolagem */}
                <Table
                  columns={monitorColumns}
                  dataSource={monitorData}
                  pagination={false}
                />
              </div>
            </TabPane>
            <TabPane  tab="Log" key="2">
              {/* <div
                style={{
                  display: "flex",
                  gap: "16px",
                  maxHeight: "400px",
                  overflow: "auto",
                }}
              >
                <div style={{ width: "50%" }}>
                  <Table
                    title={() => "Logs de Operador"}
                    columns={logColumns}
                    dataSource={operatorLogs}
                    pagination={false}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <Table
                    title={() => "Logs de Jigs"}
                    columns={logColumns}
                    dataSource={jigLogs}
                    pagination={false}
                  />
                </div>
              </div> */}
              <RealTimeLogTable />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default ReusableModal;
