import React, { useState } from "react";
import Card from "antd/es/card/Card";
import { Tooltip, Modal } from "antd";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import AddIcon from "@mui/icons-material/Add";
import "./ESDStation.css"; // Importing the separate CSS file

interface MonitorDetails {
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
}

const ESDStation: React.FC<ESDStationProps> = ({ stationEntry, lineName }) => {
  console.log('stationEntry', stationEntry)
  const maxCells = 6;

  // States to manage modal visibility and selected monitor details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

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
                  <strong>Status Operador:</strong> {monitor.monitorsEsd.statusOperador}
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
                <strong>Posição:</strong> célula vazia {index + 1}
              </p>
            </div>
          )
        }
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
    </>
  );
};

export default ESDStation;
