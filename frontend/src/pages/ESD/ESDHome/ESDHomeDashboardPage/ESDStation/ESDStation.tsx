import React, { useState } from "react";
import Card from "antd/es/card/Card";
import { Tooltip, Modal } from "antd";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import AddIcon from "@mui/icons-material/Add";
import "./ESDStation.css"; // Importing the separate CSS file
import { createMonitor } from "../../../../../api/monitorApi";
import MonitorForm from "../../../Monitor/MonitorForm/MonitorForm";
import { createStationMapper } from "../../../../../api/mapingAPI";

interface MonitorDetails {
  id: number;
  serialNumber: string;
  description: string;
  statusJig: string;
  statusOperador: string;
}

interface Monitor {
  positionSequence: number;
  monitorsEsd: MonitorDetails;
}

interface StationEntry {
  station: {
    id: number;
    name: string;
    sizeX: number;
    sizeY: number;
  };
  monitorsEsd: Monitor[];
  linkStationAndLineID: number;
}

interface ESDStationProps {
  stationEntry: StationEntry;
  lineName: string;
  onUpdate: () => void; // Nova prop para a função de atualização
}

const ESDStation: React.FC<ESDStationProps> = ({ stationEntry, lineName, onUpdate }) => {
  const maxCells = 6;

  // States to manage modal visibility and selected monitor details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [state, setState] = useState({
    openModal: false,
  });
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const handleStateChange = (changes: { openModal: boolean }) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };
  
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const showModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const sortedMonitors = [...stationEntry.monitorsEsd].sort(
    (a, b) => a.positionSequence - b.positionSequence
  );

  const handleCreateMonitor = async (monitor: MonitorDetails) => {
    try {
      const createdMonitor = await createMonitor(monitor); // Aguarda a criação do monitor e pega o retorno completo, inclusive o ID
      console.log("Monitor criado:", createdMonitor);

      // Após o monitor ser criado com sucesso e ter um ID, faça o mapeamento
      const mappMonitor = {
        monitorEsdId: createdMonitor.id, // ID do monitor recém-criado
        linkStationAndLineId: stationEntry.linkStationAndLineID,
        positionSequence: selectedIndex, // Índice onde AddIcon foi clicado
      };
      console.log("mappMonitor:", mappMonitor);

      await createStationMapper(mappMonitor); // Faz o mapeamento após criar o monitor
      onUpdate(); // Chama a função de atualização passada pelo ESDFactoryMap
    } catch (error) {
      console.error("Erro ao criar e mapear o monitor:", error);
    }
  };

  const displayItems = Array.from({ length: maxCells }, (_, index) => {
    const monitor = sortedMonitors[index];

    return monitor ? (
      <Tooltip
        key={monitor.monitorsEsd.serialNumber}
        title={
          <div>
            <strong>Position Sequence:</strong> {monitor.positionSequence}
            <br />
            <strong>Serial Number:</strong> {monitor.monitorsEsd.serialNumber}
            <br />
            <strong>Description:</strong> {monitor.monitorsEsd.description}
            <br />
            <strong>Status Jig:</strong> {monitor.monitorsEsd.statusJig}
            <br />
            <strong>Status Operator:</strong> {monitor.monitorsEsd.statusOperador}
          </div>
        }
        placement="top"
      >
        <div
          className="icon-container"
          onClick={() =>
            showModal(
              <div>
                <p>
                  <strong>Link ID:</strong> {stationEntry.linkStationAndLineID}
                </p>
                <p>
                  <strong>Linha:</strong> {lineName}
                </p>
                <p>
                  <strong>Estação:</strong> {stationEntry.station.name}
                </p>
                <p>
                  <strong>Status Jig:</strong> {monitor.monitorsEsd.statusJig}
                </p>
                <p>
                  <strong>Status Operador:</strong>{" "}
                  {monitor.monitorsEsd.statusOperador}
                </p>
                <p>
                  <strong>Posição:</strong> {monitor.positionSequence}
                </p>
              </div>
            )
          }
        >
          <PointOfSaleOutlinedIcon className="computer-icon" />
        </div>
      </Tooltip>
    ) : (
      <AddIcon
        key={index}
        className="add-icon"
        onClick={() => {
          setSelectedIndex(index); // Definindo o índice do AddIcon clicado
          handleOpenModal(); // Abrindo modal de criação
        }}
      />
    );
  });

  return (
    <>
      <Card key={stationEntry.station.id} title={stationEntry.station.name}>
        <div className="card-grid">{displayItems}</div>
      </Card>

      <Modal
        title="Detalhes do Monitor"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modalContent}
      </Modal>
      <MonitorForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateMonitor}
      />
    </>
  );
};

export default ESDStation;
