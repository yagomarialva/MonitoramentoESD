import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllBracelets,
  createBracelets,
  deleteBracelets,
  updateBracelets,
} from "../../../../api/braceletApi";
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
import ESDModal from "../ESDModal/ESDModal";
import ESDForm from "../ESDForm/ESDForm";
import ESDEditForm from "../ESDEditForm/ESDEditForm";
import ESDConfirmModal from "../ESDConfirmModal/ESDConfirmModal";
import "./SnackbarStyles.css";
import "./ESDTable.css";

const ESDTable = () => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    allBracelets: [],
    bracelet: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    braceletToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
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

  const handleOpen = (bracelet) => handleStateChange({ bracelet, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (bracelet) =>
    handleStateChange({ braceletToDelete: bracelet, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, braceletToDelete: null });

  const handleEditOpen = (bracelet) => {
    handleStateChange({ editData: bracelet, openEditModal: true });
  };

  const handleCreateBracelet = async (bracelet) => {
    const newBracelet = { ...bracelet, id: Date.now() };
    try {
      const response = await createBracelets(newBracelet);
      handleStateChange({ allBracelets: [...state.allBracelets, newBracelet] });
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
      await deleteBracelets(id);
      handleStateChange({
        allBracelets: state.allBracelets.filter(
          (bracelet) => bracelet.id !== id
        ),
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
      const updatedBracelet = {
        ...state.bracelet,
        title: params.title,
        userId: params.userId,
        completed: params.completed,
      };
      const updatedItem = await updateBracelets(params.id, updatedBracelet);

      handleStateChange({
        allBracelets: state.allBracelets.map((item) =>
          item.id === params.id ? updatedItem : item
        ),
      });

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
        const result = await getAllBracelets();
        handleStateChange({ allBracelets: result });
      } catch (error) {
        showSnackbar(t(error.message));
      }
    };
    fetchDataAllUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (state.braceletToDelete) {
      await handleDelete(state.braceletToDelete.id);
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
        {t("ESD_TEST.ADD_STATION", { appName: "App for Translations" })}
      </Button>
    </GridToolbarContainer>
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "userId",
      headerName: t("ESD_TEST.TABLE.USER_ID", {
        appName: "App for Translations",
      }),
      sortable: false,
      width: 160,
    },
    {
      field: "title",
      headerName: t("ESD_TEST.TABLE.NAME", { appName: "App for Translations" }),
      width: 250,
    },
    { field: "completed", headerName: "Completed", width: 250 },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      renderCell: (params) => (
        <Stack spacing={1} alignItems="right" style={{ marginTop: "10px" }}>
          <Stack direction="row" spacing={1}>
            <Chip
              label={params.row.completed ? "Completed" : "Pending"}
              color={params.row.completed ? "success" : "warning"}
            />
          </Stack>
        </Stack>
      ),
    },
    {
      field: "actions",
      headerName: t("ESD_TEST.TABLE.ACTIONS", {
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

  const rows = state.allBracelets;

  return (
    <Box sx={{ p: 3 }}>
      <div className="grid-table">
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={{
            toolbarColumns: t("ESD_TEST.TABLE.COLUMNS", {
              appName: "App for Translations",
            }),
            toolbarFilters: t("ESD_TEST.TABLE.SEARCH", {
              appName: "App for Translations",
            }),
            toolbarDensity: t("ESD_TEST.TABLE.DENSITY", {
              appName: "App for Translations",
            }),
            toolbarDensityCompact: t("ESD_TEST.TABLE.COMPACT", {
              appName: "App for Translations",
            }),
            toolbarDensityStandard: t("ESD_TEST.TABLE.STANDARD", {
              appName: "App for Translations",
            }),
            toolbarDensityComfortable: t("ESD_TEST.TABLE.CONFORTABLE", {
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
      <ESDModal
        open={state.open}
        handleClose={handleClose}
        braceletName={state.bracelet.title}
        bracelet={state.bracelet}
      />
      <ESDForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateBracelet}
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
  );
};

export default ESDTable;
