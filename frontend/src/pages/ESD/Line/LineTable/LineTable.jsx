import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAllLines, createLine, deleteLine } from "../../../../api/linerApi";
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
import LineModal from "../LineModal/LineModal";
import LineForm from "../LineForm/LineForm";
import LineConfirmModal from "../LineConfirmModal/LineConfirmModal";
import LineEditForm from "../LineEditForm/LineEditForm";
import { useNavigate } from "react-router-dom";
// import "./LineTable.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const LineTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    allLines: [],
    line: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    lineToDelete: null,
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

  const handleOpen = (line) => handleStateChange({ line, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (line) =>
    handleStateChange({ lineToDelete: line, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, lineToDelete: null });

  const handleEditOpen = (line) => {
    handleStateChange({ editData: line, openEditModal: true });
  };

  const handleCreateLine = async (line) => {
    try {
      await createLine(line);
      const result = await getAllLines();
      handleStateChange({ allLines: result });
      showSnackbar(
        t("LINE.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
    } catch (error) {
      showSnackbar(
        t("LINE.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLine(id);
      handleStateChange({
        allLines: state.allLines.filter((line) => line.id !== id),
      });
      showSnackbar(
        t("LINE.TOAST.DELETE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(
        t("LINE.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      await createLine(params);
      const result = await getAllLines();
      handleStateChange({ allLines: result });
      showSnackbar(
        t("LINE.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
    } catch (error) {
      showSnackbar(
        t("LINE.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllLines();
        const resultLine = await getAllLines();
        console.log("resultLine", resultLine);
        handleStateChange({ allLines: resultLine });
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
    if (state.lineToDelete) {
      await handleDelete(state.lineToDelete.id);
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

  const filteredLines = (
    Array.isArray(state.allLines) ? state.allLines : []
  ).filter((line) => {
    const name = line.name
      ? line.name.toLowerCase()
      : "";
   
    const filterSerialNumber = state.filterSerialNumber.toLowerCase();
    return (
      name.includes(filterSerialNumber) 
    );
  });

  const paginatedLines = filteredLines.slice(
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
                  label={t("LINE.TABLE.USER_ID", {
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
                  label={t("LINE.TABLE.NAME", {
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
                  variant="contained"
                  color="success"
                  onClick={handleOpenModal}
                >
                  {t("LINE.ADD_LINE", {
                    appName: "App for Translations",
                  })}
                </Button>
              </Col>
            </Row>
            {paginatedLines.length === 0 ? (
              <Typography variant="h6" align="center" color="textSecondary">
                Sua lista está vazia
              </Typography>
            ) : (
              <List>
                {paginatedLines.map((line) => (
                  <ListItem
                    key={line.id}
                    divider
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Tooltip
                      title={`Id: ${line.id}, Linha: ${line.name}`}
                      arrow
                    >
                      <ListItemText
                        primary={`Id: ${line.id}`}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary">
                            {`Linha: ${line.name}`}
                            </Typography>
                          </>
                        }
                        className="textOverflow"
                      />
                    </Tooltip>
                    <ListItemSecondaryAction>
                      <Tooltip title={t("LINE.EDIT_LINE")}>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditOpen(line)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("LINE.INFO_LINE")}>
                        <IconButton
                          edge="end"
                          aria-label="info"
                          onClick={() => handleOpen(line)}
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("LINE.DELETE_LINE")}>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteOpen(line)}
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
              count={filteredLines.length}
              page={state.page}
              onPageChange={handleChangePage}
              rowsPerPage={state.rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <LineModal
              open={state.open}
              handleClose={handleClose}
              lineName={state.line.name}
              line={state.line}
            />
            <LineForm
              open={state.openModal}
              handleClose={handleCloseModal}
              onSubmit={handleCreateLine}
            />
            <LineEditForm
              open={state.openEditModal}
              handleClose={handleEditClose}
              onSubmit={handleEditCellChange}
              initialData={state.editData}
            />
            <LineConfirmModal
              open={state.deleteConfirmOpen}
              handleClose={handleDeleteClose}
              handleConfirm={handleConfirmDelete}
              title={t("LINE.CONFIRM_DIALOG.DELETE_LINE", {
                appName: "App for Translations",
              })}
              description={t("LINE.CONFIRM_DIALOG.CONFIRM-TEXT", {
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

export default LineTable;
