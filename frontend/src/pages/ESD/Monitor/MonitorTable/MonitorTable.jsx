import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllMonitors,
  createMonitors,
  deleteMonitors,
  updateMonitors,
} from "../../../../api/monitorApi";
import {
  IconButton,
  Box,
  Snackbar,
  Alert,
  Button,
  Chip,
  Stack,
  Container,
  Typography,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import "./SnackbarStyles.css";
import "./ESDTable.css";
import MonitorModal from "../MonitorModal/MonitorModal";
import MonitorForm from "../MonitorForm/MonitorForm";
import MonitorConfirmModal from "../MonitorConfirmModal/MonitorConfirmModal";
import MonitorEditForm from "../MonitorEditForm/MonitorEditForm";
import Menu from "../../../Menu/Menu";

const MonitorTable = () => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    allMonitors: [],
    monitor: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    monitorToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
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

  const handleOpen = (monitor) => handleStateChange({ monitor, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (monitor) =>
    handleStateChange({ monitorToDelete: monitor, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, monitorToDelete: null });

  const handleEditOpen = (monitor) => {
    handleStateChange({ editData: monitor, openEditModal: true });
  };

  const handleCreateMonitor = async (monitor) => {
    // Determina o próximo id baseado no maior id atual
    const maxId = state.allMonitors.reduce((max, monitor) => Math.max(max, monitor.id), 0);
    const newId = maxId + 1;

    // Cria o novo monitor com o próximo id
    const newMonitor = { id: newId, ...monitor };
    console.log('newMonitor', newMonitor);

    try {
        const response = await createMonitors(newMonitor);
        handleStateChange({ allMonitors: [...state.allMonitors, newMonitor] });
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
      await deleteMonitors(id);
      handleStateChange({
        allMonitors: state.allMonitors.filter((monitor) => monitor.id !== id),
      });
      showSnackbar(
        t("ESD_TEST.TOAST.DELETE_SUCCESS", { appName: "App for Translations" })
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
      console.log('params',params)
      const updatedMonitor = {
        ...state.monitor,
        id: params.id,
        description: params.description,
        serialNumber: params.serialNumber,
      };
      const updatedItem = await createMonitors( updatedMonitor);
      console.log('updatedMonitor',updatedItem)
      handleStateChange({
        allMonitors: state.allMonitors.map((item) =>
          item.id === params.id ? updatedItem : item
        ),
      });

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
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllMonitors();
        handleStateChange({ allMonitors: result });
      } catch (error) {
        showSnackbar(t(error.message));
      }
    };
    fetchDataAllUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (state.monitorToDelete) {
      await handleDelete(state.monitorToDelete.id);
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
        {t("ESD_MONITOR.ADD_MONITOR", { appName: "App for Translations" })}
      </Button>
    </GridToolbarContainer>
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "serialNumber",
      headerName: t("ESD_MONITOR.TABLE.USER_ID", {
        appName: "App for Translations",
      }),
      sortable: false,
      width: 160,
    },
    {
      field: "description",
      headerName: t("ESD_MONITOR.TABLE.NAME", {
        appName: "App for Translations",
      }),
      width: 250,
    },
    {
      field: "actions",
      headerName: t("ESD_MONITOR.TABLE.ACTIONS", {
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

  const rows = state.allMonitors;
  return (
    <>
      <Menu></Menu>
      <Typography paragraph>
        <Container sx={{ mt: -7, ml: 22, width: 860 }}>
          <Box sx={{ p: 3 }}>
              <DataGrid
                
                rows={rows}
                columns={columns}
                getRowId={(row) => row.serialNumber}
                localeText={{
                  toolbarColumns: t("ESD_MONITOR.TABLE.COLUMNS", {
                    appName: "App for Translations",
                  }),
                  toolbarFilters: t("ESD_MONITOR.TABLE.SEARCH", {
                    appName: "App for Translations",
                  }),
                  toolbarDensity: t("ESD_MONITOR.TABLE.DENSITY", {
                    appName: "App for Translations",
                  }),
                  toolbarDensityCompact: t("ESD_MONITOR.TABLE.COMPACT", {
                    appName: "App for Translations",
                  }),
                  toolbarDensityStandard: t("ESD_MONITOR.TABLE.STANDARD", {
                    appName: "App for Translations",
                  }),
                  toolbarDensityComfortable: t(
                    "ESD_MONITOR.TABLE.CONFORTABLE",
                    {
                      appName: "App for Translations",
                    }
                  ),
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
            <MonitorModal
              open={state.open}
              handleClose={handleClose}
              monitorName={state.monitor.serialNumber}
              monitor={state.monitor}
            />
            <MonitorForm
              open={state.openModal}
              handleClose={handleCloseModal}
              onSubmit={handleCreateMonitor}
            />
            <MonitorEditForm
              open={state.openEditModal}
              handleClose={handleEditClose}
              onSubmit={handleEditCellChange}
              initialData={state.editData}
            />
            <MonitorConfirmModal
              open={state.deleteConfirmOpen}
              handleClose={handleDeleteClose}
              handleConfirm={handleConfirmDelete}
              title={t("ESD_MONITOR.CONFIRM_DIALOG.DELETE_STATION", {
                appName: "App for Translations",
              })}
              description={t("ESD_MONITOR.CONFIRM_DIALOG.CONFIRM-TEXT", {
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

export default MonitorTable;
