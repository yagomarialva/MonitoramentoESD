import React, { useState } from "react";
import Card from "antd/es/card/Card";
import { Tooltip, Modal } from "antd";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import AddIcon from "@mui/icons-material/Add";
import "./ESDStation.css"; // Importando o arquivo de CSS separado
import { createMonitor } from "../../../../../api/monitorApi";
import MonitorForm from "../../../Monitor/MonitorForm/MonitorForm";
import { createStationMapper } from "../../../../../api/mapingAPI";
import LineForm from "../../../Line/LineForm/LineForm";
import { createLine } from "../../../../../api/linerApi";
import { createStation } from "../../../../../api/stationApi";
import { createLink } from "../../../../../api/linkStationLine";

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

interface Line {
  id?: number;
  name: string;
  description?: string;
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
  onUpdate: () => void;
}

const ESDStation: React.FC<ESDStationProps> = ({
  stationEntry,
  lineName,
  onUpdate,
}) => {
  const maxCells = 12;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLineVisible, setIsModalLineVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [state, setState] = useState({
    openModal: false,
    openLineModal: false,
  });
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalLineContent, setModalLineContent] =
    useState<React.ReactNode>(null);

  const handleStateChange = (changes: {
    openModal: boolean;
    openLineModal?: boolean;
  }) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });

  const handleOpenLineModal = () =>
    handleStateChange({
      openLineModal: true,
      openModal: false,
    });
  const handleCloseLineModal = () =>
    handleStateChange({
      openLineModal: false,
      openModal: false,
    });

  const showModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalVisible(true);
  };

  // const showLineModal = (content: React.ReactNode) => {
  //   setModalLineContent(content);
  //   setIsModalLineVisible(true);
  // };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateMonitor = async (monitor: MonitorDetails) => {
    try {
      const createdMonitor = await createMonitor(monitor);
      const mappMonitor = {
        monitorEsdId: createdMonitor.id,
        linkStationAndLineId: stationEntry.linkStationAndLineID,
        positionSequence: selectedIndex,
      };
      console.log("mappMonitor", mappMonitor);
      await createStationMapper(mappMonitor);
      onUpdate();
    } catch (error) {
      console.error("Erro ao criar e mapear o monitor:", error);
    }
  };

  const handleCreateLine = async (line: Line) => {
    try {
      const createdLine = await createLine(line);
      const station = {
        name: createdLine.name,
        sizeX: 6,
        sizeY: 6,
      };
      const link = {
        ordersList: 0,
        lineID: createdLine.id,
        stationID: createdLine.id,
      };
      console.log("mappMonitor", station);
      await createStation(station);
      await createLink(link)
      onUpdate();
    } catch (error) {
      console.error("Erro ao criar e mapear o monitor:", error);
    }
  };

  const displayItems = Array.from({ length: maxCells }, (_, index) => {
    const monitor = stationEntry.monitorsEsd.find(
      (monitor) => monitor.positionSequence === index
    );

    return monitor ? (
      <Tooltip
        key={monitor.positionSequence}
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
            <strong>Status Operator:</strong>{" "}
            {monitor.monitorsEsd.statusOperador}
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
      <Tooltip title={index} key={index}>
        <AddIcon
          className="add-icon"
          onClick={() => {
            setSelectedIndex(index);
            handleOpenModal(); // Abrindo modal para adicionar monitor
          }}
        />
      </Tooltip>
    );
  });

  return (
    <>
      <Card key={stationEntry.station.id} title={stationEntry.station.name}>
        <div className="card-grid">{displayItems}</div>
      </Card>
      <AddIcon className="add-icon" onClick={handleOpenLineModal} />{" "}
      {/* Abrindo modal de linha */}
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
      <LineForm
        open={state.openLineModal}
        handleClose={handleCloseLineModal}
        onSubmit={handleCreateLine}
      />
    </>
  );
};

export default ESDStation;
