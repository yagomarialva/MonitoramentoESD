import React, { useEffect, useState } from "react";
import { AlertColor } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createStationMapper,
  getAllStationMapper,
} from "../../../../api/mapingAPI";
import "./ESDTable.css";
import ESDFactoryMap from "./ESDFactoryMap/ESDFactoryMap";
import { getAllLines } from "../../../../api/linerApi";

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
    <ESDFactoryMap></ESDFactoryMap>
    </>
  );
};

export default ESDDashboardPage;
