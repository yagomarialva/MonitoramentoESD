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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Container,
  Typography,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
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
    filterSerialNumber: "",
    filterDescription: "",
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
    const maxId = state.allMonitors.reduce((max, monitor) => Math.max(max, monitor.id), 0);
    const newId = maxId + 1;

    const newMonitor = { id: newId, ...monitor };
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
      const updatedMonitor = {
        ...state.monitor,
        id: params.id,
        description: params.description,
        serialNumber: params.serialNumber,
      };
      const updatedItem = await updateMonitors(updatedMonitor);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    handleStateChange({ [name]: value });
  };

  const filteredMonitors = state.allMonitors.filter((monitor) => {
    return (
      monitor.serialNumber.toLowerCase().includes(state.filterSerialNumber.toLowerCase()) &&
      monitor.description.toLowerCase().includes(state.filterDescription.toLowerCase())
    );
  });

  return (
    <>
      <Menu />
      <Typography paragraph>
        <Container sx={{ mt: -7, ml: 22, width: 900 }}>
          <Box sx={{ p: 3 }}>
            <div>
              <TextField
                name="filterSerialNumber"
                label={t("ESD_MONITOR.TABLE.USER_ID", {
                  appName: "App for Translations",
                })}
                variant="outlined"
                value={state.filterSerialNumber}
                onChange={handleFilterChange}
                sx={{ mb: 2, mr: 2 }}
              />
              <TextField
                name="filterDescription"
                label={t("ESD_MONITOR.TABLE.NAME", {
                  appName: "App for Translations",
                })}
                variant="outlined"
                value={state.filterDescription}
                onChange={handleFilterChange}
                sx={{ mb: 2 }}
              />
              <Button
                id="add-button"
                variant="outlined"
                color="success"
                onClick={handleOpenModal}
                sx={{ mb: 2, ml: 2 }}
              >
                {t("ESD_MONITOR.ADD_MONITOR", { appName: "App for Translations" })}
              </Button>
              <List>
                {filteredMonitors.map((monitor) => (
                  <ListItem key={monitor.id}>
                    <ListItemText
                      primary={monitor.serialNumber}
                      secondary={monitor.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditOpen(monitor)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="info"
                        onClick={() => handleOpen(monitor)}
                      >
                        <Info />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteOpen(monitor)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
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
