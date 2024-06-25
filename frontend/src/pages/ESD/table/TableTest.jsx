import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IconButton, Typography, Box, Paper } from "@mui/material";
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
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const REACT_APP_API_MOCKED_URL = "https://jsonplaceholder.typicode.com";

const createBracelets = async (bracelet) => {
  const response = await axios.post(`${REACT_APP_API_MOCKED_URL}/todos`, bracelet);
  return response.data;
};

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

const modalStyle = {
  backgroundColor: "transparent",
};

const CustomToolbar = ({ onAdd }) => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter />
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <Button onClick={onAdd}>Adicionar Operador</Button>
  </GridToolbarContainer>
);

const BraceletForm = ({ open, handleClose, onSubmit }) => {
  const [bracelet, setBracelet] = useState({
    userId: "",
    title: "",
    completed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBracelet((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(bracelet);
      handleClose();
    } catch (error) {
      console.error("Error creating bracelet:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create Bracelet
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="userId"
            name="userId"
            label="User ID"
            value={bracelet.userId}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="title"
            name="title"
            label="Title"
            value={bracelet.title}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="completed"
            name="completed"
            label="Completed"
            value={bracelet.completed}
            onChange={handleChange}
            type="checkbox"
            checked={bracelet.completed}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

const BasicTable = () => {
  const [allBracelets, setAllBracelets] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBracelet, setSelectedBracelet] = useState(null);

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_MOCKED_URL}/todos`);
        setAllBracelets(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAllUsers();
  }, []);

  const handleOpen = () => {
    setSelectedBracelet(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCreateBracelet = async (bracelet) => {
    const newBracelet = await createBracelets(bracelet);
    setAllBracelets((prev) => [...prev, newBracelet]);
  };

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
            <Chip label={params.value ? "Completed" : "Pending"} color={params.value ? "success" : "warning"} />
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
          <IconButton edge="start" aria-label="info" onClick={() => handleOpen(params.row.id)}>
            <Info />
          </IconButton>
          <IconButton edge="start" aria-label="delete">
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = allBracelets.map((bracelet) => ({
    ...bracelet,
    status: bracelet.completed,
  }));

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
            toolbar: { onAdd: handleOpen },
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
      <BraceletForm open={open} handleClose={handleClose} onSubmit={handleCreateBracelet} />
    </Box>
  );
};

export default BasicTable;
