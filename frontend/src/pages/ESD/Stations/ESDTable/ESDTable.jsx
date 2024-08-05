import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllJigs,
  createJigs,
  deleteJigs,
  updateJigs,
} from "../../../../api/stationApi";
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
  TablePagination,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import ESDModal from "../ESDModal/ESDModal";
import ESDForm from "../ESDForm/ESDForm";
import ESDEditForm from "../ESDEditForm/ESDEditForm";
import ESDConfirmModal from "../ESDConfirmModal/ESDConfirmModal";
import "./SnackbarStyles.css";
// import "./ESDTable.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ESDTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    allJigs: [],
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
    filterName: "",
    filterDescription: "",
    page: 0,
    rowsPerPage: 10,
    loading: true, // Adicionei esta linha
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
    const maxId = state.allJigs.reduce(
      (max, station) => Math.max(max, station.id),
      0
    );
    const newId = maxId + 1;
    const newJig = { id: newId, ...station };

    try {
      const response = await createJigs(newJig);
      handleStateChange({ allJigs: [...state.allJigs, newJig] });
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
      await deleteJigs(id);
      handleStateChange({
        allJigs: state.allJigs.filter((station) => station.id !== id),
      });
      showSnackbar(
        t("ESD_TEST.TOAST.DELETE_SUCCESS", { appName: "App for Translations" }),
        "success"
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
      const updatedItem = await updateJigs(updatedBracelet);

      handleStateChange({
        allJigs: state.allJigs.map((item) =>
          item.id === params.id ? updatedItem : item
        ),
      });

      showSnackbar(
        t("ESD_TEST.TOAST.UPDATE_SUCCESS", { appName: "App for Translations" }),
        "success"
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
        const result = await getAllJigs();
        handleStateChange({ allJigs: result, loading: false }); // Adicionei loading: false aqui
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
        showSnackbar(t(error.message), "error");
        handleStateChange({ loading: false }); // Adicionei loading: false aqui
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

  const filteredJigs = state.allJigs.filter((station) => {
    return (
      station.name.toLowerCase().includes(state.filterName.toLowerCase()) &&
      station.description
        .toLowerCase()
        .includes(state.filterDescription.toLowerCase())
    );
  });

  const paginatedJigs = filteredJigs.slice(
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
                  name="filterName"
                  label={t("ESD_TEST.TABLE.USER_ID", {
                    appName: "App for Translations",
                  })}
                  variant="outlined"
                  value={state.filterName}
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
                  label={t("ESD_TEST.TABLE.NAME", {
                    appName: "App for Translations",
                  })}
                  variant="outlined"
                  value={state.filterDescription}
                  onChange={handleFilterChange}
                  sx={{ mb: 2 }}
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
                  sx={{ mb: 2, ml: 2 }}
                >
                  {t("ESD_TEST.ADD_STATION", {
                    appName: "App for Translations",
                  })}
                </Button>
              </Col>
            </Row>
            {state.loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <CircularProgress />
                <Typography variant="h6" align="center" color="textSecondary" ml={2}>
                  {t("ESD_TEST.LOADING", {
                    appName: "App for Translations",
                  })}
                </Typography>
              </Box>
            ) : paginatedJigs.length === 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <Typography variant="h6" align="center" color="textSecondary" ml={2}>
                Sua lista está vazia
                </Typography>
              </Box>
            ) : (
              <List>
                {paginatedJigs.map((station) => (
                  <ListItem key={station.id}>
                    <ListItemText
                      primary={station.name}
                      secondary={station.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditOpen(station)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="info"
                        onClick={() => handleOpen(station)}
                      >
                        <Info />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteOpen(station)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
            <TablePagination
              component="div"
              count={filteredJigs.length}
              page={state.page}
              onPageChange={handleChangePage}
              rowsPerPage={state.rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
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
