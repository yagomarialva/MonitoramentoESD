import React, { useState, useEffect } from "react";
import "./StationMap.css";
import MonitorModal from "./MonitorModal";
import NoMonitorModal from "./NoMonitorModal";
import MonitorEditForm from "../../Monitor/MonitorEditForm/MonitorEditForm";
import { useTranslation } from "react-i18next";
import { createMonitor, getAllMonitors } from "../../../../api/monitorApi";
import { getAllStationMapper } from "../../../../api/mapingAPI";
import ESDHomeEditForm from "../ESDHomeEditForm/ESDHomeEditForm";
import {
  IconButton,
  Box,
  Snackbar,
  Alert,
  Button,
  TextField,
  Container,
  Tooltip,
  Typography,
  CircularProgress, // Importação do componente de carregamento
} from "@mui/material";

const StationMap = ({ groupedStations, refreshGroupedStations }) => {
  const { t } = useTranslation();
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [noMonitorCell, setNoMonitorCell] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [state, setState] = useState({
    allMonitors: [],
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

  const handleStateChange = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const showSnackbar = (message, severity = "success") => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

  const handleEditOpen = (monitor) => {
    handleStateChange({ editData: monitor.monitorsEsd, openEditModal: true });
  };

  const handleCellClick = (cell) => {
    if (cell === "empty") {
      setNoMonitorCell("No monitor in this cell.");
    } else {
      setSelectedMonitor(cell.monitorsEsd);
    }
  };

  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });

  const handleCloseMonitorModal = () => {
    setSelectedMonitor(null);
  };

  const handleCloseNoMonitorModal = () => {
    setNoMonitorCell(null);
  };

  const handleEditCellChange = async (params) => {
    try {
      setLoading(true); // Ativa o carregamento
      await createMonitor(params);
      await refreshGroupedStations();
      showSnackbar(
        t("ESD_MONITOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(
        t("ESD_MONITOR.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    } finally {
      setLoading(false); // Desativa o carregamento
    }
  };

  const getCellClassName = (cell) => {
    if (cell === "empty") return "empty";

    const { status, statusJig, statusOperador } = cell.monitorsEsd || {};

    let className = "";
    switch (`${statusJig}-${statusOperador}`) {
      case "PASS-PASS":
        className = "one-one";
        break;
      case "FAIL-FAIL":
        className = "zero-zero";
        break;
      case "PASS-FAIL":
        className = "zero-one";
        break;
      case "FAIL-PASS":
        className = "monitor-fail operator-pass";
        break;
      default:
        className = "monitor-unknown operator-unknown";
        break;
    }

    return className.trim();
  };

  const checkForFails = () => {
    groupedStations.forEach((lineGroup) => {
      lineGroup.stations.forEach((station) => {
        (station.monitorsEsd || []).forEach((monitor) => {
          if (
            monitor.monitorsEsd.statusJig === "FAIL" ||
            monitor.monitorsEsd.statusOperador === "FAIL"
          ) {
            showSnackbar(
              `Alerta: O monitor ${monitor.monitorsEsd.serialNumber} apresenta falhas no ESD`,
              "error"
            );
          }
        });
      });
    });
  };

  useEffect(() => {
    checkForFails();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 segundo de atraso

    return () => clearTimeout(timer);
  }, [groupedStations]);

  return (
    <div className="station-map">
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
          }}
        >
          <CircularProgress /> {/* Indicador de progresso */}
        </Box>
      ) : (
        groupedStations.map((lineGroup, lineIndex) => (
          <div key={`line-${lineIndex}`} className="line-group">
            <div>Estação: {lineIndex + 1}</div>
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
                            <Tooltip
                              key={`tooltip-${cellIndex}`}
                              title={
                                cell !== "empty" &&
                                cell.monitorsEsd?.serialNumber
                                  ? cell.monitorsEsd.serialNumber
                                  : ""
                              }
                              arrow
                            >
                              <div
                                key={`cell-${cellIndex}`}
                                className={`station-cell ${getCellClassName(
                                  cell
                                )}`}
                                onClick={
                                  cell !== "empty"
                                    ? () => handleEditOpen(cell)
                                    : null
                                }
                              >
                                {cell === "empty" ? " " : cell.id}
                              </div>
                            </Tooltip>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      <ESDHomeEditForm
        open={state.openEditModal}
        handleClose={handleEditClose}
        onSubmit={handleEditCellChange}
        initialData={state.editData}
      />
      {selectedMonitor && (
        <MonitorEditForm
          open={state.openEditModal}
          handleClose={handleEditClose}
          onSubmit={handleEditCellChange}
          initialData={state.editData}
        />
      )}
      {noMonitorCell && (
        <NoMonitorModal
          message={noMonitorCell}
          onClose={handleCloseNoMonitorModal}
        />
      )}
      <Snackbar
        open={state.snackbarOpen}
        autoHideDuration={6000}
        onClose={() => handleStateChange({ snackbarOpen: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        className={`snackbar-content snackbar-${state.snackbarSeverity}`}
      >
        <Alert
          onClose={() => handleStateChange({ snackbarOpen: false })}
          severity={state.snackbarSeverity}
          sx={{
            backgroundColor: "inherit",
            color: "inherit",
            fontWeight: "inherit",
            boxShadow: "inherit",
            borderRadius: "inherit",
            padding: "inherit",
          }}
        >
          {state.snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StationMap;
