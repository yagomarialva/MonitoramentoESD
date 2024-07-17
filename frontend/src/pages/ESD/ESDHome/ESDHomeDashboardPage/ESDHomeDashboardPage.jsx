import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Modal,
  Button,
  TextField,
  Container,
} from "@mui/material";
import { CardHeader } from "react-bootstrap";
import Menu from "../../../Menu/Menu";
import { getAllProduce } from "../../../../api/produceActivity";
import "./SnackbarStyles.css";
import "./ESDTable.css";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  getAllJigs,
  createJigs,
  deleteJigs,
  updateJigs,
} from "../../../../api/stationApi";
import { IconButton, Snackbar, Alert, Chip, Stack } from "@mui/material";
import ESDHomeModal from "../ESDHomeModal/ESDHomeModal";
import ESDHomeForm from "../ESDHomeForm/ESDHomeForm";

const ESDHomeDashboardPage = () => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    allProduces: [],
    produce: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    produceToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
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

  const handleOpen = (produce) => handleStateChange({ produce, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (produce) =>
    handleStateChange({ produceToDelete: produce, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, produceToDelete: null });

  const handleEditOpen = (produce) => {
    handleStateChange({ editData: produce, openEditModal: true });
  };

  const handleCreateMonitor = async (produce) => {
    // Determina o próximo id baseado no maior id atual
    const maxId = state.allProduces.reduce(
      (max, produce) => Math.max(max, produce.id),
      0
    );
    const newId = maxId + 1;

    // Cria o novo monitor com o próximo id
    const newStation = { id: newId, ...produce };
    console.log("newStation", newStation);

    try {
      // const response = await createStations(newStation);
      handleStateChange({ allProduces: [...state.allProduces, newStation] });
      showSnackbar(
        t("ESD_TEST.TOAST.CREATE_SUCCESS", { appName: "App for Translations" })
      );
      // return response.data;
    } catch (error) {
      showSnackbar(
        t("ESD_TEST.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      // await deleteStations(id);
      handleStateChange({
        allProduces: state.allProduces.filter((produce) => produce.id !== id),
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
        ...state.produce,
        id: params.id,
        name: params.name,
        description: params.description,
      };
      // const updatedItem = await updateStations(updatedBracelet);

      handleStateChange({
        // allProduces: state.allProduces.map((item) =>
        //   item.id === params.id ? updatedItem : item
        // ),
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
        const result = await getAllProduce();
        // const result2 = await getStations(1);
        // console.log(result2.description);
        handleStateChange({ allProduces: result });
      } catch (error) {
        showSnackbar(t(error.message), "error");
      }
    };
    fetchDataAllUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (state.produceToDelete) {
      await handleDelete(state.produceToDelete.id);
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
      headerName: "Operador",
      sortable: false,
      width: 160,
    },
    {
      field: "stationId",
      headerName: "Jig",
      sortable: false,
      width: 160,
    },
    {
      field: "monitorEsdId",
      headerName:"Monitor",
      sortable: false,
      width: 160,
    },
    {
      field: "isLocked",
      headerName: "Estação Ativa",
      sortable: false,
      width: 160,
    },
    {
      field: "description",
      headerName: t("ESD_TEST.TABLE.NAME", { appName: "App for Translations" }),
      width: 250,
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

  const rows = state.allProduces;
  console.log(rows)
  const MountProduceArray = async (userId)=> {
    // const result = await getStations(userId);
    // console.log(result.description)
    // return result.description;
  }


  return (
    <>
      <Menu></Menu>
      <Typography paragraph>
        <Container sx={{ mt: -20, ml: 22, width: 1200 }}>
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
            <ESDHomeModal
              open={state.open}
              handleClose={handleClose}
              produceName={state.produce.name}
              produce={state.produce}
            />
            <ESDHomeForm
              open={state.openModal}
              handleClose={handleCloseModal}
              onSubmit={handleCreateMonitor}
            />
            {/* <ESDEditForm
              open={state.openEditModal}
              handleClose={handleEditClose}
              onSubmit={handleEditCellChange}
              initialData={state.editData}
            /> */}
            {/* <ESDConfirmModal
              open={state.deleteConfirmOpen}
              handleClose={handleDeleteClose}
              handleConfirm={handleConfirmDelete}
              title={t("ESD_TEST.CONFIRM_DIALOG.DELETE_STATION", {
                appName: "App for Translations",
              })}
              description={t("ESD_TEST.CONFIRM_DIALOG.CONFIRM-TEXT", {
                appName: "App for Translations",
              })}
            /> */}
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

export default ESDHomeDashboardPage;
