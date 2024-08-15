import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAllStations, createStation, deleteStation } from "../../../../api/stationApi";
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
import StationModal from "../StationModal/StationModal";
import StationForm from "../StationForm/StationForm";
import StationConfirmModal from "../StationConfirmModal/StationConfirmModal";
import StationEditForm from "../StationEditForm/StationEditForm";
import { useNavigate } from "react-router-dom";
// import "./StationTable.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const StationTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const handleCreateStation = async (station) => {
    try {
      await createStation(station);
      const result = await getAllStations();
      handleStateChange({ allStations: result });
      showSnackbar(
        t("STATION.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
    } catch (error) {
      showSnackbar(
        t("STATION.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStation(id);
      handleStateChange({
        allStations: state.allStations.filter((station) => station.id !== id),
      });
      showSnackbar(
        t("STATION.TOAST.DELETE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(
        t("STATION.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      await createStation(params);
      const result = await getAllStations();
      handleStateChange({ allStations: result });
      showSnackbar(
        t("STATION.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
    } catch (error) {
      showSnackbar(
        t("STATION.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
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
    if (state.stationToDelete) {
      await handleDelete(state.stationToDelete.id);
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

  const filteredStations = (
    Array.isArray(state.allStations) ? state.allStations : []
  ).filter((station) => {
    const name = station.name
      ? station.name.toLowerCase()
      : "";
   
    const filterSerialNumber = state.filterSerialNumber.toLowerCase();
    return (
      name.includes(filterSerialNumber) 
    );
  });

  const paginatedStations = filteredStations.slice(
    Math.max(0, state.page * state.rowsPerPage),
    Math.max(0, state.page * state.rowsPerPage + state.rowsPerPage)
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
                  label={t("STATION.TABLE.USER_ID", {
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
              </Col>
              <Col sm={2}>
                <Button
                  id="add-button"
                  variant="contained"
                  color="success"
                  onClick={handleOpenModal}
                >
                  {t("STATION.ADD_STATION", {
                    appName: "App for Translations",
                  })}
                </Button>
              </Col>
            </Row>
            {paginatedStations.length === 0 ? (
              <Typography variant="h6" align="center" color="textSecondary">
                Sua lista está vazia
              </Typography>
            ) : (
              <List>
                {paginatedStations.map((station) => (
                  <ListItem
                    key={station.id}
                    divider
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Tooltip
                      title={`Id: ${station.id}`}
                      arrow
                    >
                      <ListItemText
                        primary={` ${station.name}`}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary">
                            {`Tamanho X: ${station.sizeX}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                            {`Tamanho Y: ${station.sizeY}`}
                          </Typography>

                          </>
                        }
                        className="textOverflow"
                      />
                    </Tooltip>
                    <ListItemSecondaryAction>
                      <Tooltip title={t("STATION.EDIT_STATION")}>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditOpen(station)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("STATION.INFO_STATION")}>
                        <IconButton
                          edge="end"
                          aria-label="info"
                          onClick={() => handleOpen(station)}
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("STATION.DELETE_STATION")}>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteOpen(station)}
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
              count={filteredStations.length}
              page={state.page}
              onPageChange={handleChangePage}
              rowsPerPage={state.rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <StationModal
              open={state.open}
              handleClose={handleClose}
              stationName={state.station.name}
              station={state.station}
            />
            <StationForm
              open={state.openModal}
              handleClose={handleCloseModal}
              onSubmit={handleCreateStation}
            />
            <StationEditForm
              open={state.openEditModal}
              handleClose={handleEditClose}
              onSubmit={handleEditCellChange}
              initialData={state.editData}
            />
            <StationConfirmModal
              open={state.deleteConfirmOpen}
              handleClose={handleDeleteClose}
              handleConfirm={handleConfirmDelete}
              title={t("STATION.CONFIRM_DIALOG.DELETE_STATION", {
                appName: "App for Translations",
              })}
              description={t("STATION.CONFIRM_DIALOG.CONFIRM-TEXT", {
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

export default StationTable;
