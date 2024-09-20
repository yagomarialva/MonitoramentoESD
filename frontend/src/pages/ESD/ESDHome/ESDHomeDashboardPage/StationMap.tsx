import React, { useState, useEffect } from "react";
import "./StationMap.css";
import MonitorModal from "./MonitorModal";
import MonitorEditForm from "../../Monitor/MonitorEditForm/MonitorEditForm";
import { useTranslation } from "react-i18next";
import { createMonitor } from "../../../../api/monitorApi";
import ESDHomeEditForm from "../ESDHomeEditForm/ESDHomeEditForm";
import { Box, Snackbar, Alert, CircularProgress, Tooltip } from "@mui/material";
import { Card, Switch, Button } from 'antd';
import ComputerIcon from '@mui/icons-material/Computer';
import AddIcon from '@mui/icons-material/Add';

interface Monitor {
  id?: string;
  serialNumber?: string;
  status?: string;
  statusJig?: string;
  statusOperador?: string;
}

interface Station {
  station: {
    sizeX: number;
    sizeY: number;
    name: string;
  };
  monitorsEsd?: Monitor[];
}

interface StationMapProps {
  groupedStations: {
    stations: Station[];
  }[];
  refreshGroupedStations: () => Promise<void>;
}

// interface CardProps {
//   id: string;
//   title: string;
//   content?: boolean[];
// }

// interface KanbanColumnProps {
//   title: string;
//   children: React.ReactNode;
// }

// interface AppState {
//   [key: string]: {
//     id: string;
//     title: string;
//     content: boolean[];
//   }[];
// }

type Cell = Monitor | "empty"; // Union type for cell

const StationMap: React.FC<StationMapProps> = ({
  groupedStations,
  refreshGroupedStations,
}) => {
  const { t } = useTranslation();
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [noMonitorCell, setNoMonitorCell] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [state, setState] = useState<{
    allMonitors: Monitor[];
    monitor: Monitor;
    open: boolean;
    openModal: boolean;
    openEditModal: boolean;
    editData: Monitor | null;
    deleteConfirmOpen: boolean;
    monitorToDelete: Monitor | null;
    snackbarOpen: boolean;
    snackbarMessage: string;
    snackbarSeverity: "success" | "error";
    filterSerialNumber: string;
    filterDescription: string;
    page: number;
    rowsPerPage: number;
  }>({
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

  const handleStateChange = (changes: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const isMonitor = (cell: Monitor | "empty"): cell is Monitor => {
    return typeof cell !== "string"; // Checks if it's not "empty"
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

  const handleEditOpen = (monitor: Monitor) => {
    handleStateChange({ editData: monitor, openEditModal: true });
  };

  const handleCellClick = (cell: Cell) => {
    if (cell === "empty") {
      setNoMonitorCell("No monitor in this cell.");
    } else {
      setSelectedMonitor(cell);
    }
  };

  const handleEditClose = () => {
    handleStateChange({ openEditModal: false, editData: null });
  };

  const handleCloseMonitorModal = () => {
    setSelectedMonitor(null);
  };

  const handleCloseNoMonitorModal = () => {
    setNoMonitorCell(null);
  };

  const handleEditCellChange = async (params: Monitor) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const getCellClassName = (cell: Cell) => {
    if (cell === "empty") return "empty";

    const { status, statusJig, statusOperador } = cell;
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
        // className = "monitor-unknown operator-unknown";
        className = "one-one";
        break;
    }

    return className.trim();
  };

  const checkForFails = () => {
    groupedStations.forEach((lineGroup) => {
      lineGroup.stations.forEach((station) => {
        (station.monitorsEsd || []).forEach((monitor) => {
          if (
            monitor.statusJig === "FAIL" ||
            monitor.statusOperador === "FAIL"
          ) {
            showSnackbar(
              `Alerta: O monitor ${monitor.serialNumber} apresenta falhas no ESD`,
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
    }, 1000);

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
          <CircularProgress />
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
                                isMonitor(cell) && cell.serialNumber
                                  ? cell.serialNumber
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
                                  isMonitor(cell)
                                    ? () => handleEditOpen(cell)
                                    : undefined
                                }
                              >
                                {isMonitor(cell) ? cell.id : " "}
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
      {/* <ESDHomeEditForm
        open={state.openEditModal}
        handleClose={handleEditClose}
        onSubmit={handleEditCellChange}
        initialData={state.editData}
      /> */}
      {selectedMonitor && (
        <MonitorEditForm
          open={state.openEditModal}
          handleClose={handleEditClose}
          onSubmit={handleEditCellChange}
          initialData={state.editData}
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
