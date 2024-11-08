import React, { useEffect, useState } from "react";
import Line from "../ESDLine/Line";
import "./FactoryMap.css";
import {
  createLine,
  deleteLine,
  getAllLines,
} from "../../../../../api/linerApi";
import {
  createStation,
  deleteStation,
  getAllStations,
  getStationByName,
} from "../../../../../api/stationApi";
import { useTranslation } from "react-i18next";
import { createLink, deleteLink } from "../../../../../api/linkStationLine";
import { useNavigate } from "react-router-dom";
import { Button, Modal, message, Radio, Checkbox } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import signalRService from "../../../../../api/signalRService";
import { getAllStationMapper, getStationMapper } from "../../../../../api/mapingAPI";

interface Station {
  id: number;
  linkStationAndLineID: number;
  name: string;
  sizeX: number;
  sizeY: number;
}

interface LogData {
  serialNumber: string;
  status: number;
  // Adicione outros campos conforme necessário
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

const { confirm } = Modal;

const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onUpdate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [selectedStationsId, setSelectedStationsId] = useState<number | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false); // Estado para controlar o reload

  const showMessage = (content: string, type: "success" | "error") => {
    message[type](content);
  };

  useEffect(() => {
    const connectToSignalR = async () => {
      if (reload) {
        onUpdate(); // Chama a atualização das linhas
        setReload(false); // Reseta o estado reload
      }
      try {
        await signalRService.startConnection();
        setError(null);
      } catch (err) {
        setError("Falha ao conectar ao SignalR");
        console.log('lines', lines)
      } finally {
        console.log('lines', lines)
        setLoading(false);
      }
    };

    connectToSignalR();

    signalRService.onReceiveAlert((log: LogData) => {
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
    });

    return () => {
      signalRService.stopConnection();
    };
  }, [reload, onUpdate]);

  const handleError = (error: any) => {
    console.error("Erro:", error);
    if (error.message === "Request failed with status code 401") {
      showMessage(
        t("ESD_MONITOR.MAP_FACTORY.TOAST.EXPIRED_SESSION", {
          appName: "App for Translations",
        }),
        "error"
      );
      localStorage.removeItem("token");
      navigate("/");
    } else {
      showMessage(
        t("ESD_MONITOR.MAP_FACTORY.TOAST.ERROR", {
          appName: "App for Translations",
        }),
        "error"
      );
    }
  };

  const handleCreateLine = async () => {
    const randomLineName = `Linha ${Math.floor(Math.random() * 1000000)}`;
    try {
      const createdLine = await createLine({ name: randomLineName });
      const station = { name: createdLine.name, sizeX: 6, sizeY: 6 };
      const stationCreated = await createStation(station);
      const stationName = await getStationByName(stationCreated.name);

      const link = {
        ordersList: createdLine.id,
        lineID: createdLine.id,
        stationID: stationName.id,
      };
      await createLink(link);
      onUpdate();
      showMessage(
        t("LINE.TOAST.CREATE_SUCCESS", { appName: "App for Translations" }),
        "success"
      );
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleConfirmDelete = () => {
    confirm({
      title: "Confirmação de Exclusão",
      icon: <DeleteOutlined />,
      content: "Tem certeza de que deseja excluir esta linha?",
      className: "custom-modal",
      onOk: async () => {
        try {
          await deleteLink(selectedLinkId);
          await deleteLine(selectedLineId!);
          await deleteStation(selectedStationsId!);
          await getAllStationMapper();
          showMessage("Linha excluída com sucesso!", "success");
          onUpdate();
        } catch (error:any) {
          if (error.message === "Request failed with status code 404") {
            window.location.reload();
            // lines = undefined;
          }
          console.error("Erro ao excluir a linha:", error);
          showMessage("Erro ao excluir a linha.", "error");
        }
      },
      okButtonProps: {
        className: "custom-button",
      },
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
    });
  };
  

  const handleLineChange = (link: Link) => {
    setSelectedLineId(link.line.id || null);
    setSelectedLinkId(link.stations[0]?.linkStationAndLineID || null);
    setSelectedStationsId(link.stations[0]?.station.id || null);
  };

  return (
    <>
      <div className="app-container">
        <header className="container-title">
          <h1>{t("LINE.TABLE_HEADER")}</h1>
          <div className="header-buttons">
            {isEditing && (
              <>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  disabled={!selectedLineId}
                  onClick={handleConfirmDelete}
                  className="white-background-button no-border remove-button-container"
                >
                  {t("LINE.CONFIRM_DIALOG.DELETE_LINE", {
                    appName: "App for Translations",
                  })}
                </Button>
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={handleCreateLine}
                  className="white-background-button no-border add-button-container"
                >
                  {t("LINE.ADD_LINE", { appName: "App for Translations" })}
                </Button>
              </>
            )}
            <Button
              type="primary"
              onClick={() => setIsEditing(!isEditing)}
              className="white-background-button no-border enable-button-container"
            >
              {isEditing ? "Finalizar Edição" : "Editar Linhas"}
            </Button>
          </div>
        </header>

        <div className="body">
          {lines.length === 0 ? (
            // <div className="no-lines-message">
              <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                  <div className="no-lines-message">
                    <h2>Não há linhas cadastradas</h2>
                  </div>
                </div>
              </div>
            // </div>
          ) : (
            lines.map((line) => (
              <div className="card" key={line.id}>
                <div className="card-header">
                  {isEditing && (
                    <Checkbox
                      checked={selectedLineId === line.line.id}
                      onChange={() => handleLineChange(line)}
                      className="green-checkbox"
                    />
                  )}
                </div>
                <div className="card-body">
                  <Line lineData={line} onUpdate={onUpdate} />
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="app-footer">
          <p>&copy; 2024 Compal. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
};

export default FactoryMap;
