import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllLinks,
  createLink,
  deleteLink,
  updateLink,
} from "../../../../api/linkStationLine";
import {
  IconButton,
  Box,
  Snackbar,
  Alert,
  Button,
  TextField,
  Container,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete, Info, Edit as EditIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
// import LinkModal from "../LinkModal/LinkModal";
import LinkForm from "../LinkStantionLineForm/LinkStantionLineForm";
// import LinkConfirmModal from "../LinkConfirmModal/LinkConfirmModal";
// import LinkEditForm from "../LinkEditForm/LinkEditForm";
import { useNavigate } from "react-router-dom";
import "./LinkTable.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import LinkStantionLineConfirmModal from "../LinkStantionLineConfirmModal/LinkStantionLineConfirmModal";
import LinkStantionLineModal from "../LinkStantionLineModal/LinkStantionLineModal";
import LinkStantionLineEditForm from "../LinkStantionLineEditForm/LinkStantionLineEditForm";

function dataTableFormater(result) {
  return result.map((item) => ({
    id: item.id,
    lineID: item.line?.name || "N/A",
    stationID: item.station?.name || "N/A",
    order: item.order || "N/A",
    // created: item.created ? new Date(item.created).toLocaleDateString() : "N/A",
    // lastUpdated: item.lastUpdated
    //   ? new Date(item.lastUpdated).toLocaleDateString()
    //   : "N/A",
    // sizeX: item.station?.sizeX || "N/A",
    // sizeY: item.station?.sizeY || "N/A",
  }));
}

const LinkStantionLine = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    allLinks: [],
    link: null, // Iniciar com null
    open: false,
    openModal: false,
    openEditModal: false,
    editData: null,
    deleteConfirmOpen: false,
    linkToDelete: null,
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

  const handleOpen = (link) => {
    if (!link) {
      console.error("Link is undefined:", link);
      return;
    }
    handleStateChange({ link, open: true });
  };

  const handleClose = () => handleStateChange({ open: false });

  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });

  const handleOpenModal = () => handleStateChange({ openModal: true });

  const handleCloseModal = () => handleStateChange({ openModal: false });

  const handleDeleteOpen = (link) =>
    handleStateChange({
      link,
      linkToDelete: link,
      deleteConfirmOpen: true,
    });

  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, linkToDelete: null });

  const handleEditOpen = async (link) => {
    console.log('link on line', link)
    const result = await getAllLinks();
    const formattedLinks = dataTableFormater(result);
    handleStateChange({
      editData: link,
      openEditModal: true,
      allLinks: formattedLinks,
    });
  };

  const handleCreateLink = async (link) => {
    try {
      await createLink(link);

      const result = await getAllLinks();
      const formattedLinks = dataTableFormater(result);

      handleStateChange({ allLinks: formattedLinks });

      showSnackbar(
        t("ESD_MONITOR.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(error.response.data, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLink(id);
      handleStateChange({
        allLinks: state.allLinks.filter((link) => link.id !== id),
      });
      showSnackbar(
        t("ESD_MONITOR.TOAST.DELETE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(
        t("ESD_MONITOR.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      console.log('params', params)
      await updateLink(params);
      const result = await getAllLinks();
      const formattedLinks = dataTableFormater(result);
      handleStateChange({ allLinks: formattedLinks });
      showSnackbar(
        t("ESD_MONITOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      const errorMessage = error.response?.data?.title || "An unexpected error occurred";
      showSnackbar(errorMessage, "error");
    }
  };

  useEffect(() => {
    const fetchDataAllLinks = async () => {
      try {
        console.log('editData',state.editData)
        const result = await getAllLinks();
        console.log("Fetched links:", result);
        const formattedLinks = dataTableFormater(result);
        setState((prevState) => ({ ...prevState, allLinks: formattedLinks }));
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
        console.error("Error fetching links:", error.message);
      }
    };

    fetchDataAllLinks();
  }, []);

  const handleConfirmDelete = async () => {
    await handleDelete(state.linkToDelete.id);
    if (state.linkToDelete) {
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
  const columns = [
    { field: "id", headerName: "ID", width: 50, cellClassName: "grid-cell" },
    {
      field: "lineID",
      headerName: "Linha",
      width: 150,
      cellClassName: "grid-cell",
    },
    {
      field: "stationID",
      headerName: "Estação",
      width: 250,
      cellClassName: "grid-cell",
    },
    // {
    //   field: "sizeX",
    //   headerName: "Tamanho X",
    //   width: 100,
    //   cellClassName: "grid-cell",
    // }, // Nova coluna
    // {
    //   field: "sizeY",
    //   headerName: "Tamanho Y",
    //   width: 100,
    //   cellClassName: "grid-cell",
    // }, // Nova coluna
    // {
    //   field: "created",
    //   headerName: "Criado em",
    //   width: 150,
    //   cellClassName: "grid-cell",
    // },
    // {
    //   field: "lastUpdated",
    //   headerName: "Atualizado em",
    //   width: 150,
    //   cellClassName: "grid-cell",
    // },
    {
      field: "order",
      headerName: "Ordem",
      width: 100,
      cellClassName: "grid-cell",
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 250,
      headerAlign: "center",
      sortable: false,
      cellClassName: "grid-cell",
      renderCell: (params) => (
        <div className="actions-content">
          <Tooltip title="Editar">
            <IconButton
              onClick={() => handleEditOpen(params.row)}
              edge="end"
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Informações">
            <IconButton
              onClick={() => handleOpen(params.row)}
              edge="end"
              aria-label="info"
            >
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              onClick={() => handleDeleteOpen(params.row)}
              edge="end"
              aria-label="delete"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <Typography paragraph>
        <Container>
          <Box className="filters-container">
            <TextField
              name="filterSerialNumber"
              label={t("ESD_MONITOR.TABLE.USER_ID")}
              variant="outlined"
              value={state.filterSerialNumber}
              onChange={handleFilterChange}
              sx={{ mr: 2 }}
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
              label={t("ESD_MONITOR.TABLE.NAME")}
              variant="outlined"
              value={state.filterDescription}
              onChange={handleFilterChange}
              sx={{ mr: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              id="add-button"
              variant="contained"
              color="success"
              onClick={handleOpenModal}
              sx={{ marginLeft: "auto" }}
            >
              {t("ESD_MONITOR.ADD_MONITOR")}
            </Button>
          </Box>
          <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={state.allLinks}
              columns={columns}
              pageSize={state.rowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={(newSize) =>
                handleStateChange({ rowsPerPage: newSize })
              }
              onPageChange={handleChangePage}
              pagination
            />
          </div>
          {/* <LinkStantionLineModal
            open={state.openEditModal}
            handleClose={handleClose}
            link={state.editData}
            isEdit

          /> */}
          <LinkForm
            open={state.openModal}
            handleClose={handleCloseModal}
            onSubmit={handleCreateLink}
          />
          <LinkStantionLineEditForm
            open={state.openEditModal}
            handleClose={handleEditClose}
            onSubmit={handleEditCellChange}
            initialData={state.editData}
          />
          <LinkStantionLineModal
            open={state.open}
            handleClose={handleClose}
            link={state.link} // Passar link para o modal
          />
          <LinkStantionLineConfirmModal
            open={state.deleteConfirmOpen}
            handleClose={handleDeleteClose}
            handleConfirm={handleConfirmDelete}
            title={t("ESD_MONITOR.CONFIRM_DIALOG.DELETE_MONITOR")}
            description={'test'}
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
      </Typography>
    </>
  );
};

export default LinkStantionLine;
