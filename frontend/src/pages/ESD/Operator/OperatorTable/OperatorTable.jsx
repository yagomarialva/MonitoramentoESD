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
  Chip,
  Stack,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import OperatorModal from "../OperatorModal/OperatorModal";
import ESDForm from "../OperatorForm/OperatorForm";
import ESDEditForm from "../OperatorEditForm/ESDEditForm";
import "./SnackbarStyles.css";
import "./ESDTable.css";
import OperatorConfirmModal from "../OperatorConfirmModal/OperatorConfirmModal";
import Menu from "../../../Menu/Menu";

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
  const isAuthenticated = localStorage.getItem('token') !== null;
  console.log('isAuthenticated', isAuthenticated)

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
    const newOperator = { ...operator, id: Date.now() };
    try {
      const response = await createOperators(newOperator);
      handleStateChange({ allOperators: [...state.allOperators, newOperator] });
      showSnackbar(
        t("ESD_OPERATOR.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return response.data;
    } catch (error) {
      showSnackbar(
        t("ESD_OPERATOR.TOAST.TOAST_ERROR", {
          appName: "App for Translations",
        }),
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
      const updatedOperator = {
        ...state.operator,
        phone: params.phone,
        name: params.name,
        username: params.username,
      };
      const updatedItem = await updateOperators(params.id, updatedOperator);

      handleStateChange({
        allOperators: state.allOperators.map((item) =>
          item.id === params.id ? updatedItem : item
        ),
      });

      showSnackbar(
        t("ESD_OPERATOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      console.log(error);
      showSnackbar(
        t("ESD_OPERATOR.TOAST.TOAST_ERROR", {
          appName: "App for Translations",
        }),
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllOperators();
        handleStateChange({ allOperators: result });
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

  const CustomToolbar = () => (
    <GridToolbarContainer className="gridToolbar">
      <GridToolbarQuickFilter />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector GridLocaleText={{}} />
      <Button
        id="add-button"
        variant="outlined"
        color="success"
        onClick={handleOpenModal}
      >
        {t("ESD_OPERATOR.ADD_OPERATOR", { appName: "App for Translations" })}
      </Button>
    </GridToolbarContainer>
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "phone",
      headerName: t("ESD_OPERATOR.TABLE.USER_ID", {
        appName: "App for Translations",
      }),
      sortable: false,
      width: 160,
    },
    {
      field: "name",
      headerName: t("ESD_OPERATOR.TABLE.NAME", {
        appName: "App for Translations",
      }),
      width: 250,
    },
    {
      field: "username",
      headerName: t("ESD_OPERATOR.TABLE.ROLE", {
        appName: "App for Translations",
      }),
      width: 250,
    },
    {
      field: "actions",
      headerName: t("ESD_OPERATOR.TABLE.ACTIONS", {
        appName: "App for Translations",
      }),
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEditOpen(params.row)}
            edge="start"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="start"
            aria-label="info"
            onClick={() => handleOpen(params.row)}
          >
            <Info />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteOpen(params.row)}
            edge="start"
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = state.allOperators;
  return (
    <>    
    <Menu></Menu>
    <Box sx={{ p: 3 }}>
      <div className="grid-table">
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={{
            toolbarColumns: t("ESD_OPERATOR.TABLE.COLUMNS", {
              appName: "App for Translations",
            }),
            toolbarFilters: t("ESD_OPERATOR.TABLE.SEARCH", {
              appName: "App for Translations",
            }),
            toolbarDensity: t("ESD_OPERATOR.TABLE.DENSITY", {
              appName: "App for Translations",
            }),
            toolbarDensityCompact: t("ESD_OPERATOR.TABLE.COMPACT", {
              appName: "App for Translations",
            }),
            toolbarDensityStandard: t("ESD_OPERATOR.TABLE.STANDARD", {
              appName: "App for Translations",
            }),
            toolbarDensityComfortable: t("ESD_OPERATOR.TABLE.CONFORTABLE", {
              appName: "App for Translations",
            }),
          }}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{ toolbar: { onAdd: () => handleOpen(null) } }}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 25 } },
          }}
          pageSizeOptions={[5, 10, 25, 50, 75, 100]}
          onCellEditCommit={handleEditCellChange}
        />
      </div>
      <OperatorModal
        open={state.open}
        handleClose={handleClose}
        operatorName={state.operator.name}
        operator={state.operator}
      />
      <ESDForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateOperator}
      />
      <ESDEditForm
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
        description={t("ESD_OPERATOR.CONFIRM_DIALOG.CONFIRM-TEXT", {
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
    </>
  );
};

export default OperatorTable;
