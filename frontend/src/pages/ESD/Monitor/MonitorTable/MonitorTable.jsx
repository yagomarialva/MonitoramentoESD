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
  TextField,
  Container,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import MonitorModal from "../MonitorModal/MonitorModal";
import { DataGrid } from "@mui/x-data-grid";
import MonitorForm from "../MonitorForm/MonitorForm";
import MonitorConfirmModal from "../MonitorConfirmModal/MonitorConfirmModal";
import MonitorEditForm from "../MonitorEditForm/MonitorEditForm";
import { useNavigate } from "react-router-dom";
import "./MonitorTable.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

const MonitorTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const handleOpen = (monitor) => handleStateChange({ monitor, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (monitor) =>
    handleStateChange({
      monitor,
      monitorToDelete: monitor,
      deleteConfirmOpen: true,
    });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, monitorToDelete: null });

  const handleEditOpen = (monitor) => {
    handleStateChange({ editData: monitor, openEditModal: true });
  };

  const handleCreateMonitor = async (monitor) => {
    try {
      await createMonitor(monitor);
      const result = await getAllMonitors();
      handleStateChange({ allMonitors: result });
      showSnackbar(
        t("ESD_MONITOR.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
    } catch (error) {
      showSnackbar(error.response.data, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMonitor(id);
      handleStateChange({
        allMonitors: state.allMonitors.filter((monitor) => monitor.id !== id),
      });
      showSnackbar(
        t("ESD_MONITOR.TOAST.DELETE_SUCCESS", {
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

  const handleEditCellChange = async (params) => {
    try {
      await createMonitor(params);
      const result = await getAllMonitors();
      handleStateChange({ allMonitors: result });
      showSnackbar(
        t("ESD_MONITOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
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
  }, [navigate, t]);

  const handleConfirmDelete = async () => {
    await handleDelete(state.monitorToDelete.id);
    if (state.monitorToDelete) {
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
    const serialNumberMatch = monitor.serialNumber
      ? monitor.serialNumber
          .toLowerCase()
          .includes(state.filterSerialNumber.toLowerCase())
      : false;
    const descriptionMatch = monitor.description
      ? monitor.description
          .toLowerCase()
          .includes(state.filterDescription.toLowerCase())
      : false;

    return serialNumberMatch && descriptionMatch;
  });

  const columns = [
    {
      field: "id",
      headerName: "id",
      width: 50,
    },
    {
      field: "serialNumber",
      headerName: t("ESD_MONITOR.TABLE.USER_ID"),
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Typography className="ellipsis-text">
            {params.value || ""}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "description",
      headerName: t("ESD_MONITOR.TABLE.NAME"),
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Typography className="ellipsis-text">
            {params.value || ""}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: t("ESD_MONITOR.TABLE.STATUS"),
      width: 150,
      renderCell: (params) => (
        <div className={`status-${(params.value || "").toLowerCase()}`}>
          {params.value || ""}
        </div>
      ),
    },
    {
      field: "statusJig",
      headerName: t("ESD_MONITOR.TABLE.STATUS_JIG"),
      width: 150,
      renderCell: (params) => (
        <div className={`status-${(params.value || "").toLowerCase()}`}>
          {params.value || ""}
        </div>
      ),
    },
    {
      field: "statusOperador",
      headerName: t("ESD_MONITOR.TABLE.STATUS_OPERATOR"),
      width: 150,
      renderCell: (params) => (
        <div className={`status-${(params.value || "").toLowerCase()}`}>
          {params.value || ""}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: t("ESD_MONITOR.TABLE.ACTIONS"),
      width: 250,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <div className="actions-content">
          <Button
            onClick={() => handleEditOpen(params.row)}
            startIcon={
              <Tooltip title={t("ESD_MONITOR.EDIT_MONITOR")}>
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            }
          ></Button>
          <Button
            onClick={() => handleOpen(params.row)}
            startIcon={
              <Tooltip title={t("ESD_MONITOR.INFO_MONITOR")}>
                <IconButton edge="end" aria-label="info">
                  <Info />
                </IconButton>
              </Tooltip>
            }
            sx={{ mx: 1 }}
          ></Button>
          <Button
            onClick={() => handleDeleteOpen(params.row)}
            startIcon={
              <Tooltip title={t("ESD_MONITOR.DELETE_MONITOR")}>
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              </Tooltip>
            }
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Typography paragraph>
        <Container>
          <Box className="filters-container">
            <TextField
              name="filterSerialNumber"
              label={t("ESD_MONITOR.TABLE.USER_ID")}
              variant="outlined"
              value={state.filterSerialNumber}
              onChange={handleFilterChange}
              sx={{ mr: 2 }}
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
              label={t("ESD_MONITOR.TABLE.NAME")}
              variant="outlined"
              value={state.filterDescription}
              onChange={handleFilterChange}
              sx={{ mr: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              id="add-button"
              variant="contained"
              color="success"
              onClick={handleOpenModal}
              sx={{ marginLeft: "auto" }}
            >
              {t("ESD_MONITOR.ADD_MONITOR")}
            </Button>
          </Box>
          <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={filteredMonitors}
              columns={columns}
              pageSize={state.rowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={(newSize) =>
                handleStateChange({ rowsPerPage: newSize })
              }
              onPageChange={handleChangePage}
              pagination
            />
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
            open={state.openEditModal}
            handleClose={handleEditClose}
            onSubmit={handleEditCellChange}
            initialData={state.editData}
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
        </Container>
      </Typography>
    </>
  );
};

export default MonitorTable;
