import React, { useEffect, useState } from "react";
import {
  getAllBracelets,
  getBracelets,
  createBracelets,
  deleteBracelets,
  updateBracelets,
} from "../../../api/braceletApi";
import { IconButton, Typography, Box, Snackbar, Alert } from "@mui/material";
import { Delete, Info } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import ESDModal from "../ESDModal/ESDModal";
import ESDForm from "../ESDForm/ESDForm";
import EditIcon from "@mui/icons-material/Edit";
import ESDEditForm from "../ESDEditForm/ESDEditForm";
import { useTranslation } from "react-i18next";
import ESDConfirmModal from "../ESDConfirmModal/ESDConfirmModal";

import "./SnackbarStyles.css"; // Importe o CSS

const StationTable = () => {
  const { t } = useTranslation();

  const [allBracelets, setAllBracelets] = useState([]);
  const [bracelet, setBracelet] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  const [editCell, setEditCell] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [editValue, setEditValue] = useState("");
  const [editData, setEditData] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [braceletToDelete, setBraceletToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSuccessSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const showErrorSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  const handleOpen = (bracelet) => {
    setBracelet(bracelet);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClose = () => {
    setEditModal(false);
    setEditData(null);
  };

  const handleEditOpen = (data) => {
    setEditData(data);
    setEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCreateBracelet = async (bracelet) => {
    const newBracelet = { ...bracelet, id: Date.now() };
    try {
      const response = await createBracelets(newBracelet);
      setAllBracelets((prev) => [...prev, newBracelet]);
      showSuccessSnackbar( t("ESD_TEST.TOAST.CREATE_SUCCESS", { appName: "App for Translations" }));
      return response.data;
    } catch (error) {
      showErrorSnackbar( t("ESD_TEST.TOAST.TOAST_ERROR", { appName: "App for Translations" }, error));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBracelets(id);
      setAllBracelets(allBracelets.filter((bracelet) => bracelet.id !== id));
      showSuccessSnackbar( t("ESD_TEST.TOAST.DELETE_SUCCESS", { appName: "App for Translations" }));
    } catch (error) {
      showErrorSnackbar( t("ESD_TEST.TOAST.TOAST_ERROR", { appName: "App for Translations" }, error));
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      setEditCell(params.id);
      setEditValue(params.value);
      const updatedBracelet = {
        ...bracelet,
        title: params.title,
        userId: params.userId,
        completed: params.completed,
      };
      const updatedItem = await updateBracelets(editCell, updatedBracelet);
      setAllBracelets((prev) =>
        prev.map((item) => (item.id === editCell ? updatedItem : item))
      );
      showSuccessSnackbar( t("ESD_TEST.TOAST.UPDATE_SUCCESS", { appName: "App for Translations" }));
    } catch(error){
      showErrorSnackbar( t("ESD_TEST.TOAST.TOAST_ERROR", { appName: "App for Translations" }, error));
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllBracelets();
        setAllBracelets(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchDataBracelet = async () => {
      try {
        const result = await getBracelets(bracelet.id);
        setBracelet(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchDataBracelet();
    fetchDataAllUsers();
  }, [bracelet.id]);

  const handleDeleteOpen = (bracelet) => {
    setBraceletToDelete(bracelet);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteConfirmOpen(false);
    setBraceletToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (braceletToDelete) {
      await handleDelete(braceletToDelete.id);
      handleDeleteClose();
    }
  };

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector GridLocaleText={{}} />
      <Button onClick={() => handleOpenModal()}>
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

  const rows = allBracelets;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("ESD_TEST.TABLE_HEADER", { appName: "App for Translations" })}
      </Typography>
      <div style={{ height: 1100, width: 1000 }}>
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
            toolbarDensityComfortable: t("ESD_TEST.TABLE.COMFORTABLE", {
              appName: "App for Translations",
            }),
          }}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: { onAdd: () => handleOpen(null) },
          }}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 75, 100]}
          onCellEditCommit={handleEditCellChange}
        />
      </div>
      <ESDModal
        open={open}
        handleClose={handleClose}
        braceletName={bracelet.title}
        bracelet={bracelet}
      />
      <ESDForm
        open={openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateBracelet}
      />
      <ESDEditForm
        open={openEditModal}
        handleClose={handleEditClose}
        onSubmit={handleEditCellChange}
        initialData={editData}
      />
      <ESDConfirmModal
        open={deleteConfirmOpen}
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
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        className={`snackbar-content snackbar-${snackbarSeverity}`}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            backgroundColor: "inherit",
            color: "inherit",
            fontWeight: "inherit",
            boxShadow: "inherit",
            borderRadius: "inherit",
            padding: "inherit",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StationTable;
