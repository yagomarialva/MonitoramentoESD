import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllMonitors,
  createMonitor,
  deleteMonitor,
  updateMonitor,
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
  Tooltip,
  Typography,
  TablePagination,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import MonitorModal from "../MonitorModal/MonitorModal";
import MonitorForm from "../MonitorForm/MonitorForm";
import MonitorConfirmModal from "../MonitorConfirmModal/MonitorConfirmModal";
import MonitorEditForm from "../MonitorEditForm/MonitorEditForm";
import { useNavigate } from "react-router-dom";
import "./MonitorTable.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const MonitorTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    const maxId = state.allMonitors.reduce(
      (max, monitor) => Math.max(max, monitor.id),
      0
    );
    const newId = maxId + 1;

    const newMonitor = { id: newId, ...monitor };
    try {
      const response = await createMonitor(newMonitor);
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
      await deleteMonitor(id);
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
      const updatedItem = await updateMonitor(updatedMonitor);
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
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
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

  const handleChangePage = (event, newPage) => {
    handleStateChange({ page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    handleStateChange({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const filteredMonitors = state.allMonitors.filter((monitor) => {
    return (
      monitor.serialNumber
        .toLowerCase()
        .includes(state.filterSerialNumber.toLowerCase()) &&
      monitor.description
        .toLowerCase()
        .includes(state.filterDescription.toLowerCase())
    );
  });

  const paginatedMonitors = filteredMonitors.slice(
    state.page * state.rowsPerPage,
    state.page * state.rowsPerPage + state.rowsPerPage
  );

  return (
    <>
      <Typography paragraph>
        <Container>
          <Box>
            <Row>
              <Col sm={10}>
                <TextField
                  name="filterSerialNumber"
                  label={t("ESD_MONITOR.TABLE.USER_ID", {
                    appName: "App for Translations",
                  })}
                  variant="outlined"
                  value={state.filterSerialNumber}
                  onChange={handleFilterChange}
                  sx={{ mb: 2, mr: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="filterDescription"
                  label={t("ESD_MONITOR.TABLE.NAME", {
                    appName: "App for Translations",
                  })}
                  variant="outlined"
                  value={state.filterDescription}
                  onChange={handleFilterChange}
                  sx={{ mb: 2, mr: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Col>
              <Col sm={2}>
                <Button
                  id="add-button"
                  variant="outlined"
                  color="success"
                  onClick={handleOpenModal}
                >
                  {t("ESD_MONITOR.ADD_MONITOR", {
                    appName: "App for Translations",
                  })}
                </Button>
              </Col>
            </Row>
            {paginatedMonitors.length === 0 ? (
              <Typography variant="h6" align="center" color="textSecondary">
                Sua lista está vazia
              </Typography>
            ) : (
              <List>
                {paginatedMonitors.map((monitor) => (
                  <ListItem
                    key={monitor.id}
                    divider
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Tooltip
                      title={`Nome: ${monitor.serialNumber}, Matricula: ${monitor.description}`}
                      arrow
                    >
                      <ListItemText
                        primary={monitor.serialNumber}
                        secondary={monitor.description}
                        className="textOverflow"
                      />
                    </Tooltip>
                    <ListItemSecondaryAction>
                      <Tooltip title={t("ESD_MONITOR.EDIT_MONITOR")}>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditOpen(monitor)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("ESD_MONITOR.INFO_MONITOR")}>
                        <IconButton
                          edge="end"
                          aria-label="info"
                          onClick={() => handleOpen(monitor)}
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("ESD_MONITOR.DELETE_MONITOR")}>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteOpen(monitor)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
            <TablePagination
              component="div"
              count={filteredMonitors.length}
              page={state.page}
              onPageChange={handleChangePage}
              rowsPerPage={state.rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
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
