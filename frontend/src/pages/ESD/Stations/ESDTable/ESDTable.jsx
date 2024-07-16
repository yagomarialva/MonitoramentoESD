import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllStations,
  createStations,
  deleteStations,
  updateStations,
} from "../../../../api/stationApi";
import {
  IconButton,
  Box,
  Snackbar,
  Alert,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import ESDModal from "../ESDModal/ESDModal";
import ESDForm from "../ESDForm/ESDForm";
import ESDEditForm from "../ESDEditForm/ESDEditForm";
import ESDConfirmModal from "../ESDConfirmModal/ESDConfirmModal";
import "./SnackbarStyles.css";
import "./ESDTable.css";
import Menu from "../../../Menu/Menu";
import { Container, Typography } from "@mui/material";

const ESDTable = () => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    allStations: [],
    station: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    stationToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
  });

  const handleStateChange = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const showSnackbar = (message, severity) => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

  const handleOpen = (station) => handleStateChange({ station, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (station) =>
    handleStateChange({ stationToDelete: station, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, stationToDelete: null });

  const handleEditOpen = (station) => {
    handleStateChange({ editData: station, openEditModal: true });
  };

  const handleCreateMonitor = async (station) => {
     // Determina o próximo id baseado no maior id atual
     const maxId = state.allStations.reduce((max, station) => Math.max(max, station.id), 0);
     const newId = maxId + 1;
 
     // Cria o novo monitor com o próximo id
     const newStation = { id: newId, ...station };
     console.log('newStation', newStation);
 
     try {
         const response = await createStations(newStation);
         handleStateChange({ allStations: [...state.allStations, newStation] });
         showSnackbar(
             t("ESD_TEST.TOAST.CREATE_SUCCESS", { appName: "App for Translations" })
         );
         return response.data;
     } catch (error) {
         showSnackbar(
             t("ESD_TEST.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
             "error"
         );
     }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStations(id);
      handleStateChange({
        allStations: state.allStations.filter(
          (station) => station.id !== id
        ),
      });
      showSnackbar(
        t("ESD_TEST.TOAST.DELETE_SUCCESS", { appName: "App for Translations" }),"success"
      );
    } catch (error) {
      showSnackbar(
        t("ESD_TEST.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      const updatedBracelet = {
        ...state.station,
        id: params.id,
        name: params.name,
        description: params.description,
      };
      const updatedItem = await updateStations(updatedBracelet);

      handleStateChange({
        allStations: state.allStations.map((item) =>
          item.id === params.id ? updatedItem : item
        ),
      });

      showSnackbar(
        t("ESD_TEST.TOAST.UPDATE_SUCCESS", { appName: "App for Translations" }),"success"
      );
    } catch (error) {
      showSnackbar(
        t("ESD_TEST.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllStations();
        handleStateChange({ allStations: result });
      } catch (error) {
        showSnackbar(t(error.message),'error');
      }
    };
    fetchDataAllUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (state.stationToDelete) {
      await handleDelete(state.stationToDelete.id);
      handleDeleteClose();
    }
  };

  const CustomToolbar = () => (
    <GridToolbarContainer className="gridToolbar">
      <GridToolbarQuickFilter />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector GridLocaleText={{}} />
      <Button
        id="add-button"
        variant="outlined"
        color="success"
        onClick={handleOpenModal}
      >
        {t("ESD_TEST.ADD_STATION", { appName: "App for Translations" })}
      </Button>
    </GridToolbarContainer>
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: t("ESD_TEST.TABLE.USER_ID", {
        appName: "App for Translations",
      }),
      sortable: false,
      width: 160,
    },
    {
      field: "description",
      headerName: t("ESD_TEST.TABLE.NAME", { appName: "App for Translations" }),
      width: 250,
    },
    {
      field: "actions",
      headerName: t("ESD_TEST.TABLE.ACTIONS", {
        appName: "App for Translations",
      }),
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEditOpen(params.row)}
            edge="start"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="start"
            aria-label="info"
            onClick={() => handleOpen(params.row)}
          >
            <Info />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteOpen(params.row)}
            edge="start"
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = state.allStations;

  return (
    <>
      <Menu></Menu>
      <Typography paragraph>
        <Container sx={{ mt: -7, ml: 22, width: 900 }}>
          <Box sx={{ p: 3 }}>
            <div className="grid-table">
              <DataGrid
                rows={rows}
                columns={columns}
                localeText={{
                  toolbarColumns: t("ESD_TEST.TABLE.COLUMNS", {
                    appName: "App for Translations",
                  }),
                  toolbarFilters: t("ESD_TEST.TABLE.SEARCH", {
                    appName: "App for Translations",
                  }),
                  toolbarDensity: t("ESD_TEST.TABLE.DENSITY", {
                    appName: "App for Translations",
                  }),
                  toolbarDensityCompact: t("ESD_TEST.TABLE.COMPACT", {
                    appName: "App for Translations",
                  }),
                  toolbarDensityStandard: t("ESD_TEST.TABLE.STANDARD", {
                    appName: "App for Translations",
                  }),
                  toolbarDensityComfortable: t("ESD_TEST.TABLE.CONFORTABLE", {
                    appName: "App for Translations",
                  }),
                }}
                components={{ Toolbar: CustomToolbar }}
                componentsProps={{ toolbar: { onAdd: () => handleOpen(null) } }}
                slots={{ toolbar: CustomToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 25 } },
                }}
                pageSizeOptions={[5, 10, 25, 50, 75, 100]}
                onCellEditCommit={handleEditCellChange}
              />
            </div>
            <ESDModal
              open={state.open}
              handleClose={handleClose}
              stationName={state.station.name}
              station={state.station}
            />
            <ESDForm
              open={state.openModal}
              handleClose={handleCloseModal}
              onSubmit={handleCreateMonitor}
            />
            <ESDEditForm
              open={state.openEditModal}
              handleClose={handleEditClose}
              onSubmit={handleEditCellChange}
              initialData={state.editData}
            />
            <ESDConfirmModal
              open={state.deleteConfirmOpen}
              handleClose={handleDeleteClose}
              handleConfirm={handleConfirmDelete}
              title={t("ESD_TEST.CONFIRM_DIALOG.DELETE_STATION", {
                appName: "App for Translations",
              })}
              description={t("ESD_TEST.CONFIRM_DIALOG.CONFIRM-TEXT", {
                appName: "App for Translations",
              })}
            />
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
          </Box>
        </Container>
      </Typography>
    </>
  );
};

export default ESDTable;
