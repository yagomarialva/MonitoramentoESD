import React, { useEffect, useState } from "react";
import { getAllBracelets, getBracelets, createBracelets } from "../../../api/braceletApi";
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
import ButtonBootstrap from "react-bootstrap/Button";
import ModalBootstrap from "react-bootstrap/Modal";
import AddIcon from '@mui/icons-material/Add';

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


const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter />
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <Button >Adicionar Operador</Button>
  </GridToolbarContainer>
);
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const BraceletModal = ({ open, handleClose, braceletId, bracelet }) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Paper sx={style}>
      <ModalBootstrap.Title id="contained-modal-title-vcenter">
        Bracelet {bracelet.title}
      </ModalBootstrap.Title>
      <ModalBootstrap.Body>
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
      </ModalBootstrap.Body>
      <ModalBootstrap.Footer>
        <ButtonBootstrap onClick={handleClose}>Close</ButtonBootstrap>
      </ModalBootstrap.Footer>
    </Paper>
  </Modal>
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

    const fetchDataCreateBracelet = async () => {
      try {
        const result = await createBracelets(bracelet.id);
        setBracelet(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchDataBracelet();
    fetchDataAllUsers();
    fetchDataCreateBracelet();
  }, [bracelet.id]);

  const handleOpen = (braceletId, bracelet) => {
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
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton edge="start" aria-label="delete">
            <AddIcon />
          </IconButton>
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
      <div style={{ height: 800, width: 950 }}>
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
