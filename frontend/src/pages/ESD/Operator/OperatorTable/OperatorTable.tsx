import React, { useEffect, useState, useCallback } from "react";
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
  TablePagination,
  TextField,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import OperatorModal from "../OperatorModal/OperatorModal";
import OperatorForm from "../OperatorForm/OperatorForm";
import OperatorEditForm from "../OperatorEditForm/OperatorEditForm";
import OperatorConfirmModal from "../OperatorConfirmModal/OperatorConfirmModal";
import "./SnackbarStyles.css";
import "./OperatorTable.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface Operator {
  id: number;
  name: string;
  badge: string;
}

interface State {
  allOperators: Operator[];
  operator: Operator | null;
  open: boolean;
  openModal: boolean;
  openEditModal: boolean;
  editCell: any;
  editData: Operator | null;
  deleteConfirmOpen: boolean;
  operatorToDelete: Operator | null;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: "success" | "error" | "info" | "warning";
  loading: boolean;
}

const OperatorTable: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    allOperators: [],
    operator: null,
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
    loading: true,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [searchBadge, setSearchBadge] = useState("");
  const [loading, setLoading] = useState(true);

  const handleStateChange = (changes: Partial<State>) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const showSnackbar = useCallback((message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  }, []);

  const handleOpen = (operator: Operator) => handleStateChange({ operator, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () => handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (operator: Operator) => handleStateChange({
    operator,
    operatorToDelete: operator,
    deleteConfirmOpen: true,
  });
  const handleDeleteClose = () => handleStateChange({ deleteConfirmOpen: false, operatorToDelete: null });

  const handleEditOpen = (operator: Operator) => {
    handleStateChange({ editData: operator, openEditModal: true });
  };

  const handleCreateOperator = async (operator: Operator) => {
    try {
      const alreadyExists = checkIfExists(state.allOperators, operator);

      if (alreadyExists) {
        showSnackbar('Operador já existe no sistema.', "error");
        return;
      }

      const response = await createOperators(operator);
      const result = await getAllOperators();
      handleStateChange({ allOperators: result.value || result });
      showSnackbar(t("ESD_OPERATOR.TOAST.CREATE_SUCCESS", { appName: "App for Translations" }));
      
      return response.data;
    } catch (error: any) {
      showSnackbar(
        t("ESD_OPERATOR.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const checkIfExists = (result: Operator[], response: Operator) => {
    return result.some((operator) => operator.badge === response.badge);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOperators(id);
      handleStateChange({
        allOperators: state.allOperators.filter((operator) => operator.id !== id),
      });
      showSnackbar(t("ESD_OPERATOR.TOAST.DELETE_SUCCESS", { appName: "App for Translations" }));
    } catch (error: any) {
      showSnackbar(error.response.data, "error");
    }
  };

  const handleEditCellChange = async (params: any) => {
    try {
      const response = await updateOperators(params);
      const result = await getAllOperators();
      handleStateChange({ allOperators: result.value || result });
      showSnackbar(
        t("ESD_OPERATOR.TOAST.UPDATE_SUCCESS", { appName: "App for Translations" })
      );
      return response.data;
    } catch (error: any) {
      showSnackbar(error.response.data.errors.Name, "error");
    }
  };

  useEffect(() => {
    const fetchDataAllOperators = async () => {
      try {
        const result = await getAllOperators();
        handleStateChange({ allOperators: result.users.value || result.users });
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
      } catch (error: any) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
        showSnackbar(t(error.message));
      }
    };

    fetchDataAllOperators();
  }, [navigate, showSnackbar, t]);

  const handleConfirmDelete = async () => {
    if (state.operatorToDelete) {
      await handleDelete(state.operatorToDelete.id);
      handleDeleteClose();
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleSearchBadgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBadge(event.target.value);
  };

  const filterOperators = () => {
    const operators = state.allOperators ?? [];
    return operators.filter((operator) => {
      return (
        operator.name?.toLowerCase().includes(searchName.toLowerCase()) &&
        operator.badge?.toLowerCase().includes(searchBadge.toLowerCase())
      );
    });
  };

  const displayOperators = filterOperators().slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Container>
        <Row>
          <Col sm={10}>
            <TextField
              name="filterName"
              label={t("ESD_OPERATOR.TABLE.NAME", { appName: "App for Translations" })}
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
              name="filterBadge"
              label={t("ESD_OPERATOR.TABLE.USER_ID", { appName: "App for Translations" })}
              variant="outlined"
              value={searchBadge}
              onChange={handleSearchBadgeChange}
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
              {t("ESD_OPERATOR.ADD_OPERATOR", { appName: "App for Translations" })}
            </Button>
          </Col>
        </Row>
        <Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "500px" }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {displayOperators.map((operator) => (
                <ListItem key={operator.id} divider sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemText primary={operator.name} secondary={operator.badge} />
                  <ListItemSecondaryAction>
                    <Tooltip title={t("ESD_OPERATOR.TABLE.EDIT")}>
                      <IconButton onClick={() => handleEditOpen(operator)}>
                        <EditIcon color="info" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("ESD_OPERATOR.TABLE.DELETE")}>
                      <IconButton onClick={() => handleDeleteOpen(operator)}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        <TablePagination
          component="div"
          count={filterOperators().length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
      {/* <OperatorModal open={state.openModal} handleClose={handleCloseModal} handleCreateOperator={handleCreateOperator} />
      <OperatorEditForm open={state.openEditModal} handleClose={handleEditClose} editData={state.editData} handleEditCellChange={handleEditCellChange} />
      <OperatorConfirmModal open={state.deleteConfirmOpen} handleClose={handleDeleteClose} handleConfirmDelete={handleConfirmDelete} /> */}
      <Snackbar
        open={state.snackbarOpen}
        autoHideDuration={3000}
        onClose={() => handleStateChange({ snackbarOpen: false })}
      >
        <Alert onClose={() => handleStateChange({ snackbarOpen: false })} severity={state.snackbarSeverity} sx={{ width: "100%" }}>
          {state.snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OperatorTable;
