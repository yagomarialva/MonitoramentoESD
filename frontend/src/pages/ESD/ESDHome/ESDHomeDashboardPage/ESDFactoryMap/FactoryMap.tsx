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
import { Button } from "antd"; // Importa o botão do Ant Design
import { PlusOutlined } from "@ant-design/icons"; // Importa o ícone de adicionar
import { Alert, IconButton, Snackbar, Menu, MenuItem } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import ESDConfirmModal from "../../ESDConfirmModal/ESDConfirmModal";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

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

// Mock de notificações
const mockNotifications = [
  { id: 1, message: "Alerta de manutenção na linha 3" },
  { id: 2, message: "Nova estação adicionada à linha 5" },
  { id: 3, message: "Erro de comunicação com o monitor da estação 2" },
];

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Estado para abrir o menu de notificações

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

  // Função para criar uma nova linha com um nome aleatório
  const handleCreateLine = async () => {
    const randomLineName = `Linha ${Math.floor(Math.random() * 1000000)}`; // Gera um nome aleatório

    try {
      const createdLine = await createLine({ name: randomLineName });
      await getAllLines();
      const station = {
        name: createdLine.name,
        sizeX: 6,
        sizeY: 6,
      };
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
      showSnackbar("Linha criada com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao criar e mapear o monitor:", error);
      if (error.message === "Request failed with status code 401") {
        showSnackbar("Sessão Expirada.", "error");
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

  const handlePrintLineData = () => {
    const selectedLine = lines.find((line) => line.line.id === selectedLineId);
    if (selectedLine) {
      console.log("Dados da linha selecionada:", selectedLine);
      handleLineChange(selectedLine);
    } else {
      console.log("Nenhuma linha selecionada.");
    }
  };

  const handleLineChange = (link: Link) => {
    setSelectedLineId(link.line.id || null);
    const linkStationAndLineID = link.stations[0]?.linkStationAndLineID; // Captura o linkStationAndLineID da primeira estação
    const linkStationID = link.stations[0]?.station.id; // Captura o linkStationAndLineID da primeira estação
    setSelectedLinkId(linkStationAndLineID);
    setSelectedStationsId(linkStationID);
  };

  return (
    <div className="app-container">
      <header className="container-title">
        <h1>Linha de produção</h1>
        <div className="header-buttons">
        <Button
            className="add-button-container" /* Aplica o estilo outlined */
            type="link"
            icon={<RemoveCircleOutlineOutlinedIcon />}
            size="large"
            disabled={!selectedLineId}
            onClick={() => {
              handlePrintLineData();
              handleOpenModal();
            }}
          >
            Excluir
          </Button>
          <Button
            className="add-button-container" /* Aplica o estilo outlined */
            type="link"
            icon={<AddCircleOutlineRoundedIcon />}
            size="large"
            onClick={handleCreateLine}
          >
            Adicionar
          </Button>
        </div>
      </header>
      <div className="body">
        {lines.map((line) => (
          <div className="card" key={line.id}>
            <div className="card-header">
              <input
                type="radio"
                name="selectedLine"
                value={line.line.id}
                checked={selectedLineId === line.line.id}
                onChange={() => handleLineChange(line)}
              />
            </div>
            <div className="card-body">
              <Line lineData={line} onUpdate={onUpdate} />
            </div>
          </div>
        ))}
      </div>
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
      <footer className="app-footer">
        <p>&copy; 2024 Minha Página. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
  // return (
  //   <>
  //     <div className="container-title">Linha de produção</div>
  //     <div className="container">
  //       <div className="line-container">
  //         {groupedLines.map((link) => (
  //           <>
  //             <div className="container-title">
  //               {" "}
  //               {/* Botão de adicionar linha */}
  //               <Button
  //                 type="primary"
  //                 shape="round"
  //                 icon={<RemoveCircleOutlineOutlinedIcon />}
  //                 size="small"
  //                 onClick={() => {
  //                   handleLineChange(link);
  //                   handleOpenModal(); // Abre o modal de confirmação de exclusão
  //                 }}
  //                 className="white-background-button no-border" // Adiciona a classe para o fundo branco
  //               ></Button>
  //               <Button
  //                 type="primary"
  //                 shape="round"
  //                 icon={<AddCircleOutlineOutlinedIcon />}
  //                 size="small"
  //                 onClick={handleCreateLine} // Chama a função diretamente
  //                 className="white-background-button no-border" // Adiciona a classe para o fundo branco
  //               ></Button>
  //             </div>
  //             <div className="line-item">
  //               {/* Botão de adicionar linha */}
  //               {/* <Button
  //                 type="primary"
  //                 shape="round"
  //                 icon={<RemoveCircleOutlineOutlinedIcon />}
  //                 size="small"
  //                 onClick={() => {
  //                   handleLineChange(link);
  //                   handleOpenModal(); // Abre o modal de confirmação de exclusão
  //                 }}
  //                 className="white-background-button no-border" // Adiciona a classe para o fundo branco
  //               ></Button>

  //               <Button
  //                 type="primary"
  //                 shape="round"
  //                 icon={<AddCircleOutlineOutlinedIcon />}
  //                 size="small"
  //                 onClick={handleCreateLine} // Chama a função diretamente
  //                 className="white-background-button no-border" // Adiciona a classe para o fundo branco
  //               ></Button> */}

  //               {/* Botão de excluir linha */}
  //               <Line key={link.id} lineData={link} onUpdate={onUpdate} />
  //             </div>
  //           </>
  //         ))}
  //       </div>
  //       {/* Modal de confirmação */}
  //       <ESDConfirmModal
  //         open={modalOpen}
  //         handleClose={handleCloseModal}
  //         handleConfirm={handleConfirmDelete}
  //         title="Confirmação de Exclusão"
  //         description="Tem certeza de que deseja excluir esta linha?"
  //       />
  //       <Snackbar
  //         open={state.snackbarOpen}
  //         autoHideDuration={6000}
  //         onClose={() => handleStateChange({ snackbarOpen: false })}
  //         anchorOrigin={{ vertical: "top", horizontal: "right" }}
  //         className={`ant-snackbar ant-snackbar-${state.snackbarSeverity}`}
  //       >
  //         <Alert
  //           onClose={() => handleStateChange({ snackbarOpen: false })}
  //           severity={state.snackbarSeverity}
  //           className="ant-alert"
  //         >
  //           {state.snackbarMessage}
  //         </Alert>
  //       </Snackbar>
  //     </div>
  //   </>
  // );
};

export default FactoryMap;
