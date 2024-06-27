import React, { useEffect, useState } from "react";
import {
  getAllBracelets,
  getBracelets,
  createBracelets,
  deleteBracelets,
  updateBracelets,
} from "../../../api/braceletApi";
import { IconButton, Typography, Box } from "@mui/material";
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

const StationTable = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  // eslint-disable-next-line no-unused-vars
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };
  const [allBracelets, setAllBracelets] = useState([]);
  const [bracelet, setBracelet] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  const [editCell, setEditCell] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [editValue, setEditValue] = useState("");
  const [editData, setEditData] = useState(null);

  const handleOpen = (bracelet) => {
    setBracelet(bracelet);
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditModal(false);
    setEditData(null);
  };

  const handleEditOpen = (data) => {
    setEditData(data);
    setEditModal(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    try {
      setOpenModal(false);
    } catch (e) {
      console.log(e);
    }
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCreateBracelet = async (bracelet) => {
    const newBracelet = { ...bracelet, id: Date.now() };
    const response = await createBracelets(newBracelet);
    setAllBracelets((prev) => [...prev, newBracelet]);
    return response.data;
  };

  const handleDelete = async (id) => {
    try {
      await deleteBracelets(id);
      setAllBracelets(allBracelets.filter((bracelet) => bracelet.id !== id));
    } catch (e) {
      console.log(e);
    }
  };
  const handleEditCellChange = async (params) => {
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
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllBracelets();
        console.log("result", result);
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

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector GridLocaleText={{}} />
      <Button onClick={() => handleOpenModal()}>
        {" "}
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
            aria-label="delete"
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
            onClick={() => handleDelete(params.row.id)}
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
      <div style={{ height: 800, width: 950 }}>
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
      ></ESDEditForm>
    </Box>
  );
};

export default StationTable;
