import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, AlertColor } from "@mui/material";
import ESDHomeModal from "../ESDHomeModal/ESDHomeModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createStationMapper,
  getAllStationMapper,
} from "../../../../api/mapingAPI";
import "./ESDTable.css";
import StationMap from "./StationMap";
import ESDHomeForm from "../ESDHomeForm/ESDHomeForm";

interface Station {
  id: number;
  line: { id: number; name: string };
  stations: StationItem[];
}

interface StationItem {
  station: { id: number; name: string; sizeX: number; sizeY: number }; // Add sizeX and sizeY
  monitorsESD?: any[];
}

interface GroupedStation {
  line: { id: number; name: string };
  stations: StationItem[]; // This needs to match the expected StationItem structure
}

const groupStationsByLine = (
  data: Station[]
): Record<number, GroupedStation> => {
  const grouped: Record<number, GroupedStation> = {};

  data.forEach((entry) => {
    const lineId = entry.line.id;

    if (!grouped[lineId]) {
      grouped[lineId] = { line: entry.line, stations: [] };
    }

    entry.stations.forEach((stationItem) => {
      const existingStationIndex = grouped[lineId].stations.findIndex(
        (s) => s.station.id === stationItem.station.id
      );

      if (existingStationIndex === -1) {
        grouped[lineId].stations.push({
          ...stationItem,
          monitorsESD: stationItem.monitorsESD || [],
        });
      } else {
        const existingStation = grouped[lineId].stations[existingStationIndex];
        const existingMonitorsMap = new Map(
          (existingStation.monitorsESD || []).map((m: any) => [m.id, m])
        );

        (stationItem.monitorsESD || []).forEach((monitor) => {
          existingMonitorsMap.set(monitor.id, monitor);
        });

        grouped[lineId].stations[existingStationIndex] = {
          ...existingStation,
          monitorsESD: Array.from(existingMonitorsMap.values()),
        };
      }
    });
  });

  return grouped;
};

const ESDDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [group, setGroup] = useState<Record<number, GroupedStation>>({});
  const navigate = useNavigate();

  const [state, setState] = useState<{
    allLinks: any[];
    link: null;
    open: boolean;
    openModal: boolean;
    snackbarOpen: boolean;
    snackbarMessage: string;
    snackbarSeverity: AlertColor;
    loading: boolean;
  }>({
    allLinks: [],
    link: null,
    open: false,
    openModal: false,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    loading: true,
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setState((prevState) => ({
      ...prevState,
      snackbarOpen: true,
      snackbarMessage: message,
      snackbarSeverity: severity,
    }));
  };

  const handleOpenModal = () =>
    setState((prev) => ({ ...prev, openModal: true }));
  const handleCloseModal = () =>
    setState((prev) => ({ ...prev, openModal: false }));

  const handleCreateMappedItem = async (link: any) => {
    try {
      await createStationMapper(link);
      const updatedData = await getAllStationMapper();
      const groupedData = groupStationsByLine(updatedData);
      setGroup(groupedData);
      showSnackbar(
        t("MAP_FACTORY.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error: any) {
      showSnackbar(error.response.data, "error");
    }
  };

  const fetchAndSetGroupedStations = async () => {
    try {
      const updatedStations = await getAllStationMapper();
      const groupedData = groupStationsByLine(updatedStations);
      setGroup(groupedData);
    } catch (error) {
      console.error("Failed to fetch stations", error);
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      await fetchAndSetGroupedStations();
      try {
        const toMount = await getAllStationMapper();
        const mounted = groupStationsByLine(toMount);
        setGroup(mounted);
      } catch (error: any) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    fetchDataAllUsers();
  }, [navigate]);

  return (
    <>
      <Button
        id="add-button"
        variant="contained"
        color="success"
        onClick={handleOpenModal}
        sx={{ marginLeft: "auto" }}
      >
        {t("LINK_STATION_LINE.ADD_LINK_STATION_LINE")}
      </Button>
      <StationMap
        groupedStations={Object.values(group).map((lineGroup) => ({
          stations: lineGroup.stations,
        }))}
        refreshGroupedStations={fetchAndSetGroupedStations}
      />

      <ESDHomeForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateMappedItem}
      />
      <ESDHomeModal open={state.open} handleClose={handleCloseModal} />
      <Snackbar
        open={state.snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setState((prev) => ({ ...prev, snackbarOpen: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setState((prev) => ({ ...prev, snackbarOpen: false }))}
          severity={state.snackbarSeverity}
        >
          {state.snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ESDDashboardPage;
