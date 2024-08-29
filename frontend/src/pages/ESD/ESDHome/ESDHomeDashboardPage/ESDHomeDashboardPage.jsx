import React, { useEffect, useState } from "react";
import {
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
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


const groupStationsByLine = (data) => {
  // Cria um objeto para armazenar as linhas e suas estações
  const grouped = data.reduce((acc, entry) => {
    const lineId = entry.line.id;

    // Se a linha ainda não estiver no acumulador, cria uma nova entrada
    if (!acc[lineId]) {
      acc[lineId] = { line: entry.line, stations: [] };
    }

    // Processa as estações para cada linha
    entry.stations.forEach((stationItem) => {
      const existingStationIndex = acc[lineId].stations.findIndex(
        (s) => s.station.id === stationItem.station.id
      );

      // Se a estação não estiver no acumulador, adiciona-a
      if (existingStationIndex === -1) {
        acc[lineId].stations.push({
          ...stationItem,
          monitorsESD: stationItem.monitorsESD || [],
        });
      } else {
        // Se a estação já estiver no acumulador, combina os monitores
        const existingStation = acc[lineId].stations[existingStationIndex];

        // Utiliza um mapa para evitar duplicação de monitores com base no ID
        const existingMonitorsMap = new Map(
          existingStation.monitorsESD.map((m) => [m.id, m])
        );

        // Adiciona novos monitores ao mapa
        (stationItem.monitorsESD || []).forEach((monitor) => {
          existingMonitorsMap.set(monitor.id, monitor);
        });

        // Atualiza a estação com os monitores combinados
        acc[lineId].stations[existingStationIndex] = {
          ...existingStation,
          monitorsESD: Array.from(existingMonitorsMap.values()),
        };
      }
    });

    return acc;
  }, {});

  // Converte o objeto para um array de valores
  return Object.values(grouped);
};


const ESDDashboardPage = () => {
  const { t } = useTranslation();
  const [groupedStations, setGroupedStations] = useState([]);
  const navigate = useNavigate();


  const [group, setGroup] = useState([]);

  const showSnackbar = (message, severity = "success") => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    allLinks: [],
    link: null,
    open: false,
    openModal: false,
    openEditModal: false,
    editData: null,
    deleteConfirmOpen: false,
    linkToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    loading: true, // Adicionei esta linha
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleStateChange = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleOpenModal = () => handleStateChange({ openModal: true });

  const handleCloseModal = () => handleStateChange({ openModal: false });

  const handleCreateMappedItem = async (link) => {
    try {
      await createStationMapper(link); // Primeiro cria o item
      const updatedData = await getAllStationMapper(); // Obtém todos os itens atualizados
      const groupedData = groupStationsByLine(updatedData); // Agrupa os dados
      setGroup(groupedData); // Atualiza o estado com os dados agrupados
      showSnackbar(
        t("MAP_FACTORY.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(error.response.data, "error");
    }
  };

  const fetchAndSetGroupedStations = async () => {
    try {
      const updatedStations = await getAllStationMapper();
      // Supondo que você tenha uma função de agrupamento de estações:
      const groupedData = groupStationsByLine(updatedStations);
      setGroup(groupedData);
    } catch (error) {
      console.error("Failed to fetch stations", error);
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      fetchAndSetGroupedStations();
      try {
        const toMount = await getAllStationMapper();
        const mounted = groupStationsByLine(toMount);
        setGroup(mounted);
      } catch (error) {
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
        groupedStations={group}
        refreshGroupedStations={fetchAndSetGroupedStations}
      ></StationMap>
      <ESDHomeForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateMappedItem}
      ></ESDHomeForm>
      <ESDHomeModal open={open} handleClose={handleClose} />
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
    </>
  );
};

export default ESDDashboardPage;
