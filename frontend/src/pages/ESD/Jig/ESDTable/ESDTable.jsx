import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllJigs,
  createJigs,
  deleteJigs,
  updateJigs,
} from "../../../../api/jigApi";
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
    editData: null,
    deleteConfirmOpen: false,
    stationToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    loading: true,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  const handleStateChange = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const showSnackbar = useCallback((message, severity = "success") => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  }, []);

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
    try {
      await createJigs(station);
      const result = await getAllJigs();
      handleStateChange({ allJigs: result, loading: false });
      showSnackbar(
        t("ESD_TEST.TOAST.CREATE_SUCCESS", { appName: "App for Translations" })
      );
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
      await createJigs(params);
      const result = await getAllJigs();
      handleStateChange({ allJigs: result, loading: false });
      showSnackbar(
        t("ESD_TEST.TOAST.UPDATE_SUCCESS", { appName: "App for Translations" })
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
        handleStateChange({ allJigs: result, loading: false });
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
        showSnackbar(t( error.response.data), "error");
        handleStateChange({ loading: false });
      }
    };
    fetchDataAllUsers();
  }, [navigate, t]);

  const handleConfirmDelete = async () => {
    if (state.stationToDelete) {
      await handleDelete(state.stationToDelete.id);
      handleDeleteClose();
    }
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchDescription = (event) => {
    setSearchDescription(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filterJigs = () => {
    return state.allJigs.filter((jig) => {
      return (
        jig.name.toLowerCase().includes(searchName.toLowerCase()) &&
        jig.description.toLowerCase().includes(searchDescription.toLowerCase())
      );
    });
  };

  const paginatedJigs = filterJigs().slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
                  value={searchName}
                  onChange={handleSearchNameChange}
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
                  value={searchDescription}
                  onChange={handleSearchDescription}
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
                  variant="contained"
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
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <CircularProgress />
                <Typography
                  variant="h6"
                  align="center"
                  color="textSecondary"
                  ml={2}
                >
                  {t("ESD_TEST.LOADING", {
                    appName: "App for Translations",
                  })}
                </Typography>
              </Box>
            ) : paginatedJigs.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <Typography
                  variant="h6"
                  align="center"
                  color="textSecondary"
                  ml={2}
                >
                  Sua lista está vazia
                </Typography>
              </Box>
            ) : (
              <List>
                {paginatedJigs.map((station) => (
                  <ListItem key={station.id} divider>
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
              count={filterJigs().length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
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
