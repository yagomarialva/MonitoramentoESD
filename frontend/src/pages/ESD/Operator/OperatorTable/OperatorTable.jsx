import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllOperators,
  createOperators,
  deleteOperators,
  updateOperators,
} from "../../../../api/operatorsAPI";
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
  Container,
  Typography,
  TablePagination,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import OperatorModal from "../OperatorModal/OperatorModal";
import OperatorForm from "../OperatorForm/OperatorForm";
import OperatorEditForm from "../OperatorEditForm/OperatorEditForm";
import OperatorConfirmModal from "../OperatorConfirmModal/OperatorConfirmModal";
import Menu from "../../../Menu/Menu";
import "./SnackbarStyles.css";
import "./ESDTable.css";

const OperatorTable = () => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    allOperators: [],
    operator: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    operatorToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [searchBadge, setSearchBadge] = useState("");

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

  const handleOpen = (operator) => handleStateChange({ operator, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (operator) =>
    handleStateChange({ operatorToDelete: operator, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, operatorToDelete: null });

  const handleEditOpen = (operator) => {
    handleStateChange({ editData: operator, openEditModal: true });
  };

  const handleCreateOperator = async (operator) => {
    try {
      const response = await createOperators(operator);
      const result = await getAllOperators();
      handleStateChange({ allOperators: result.value });
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
      await deleteOperators(id);
      handleStateChange({
        allOperators: state.allOperators.filter(
          (operator) => operator.id !== id
        ),
      });
      showSnackbar(
        t("ESD_OPERATOR.TOAST.DELETE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(
        t("ESD_OPERATOR.TOAST.TOAST_ERROR", {
          appName: "App for Translations",
        }),
        "error"
      );
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      const response = await createOperators(params);
      const result = await getAllOperators();
      handleStateChange({ allOperators: result.value });
      showSnackbar(
        t("ESD_OPERATOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return response.data;
    } catch (error) {
      const result = await getAllOperators();
      if (result) {
        handleStateChange({ allOperators: result.value });
        showSnackbar(
          t("ESD_OPERATOR.TOAST.UPDATE_SUCCESS", {
            appName: "App for Translations",
          })
        );
      } else {
        showSnackbar(
          t("ESD_OPERATOR.TOAST.TOAST_ERROR", {
            appName: "App for Translations",
          }),
          "error"
        );
      }
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllOperators();
        handleStateChange({ allOperators: result.value });
      } catch (error) {
        showSnackbar(t(error.message));
      }
    };
    fetchDataAllUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (state.operatorToDelete) {
      await handleDelete(state.operatorToDelete.id);
      handleDeleteClose();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchBadgeChange = (event) => {
    setSearchBadge(event.target.value);
  };

  const filterOperators = () => {
    return state.allOperators.filter((operator) => {
      return (
        operator.name.toLowerCase().includes(searchName.toLowerCase()) &&
        operator.badge.toLowerCase().includes(searchBadge.toLowerCase())
      );
    });
  };

  const displayOperators = filterOperators().slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Menu />
      <Container>
        <TextField
          name="filterName"
          label="Nome"
          variant="outlined"
          value={state.filterName}
          onChange={handleSearchNameChange}
          sx={{ mb: 2, mr: 2 }}
        />
        <TextField
          name="filterDescription"
          label="Matricula"
          variant="outlined"
          value={state.filterDescription}
          onChange={handleSearchBadgeChange}
          sx={{ mb: 2 }}
        />
        <Button
          id="add-button"
          variant="outlined"
          color="success"
          onClick={handleOpenModal}
          sx={{ mb: 2, ml: 2 }}
        >
          {t("ESD_OPERATOR.ADD_OPERATOR", {
            appName: "App for Translations",
          })}
        </Button>
        <Box>
          <List>
            {displayOperators.map((operator) => (
              <ListItem
                key={operator.id}
                divider
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemText
                  primary={operator.name}
                  secondary={operator.badge}
                />
                <ListItemSecondaryAction>
                  <Tooltip title={t("ESD_OPERATOR.EDIT_OPERATOR")}>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditOpen(operator)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("ESD_OPERATOR.INFO_OPERATOR")}>
                    <IconButton
                      edge="end"
                      aria-label="info"
                      onClick={() => handleOpen(operator)}
                    >
                      <Info />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("ESD_OPERATOR.DELETE_OPERATOR")}>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteOpen(operator)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <TablePagination
            component="div"
            count={filterOperators().length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 75, 100]}
          />
        </Box>
        <OperatorModal
          open={state.open}
          handleClose={handleClose}
          operatorName={state.operator.name}
          operator={state.operator}
        />
        <OperatorForm
          open={state.openModal}
          handleClose={handleCloseModal}
          onSubmit={handleCreateOperator}
        />
        <OperatorEditForm
          open={state.openEditModal}
          handleClose={handleEditClose}
          onSubmit={handleEditCellChange}
          initialData={state.editData}
        />
        <OperatorConfirmModal
          open={state.deleteConfirmOpen}
          handleClose={handleDeleteClose}
          handleConfirm={handleConfirmDelete}
          title={t("ESD_OPERATOR.CONFIRM_DIALOG.DELETE_STATION", {
            appName: "App for Translations",
          })}
          description={t("ESD_OPERATOR.CONFIRM_DIALOG.CONFIRM_TEXT", {
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
      </Container>
    </>
  );
};

export default OperatorTable;
