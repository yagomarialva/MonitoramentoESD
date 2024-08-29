import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ESDHomeModal from "../ESDHomeModal/ESDHomeModal";
import {
  getAllStationMapper,
  createStationMapper,
  updateStationMapper,
  deleteStationMapper,
} from "../../../../api/mapingAPI";
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
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { v4 as uuidv4 } from "uuid"; // Import the uuidv4 function
import "./ESDTable.css";

// Function to format data with unique IDs
function dataFormater(result) {
  return result.flatMap((item) => {
    const lineId = uuidv4(); // ID único para cada linha

    return item.stations.flatMap((stationItem) => {
      const stationId = uuidv4(); // ID único para cada estação
      const monitors = stationItem.monitorsEsd.map((monitorEsdItem) => ({
        id: uuidv4(), // ID único para cada monitor
        lineId,
        stationId,
        lineName: item.line.name ?? "N/A",
        stationName: stationItem.station.name ?? "N/A",
        sizeX: stationItem.station.sizeX,
        sizeY: stationItem.station.sizeY,
        serialNumber: monitorEsdItem.monitorsEsd.serialNumber,
        status: monitorEsdItem.monitorsEsd.status,
        statusOperador: monitorEsdItem.monitorsEsd.statusOperador,
        statusJig: monitorEsdItem.monitorsEsd.statusJig,
        description: monitorEsdItem.monitorsEsd.description,
        unm: monitorEsdItem.monitorsEsd.unm,
        dateHour: monitorEsdItem.monitorsEsd.dateHour,
        lastDate: monitorEsdItem.monitorsEsd.lastDate,
      }));

      return monitors.length > 0
        ? monitors
        : [
            {
              id: uuidv4(), // ID único para a linha "N/A"
              lineId,
              stationId,
              lineName: item.line.name ?? "N/A",
              stationName: stationItem.station.name ?? "N/A",
              sizeX: stationItem.station.sizeX,
              sizeY: stationItem.station.sizeY,
              serialNumber: "N/A",
              status: "N/A",
              statusOperador: "N/A",
              statusJig: "N/A",
              description: "N/A",
              unm: "N/A",
              dateHour: "N/A",
              lastDate: "N/A",
            },
          ];
    });
  });
}

const ESDTableView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    allMappedItems: [],
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
  const handleClose = () => handleStateChange({ open: false });
  const showSnackbar = (message, severity = "success") => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

  const handleOpen = (monitor) => handleStateChange({ monitor, open: true });
  const handleEditOpen = (monitor) => {
    handleStateChange({ editData: monitor, openEditModal: true });
  };
  // Função para abrir o modal
  const handleOpenModal = () => {
    handleStateChange({ openModal: true });
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    handleStateChange({ openModal: false });
  };

  // Função para abrir o diálogo de confirmação de exclusão
  const handleDeleteOpen = () => {
    handleStateChange({ deleteConfirmOpen: true });
  };

  // Função para fechar o diálogo de confirmação de exclusão
  const handleDeleteClose = () => {
    handleStateChange({ deleteConfirmOpen: false });
  };

  const handleDelete = async (id) => {
    try {
      await deleteStationMapper(id); // Certifique-se de que a função deleteStationMapper está importada e disponível
      const result = await getAllStationMapper();
      handleStateChange({ allMappedItems: dataFormater(result) });
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

  const handleCreateMappedItem = async (monitor) => {
    try {
      await createStationMapper(monitor);
      const result = await getAllStationMapper();
      handleStateChange({ allMappedItems: dataFormater(result) });
      showSnackbar(
        t("ESD_MONITOR.TOAST.CREATE_SUCCESS", {
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

  const handleEditCellChange = async (params) => {
    try {
      await updateStationMapper(params);
      const result = await getAllStationMapper();
      handleStateChange({ allMappedItems: dataFormater(result) });
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
        const result = await getAllStationMapper();
        const formattedData = dataFormater(result);
        handleStateChange({ allMappedItems: formattedData });
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
    handleDeleteClose();
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

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "serialNumber", headerName: "Serial Number", width: 200 },
    { field: "lineName", headerName: "Line Name", width: 150 },
    { field: "stationName", headerName: "Station Name", width: 150 },
    { field: "sizeX", headerName: "Size X", width: 100 },
    { field: "sizeY", headerName: "Size Y", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: "bold",
            color:
              params.value === "PASS"
                ? "green"
                : params.value === "FAIL"
                ? "red"
                : "inherit",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "statusOperador",
      headerName: "Status Operador",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: "bold",
            color:
              params.value === "PASS"
                ? "green"
                : params.value === "FAIL"
                ? "red"
                : "inherit",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "statusJig",
      headerName: "Status Jig",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: "bold",
            color:
              params.value === "PASS"
                ? "green"
                : params.value === "FAIL"
                ? "red"
                : "inherit",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "description", headerName: "Description", width: 250 },
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
              <Tooltip title={t("ESD_OPERATOR.EDIT_OPERATOR")}>
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            }
          ></Button>
          <Button
            onClick={() => handleOpen(params.row)}
            startIcon={
              <Tooltip title={t("ESD_OPERATOR.INFO_OPERATOR")}>
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
              <Tooltip title={t("ESD_OPERATOR.DELETE_OPERATOR")}>
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
      {/* <Typography paragraph>
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
          <Box sx={{ height: 600, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={state.allMappedItems}
              columns={columns}
              pageSize={state.rowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={(newSize) =>
                handleStateChange({ rowsPerPage: newSize })
              }
              onPageChange={handleChangePage}
              pagination
            />
          </Box>
          <ESDHomeModal
              open={state.open}
              handleClose={handleClose}
              monitorName={state.monitor.serialNumber}
              produce={state.monitor}
            />
          <Snackbar
            open={state.snackbarOpen}
            autoHideDuration={6000}
            onClose={() => handleStateChange({ snackbarOpen: false })}
          >

            <Alert
              onClose={() => handleStateChange({ snackbarOpen: false })}
              severity={state.snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {state.snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Typography> */}
    </>
  );
};

export default ESDTableView;
