import React, { useEffect, useState } from "react";
import { getAllBracelets, getBracelets } from "../../api/braceletApi";
import { Link } from "react-router-dom";
import { IconButton, Typography, Box, Paper } from "@mui/material";
import { Delete, Edit, Info } from "@mui/icons-material";
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
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const CustomToolbar = ({ onAdd }) => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter />
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <Button onClick={onAdd}>Adicionar Operador</Button>
  </GridToolbarContainer>
);

const BraceletModal = ({
  open,
  handleClose,
  braceletId,
  bracelet,
}) => (
  (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Bracelet {bracelet.title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            disabled
            required
            id="outlined-required"
            label="Required"
            defaultValue={braceletId}
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            disabled
            required
            id="outlined-required"
            label="Required"
            defaultValue={bracelet.title}
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            disabled
            required
            id="outlined-required"
            label="Required"
            defaultValue={bracelet.completed}
          />
        </Typography>
      </Paper>
    </Modal>
  )
);

const BasicTable = () => {
  const [allBracelets, setAllBracelets] = useState([]);
  const [bracelet, setBracelet] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBracelet, setSelectedBracelet] = useState(null);

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

  const handleOpen = (braceletId, bracelet) => {
    console.log("bracelet", bracelet);
    setBracelet(bracelet);
    setSelectedBracelet(braceletId);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "userId",
      headerName: "User ID",
      sortable: false,
      width: 160,
    },
    { field: "title", headerName: "Title", width: 250 },
    { field: "completed", headerName: "Completed", width: 250 },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      renderCell: (params) => (
        <Stack spacing={1} alignItems="right">
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
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <>
          {/* {console.log('params',params.row)} */}
          <IconButton
            edge="start"
            aria-label="info"
            onClick={() => handleOpen(params.row.id, params.row)}
          >
            <Info />
          </IconButton>
          <IconButton edge="start" aria-label="delete">
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
        ESD Bracelet List
      </Typography>
      <div style={{ height: 800, width: 1000 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: { onAdd: () => handleOpen(null) },
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 75, 100]}
          checkboxSelection
        />
      </div>
      <BraceletModal
        open={open}
        handleClose={handleClose}
        braceletId={selectedBracelet}
        braceletName={bracelet.title}
        bracelet={bracelet}
      />
    </Box>
  );
};

export default BasicTable;
