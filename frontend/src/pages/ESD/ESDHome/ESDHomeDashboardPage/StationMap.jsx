import React, { useState } from "react";
import "./StationMap.css"; // Importar o CSS necessário
import MonitorModal from "./MonitorModal"; // Importe o componente do modal para informações do monitor
import NoMonitorModal from "./NoMonitorModal"; // Importe o componente do modal para células vazias

const StationMap = ({ groupedStations }) => {
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [noMonitorCell, setNoMonitorCell] = useState(null);
  const [state, setState] = useState({
    allMappedItems: [],
    monitor: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editData: null,
    deleteConfirmOpen: false,
    monitorToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    filterSerialNumber: "",
    filterDescription: "",
    page: 0,
    rowsPerPage: 10,
  });

  const handleCellClick = (cell) => {
    if (cell === "empty") {
      setNoMonitorCell("No monitor in this cell.");
    } else {
      setSelectedMonitor(cell.monitorsEsd);
    }
  };

  const handleCloseMonitorModal = () => {
    setSelectedMonitor(null);
  };

  const handleCloseNoMonitorModal = () => {
    setNoMonitorCell(null);
  };

  return (
    <div className="station-map">
      {groupedStations.map((lineGroup, lineIndex) => (
        <div key={`line-${lineIndex}`} className="line-group">
          <div>Linha: {lineIndex + 1}</div>
          <div className="line-container">
            {lineGroup.stations.map((station, stationIndex) => {
              const { sizeX, sizeY, name } = station.station;
              const monitors = station.monitorsEsd || [];
              const monitorMatrix = Array.from(
                { length: sizeY },
                (_, rowIndex) =>
                  Array.from(
                    { length: sizeX },
                    (_, colIndex) =>
                      monitors[rowIndex * sizeX + colIndex] || "empty"
                  )
              );

              return (
                <div key={`station-${stationIndex}`} className="station">
                  <div className="station-content">{name}</div>
                  <div className="station-grid">
                    {monitorMatrix.map((row, rowIndex) => (
                      <div key={`row-${rowIndex}`} className="station-row">
                        {row.map((cell, cellIndex) => (
                          console.log('cell',cell.monitorsEsd),
                          <div
                            key={`cell-${cellIndex}`}
                            className={`station-cell ${
                              cell === "empty" ? "empty" : "monitor"
                            }`}
                            onClick={() => handleCellClick(cell)}
                          >
                            {cell === "empty" ? " " : cell.id}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* <LinkStantionLineEditForm
        open={state.openEditModal}
        handleClose={handleEditClose}
        onSubmit={handleEditCellChange}
        initialData={state.editData}
      /> */}
      {selectedMonitor && (
        <MonitorModal
          monitor={selectedMonitor}
          onClose={handleCloseMonitorModal}
        />
      )}
      {noMonitorCell && (
        <NoMonitorModal
          message={noMonitorCell}
          onClose={handleCloseNoMonitorModal}
        />
      )}
    </div>
  );
};

export default StationMap;
