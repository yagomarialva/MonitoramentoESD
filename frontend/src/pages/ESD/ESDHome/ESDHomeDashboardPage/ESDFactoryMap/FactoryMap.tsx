import React, { useState } from "react";
import Line from "../ESDLine/Line";
import "./FactoryMap.css"; // Importando o CSS
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
import { createLink, deleteLink } from "../../../../../api/linkStationLine";
import { useNavigate } from "react-router-dom";
import { Button, Modal, message, Radio, Checkbox } from "antd"; // Elementos do Ant Design
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"; // Ant Design Icons

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

const { confirm } = Modal; // Modal de confirmação do Ant Design

const FactoryMap: React.FC<FactoryMapProps> = ({ lines, onUpdate }) => {
  const navigate = useNavigate();
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [selectedStationsId, setSelectedStationsId] = useState<number | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const showMessage = (content: string, type: "success" | "error") => {
    message[type](content); // Exibe uma mensagem de sucesso ou erro
  };

  const handleCreateLine = async () => {
    const randomLineName = `Linha ${Math.floor(Math.random() * 1000000)}`;

    try {
      const createdLine = await createLine({ name: randomLineName });
      await getAllLines();
      const station = { name: createdLine.name, sizeX: 6, sizeY: 6 };
      const stationCreated = await createStation(station);
      await getAllStations();
      const stationName = await getStationByName(stationCreated.name);
      const link = {
        ordersList: createdLine.id,
        lineID: createdLine.id,
        stationID: stationName.id,
      };
      await createLink(link);
      onUpdate();
      showMessage("Linha criada com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao criar e mapear o monitor:", error);
      if (error.message === "Request failed with status code 401") {
        showMessage("Sessão Expirada.", "error");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        showMessage("Erro ao criar a linha.", "error");
      }
    }
  };

  const handleConfirmDelete = () => {
    confirm({
      title: "Confirmação de Exclusão",
      icon: <DeleteOutlined />,
      content: "Tem certeza de que deseja excluir esta linha?",
      onOk: async () => {
        try {
          await deleteLink(selectedLinkId);
          await deleteLine(selectedLineId!);
          await deleteStation(selectedStationsId!);
          onUpdate();
          showMessage("Linha excluída com sucesso!", "success");
          setSelectedLineId(null);
        } catch (error) {
          console.error("Erro ao excluir a linha:", error);
          showMessage("Erro ao excluir a linha.", "error");
        }
      },
    });
  };

  const handleLineChange = (link: Link) => {
    setSelectedLineId(link.line.id || null);
    setSelectedLinkId(link.stations[0]?.linkStationAndLineID || null);
    setSelectedStationsId(link.stations[0]?.station.id || null);
  };

  const handleLineChange_new = (lineId: number) => {
    setSelectedLineId((prev) => (prev === lineId ? null : lineId));
  };

  return (
    <div className="app-container">
      <header className="container-title">
        <h1>Linha de produção</h1>
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
                Excluir
              </Button>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={handleCreateLine}
                className="white-background-button no-border add-button-container"
              >
                Adicionar
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
        {lines.map((line) => (
          <div className="card" key={line.id}>
            <div className="card-header">
              {isEditing && (
                // <Radio
                //   checked={selectedLineId === line.line.id}
                //   onChange={() => handleLineChange(line)}
                // />
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
        ))}
      </div>

      <footer className="app-footer">
        <p>&copy; 2024 Compal. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default FactoryMap;
