import React, { useState } from "react";
import Line from "../ESDLine/Line";
import "./FactoryMap.css"; // Importando o CSS
import AddIcon from "@mui/icons-material/Add"; // Importando o ícone Add
import {
  createLine,
  deleteLine,
  getAllLines,
  getLineByName,
} from "../../../../../api/linerApi";
import {
  createStation,
  deleteStation,
  getAllStations,
  getStationByName,
} from "../../../../../api/stationApi";
import { createLink, deleteLink } from "../../../../../api/linkStationLine";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; // Importa o botão do Ant Design
import { PlusOutlined } from "@ant-design/icons"; // Importa o ícone de adicionar
import { Alert, Snackbar } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import ESDConfirmModal from "../../ESDConfirmModal/ESDConfirmModal";

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
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null); // Estado para o ID da linha selecionada
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null); // Estado para o ID da linha selecionada
  const [selectedStationsId, setSelectedStationsId] = useState<number | null>(
    null
  ); // Estado para o ID da linha selecionada
  const [modalOpen, setModalOpen] = useState(false); // Estado para controle do modal

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

  // Função para criar uma nova linha com um nome aleatório
  const handleCreateLine = async () => {
    const randomLineName = `Linha ${Math.floor(Math.random() * 1000000)}`; // Gera um nome aleatório

    try {
      const createdLine = await createLine({ name: randomLineName });
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

  const handleConfirmDelete = async () => {
    if (selectedLineId !== null) {
      try {
        await deleteLink(selectedLinkId); // Chame a API para deletar a linha
        await deleteLine(selectedLineId);
        await deleteStation(selectedStationsId);
        onUpdate(); // Atualiza a lista de linhas após a exclusão
        showSnackbar("Linha excluída com sucesso!", "success");
        setSelectedLineId(null); // Limpa a seleção após a exclusão
        handleCloseModal();
      } catch (error: any) {
        console.error("Erro ao excluir a linha:", error);
        showSnackbar("Erro ao excluir a linha.", "error");
      }
    }
  };

  const handleLineChange = (link: Link) => {
    setSelectedLineId(link.line.id || null);
    console.log(`Linha selecionada: ${link.line.name}, ID: ${link.line.id}`);
    console.log(`Informações do link:`, link); // Exibe o objeto link completo
    const linkStationAndLineID = link.stations[0]?.linkStationAndLineID; // Captura o linkStationAndLineID da primeira estação
    const linkStationID = link.stations[0]?.station.id; // Captura o linkStationAndLineID da primeira estação
    setSelectedLinkId(linkStationAndLineID);
    setSelectedStationsId(linkStationID);
    console.log(`LinkStationAndLineID: ${linkStationAndLineID}`); // Exibe apenas o ID
    console.log(`LinkStationID: ${linkStationID}`); // Exibe apenas o ID
  };

  return (
    <>
      <div className="container">
        <div className="line-container">
          {groupedLines.map((link) => (
            <>
              <input
                type="radio"
                name="line"
                value={link.line.id}
                checked={selectedLineId === link.line.id}
                onChange={() => {
                  if (link.line.id !== undefined) {
                    // Verifica se o ID não é undefined
                    if (selectedLineId === link.line.id) {
                      setSelectedLineId(null);
                    } else {
                      handleLineChange(link);
                    }
                  }
                }}
              />
              <Line key={link.id} lineData={link} />
            </>
          ))}
        </div>
        {/* Botão fixo no canto inferior direito */}
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size="large"
          className="add-icon-fixed"
          onClick={handleCreateLine} // Chama a função diretamente
        >
          Adicionar linha
        </Button>
        {selectedLineId !== null && ( // Renderiza o botão de excluir se uma linha estiver selecionada
          <Button
            type="primary" // Mantenha como 'primary' ou altere para 'default' ou outro tipo válido
            shape="round"
            icon={<DeleteOutlined />}
            size="large"
            onClick={handleOpenModal}
            className="delete-icon-fixed"
          >
            Excluir linha
          </Button>
        )}
        {/* Modal de confirmação */}
        <ESDConfirmModal
          open={modalOpen}
          handleClose={handleCloseModal}
          handleConfirm={handleConfirmDelete}
          title="Confirmação de Exclusão"
          description="Tem certeza de que deseja excluir esta linha?"
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
