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
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import LinkStantionLineConfirmModal from "../LinkStantionLineConfirmModal/LinkStantionLineConfirmModal";
import LinkStantionLineModal from "../LinkStantionLineModal/LinkStantionLineModal";
import LinkStantionLineEditForm from "../LinkStantionLineEditForm/LinkStantionLineEditForm";
import LinkForm from "../LinkStantionLineForm/LinkStantionLineForm";
import { useNavigate } from "react-router-dom";
import "./LinkTable.css";

const LinkStantionLine = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    allLinks: [],
    link: null,
    open: false,
    openModal: false,
    openEditModal: false,
    editData: null,
    deleteConfirmOpen: false,
    linkToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    loading: true, // Adicionei esta linha
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchLine, setSearchLine] = useState("");
  const [searchStation, setSearchStation] = useState("");

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
    console.log("link on line", link);
    const result = await getAllLinks();
    handleStateChange({ editData: link, openEditModal: true });
  };

  const handleCreateLink = async (link) => {
    try {
      await createLink(link);

      const result = await getAllLinks();

      handleStateChange({ allLinks: result });

      showSnackbar(
        t("LINK_STATION_LINE.TOAST.CREATE_SUCCESS", {
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
        t("LINK_STATION_LINE.TOAST.DELETE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showSnackbar(
        t("LINK_STATION_LINE.TOAST.TOAST_ERROR", {
          appName: "App for Translations",
        }),
        "error"
      );
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      console.log("params", params);
      await updateLink(params);
      const result = await getAllLinks();
      // const formattedLinks = dataTableFormater(result);
      handleStateChange({ allLinks: result });
      showSnackbar(
        t("LINK_STATION_LINE.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.title || "An unexpected error occurred";
      showSnackbar(errorMessage, "error");
    }
  };

  useEffect(() => {
    const fetchDataAllLinks = async () => {
      try {
        const result = await getAllLinks();
        handleStateChange({ allLinks: result });
        // setState((prevState) => ({ ...prevState, allLinks: result }));
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchLineChange = (event) => {
    setSearchLine(event.target.value);
  };

  const handleSearchStationChange = (event) => {
    setSearchStation(event.target.value);
  };

  const filteredLinks = () => {
    const links = state.allLinks ?? []; // Verifique se `allLinks` não é nulo ou indefinido
    console.log('links',links.length)
    return links.filter((link) => {
      // Certifique-se de que `lineID` e `stationID` são strings antes de usar `toLowerCase`
      const lineID =
        typeof link.line.name === "string" ? link.line.name.toLowerCase() : "";
      const stationID =
        typeof link.station.name === "string" ? link.station.name.toLowerCase() : "";

      return (
        lineID.includes(searchLine.toLowerCase()) &&
        stationID.includes(searchStation.toLowerCase())
      );
    });
  };

  const displayLink = filteredLinks().slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Typography paragraph>
        <Container>
          <Box className="filters-container">
            <TextField
              name="filterLine"
              label={t("LINK_STATION_LINE.TABLE.LINE")}
              variant="outlined"
              value={state.filterLine}
              onChange={handleSearchLineChange}
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
              label={t("LINK_STATION_LINE.TABLE.STATION")}
              variant="outlined"
              value={state.filterStation}
              onChange={handleSearchStationChange}
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
              {t("LINK_STATION_LINE.ADD_LINK_STATION_LINE")}
            </Button>
          </Box>

          {displayLink.length === 0 ? (
            <Typography variant="h6" align="center" color="textSecondary">
              Sua lista está vazia
            </Typography>
          ) : (
            <List>
              {displayLink.map((link) => (
                <ListItem
                  key={link.id}
                  divider
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Tooltip title={`Id: ${link.line.name}`} arrow>
                    <ListItemText
                      primary={`Linha: ${link.line.name}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {`Estação: ${link.station.name}`}
                          </Typography>
                        </>
                      }
                      className="textOverflow"
                    />
                  </Tooltip>
                  <ListItemSecondaryAction>
                    <Tooltip title={t("STATION.EDIT_STATION")}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditOpen(link)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("STATION.INFO_STATION")}>
                      <IconButton
                        edge="end"
                        aria-label="info"
                        onClick={() => handleOpen(link)}
                      >
                        <Info />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("STATION.DELETE_STATION")}>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteOpen(link)}
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
            count={filteredLinks().length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 75, 100]}
          />
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
            link={state.link}
          />
          <LinkStantionLineConfirmModal
            open={state.deleteConfirmOpen}
            handleClose={handleDeleteClose}
            handleConfirm={handleConfirmDelete}
            title={t(
              "LINK_STATION_LINE.CONFIRM_DIALOG.DELETE_LINK_STATION_LINE",
              {
                appName: "App for Translations",
              }
            )}
            content={t("LINK_STATION_LINE.CONFIRM_DIALOG.CONFIRM-TEXT", {
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
      </Typography>
    </>
  );
};

export default LinkStantionLine;
