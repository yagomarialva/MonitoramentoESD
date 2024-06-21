import React, { useEffect, useState } from "react";
import { getAllBracelets, getBracelets } from "../../api/braceletApi";
import { Link } from "react-router-dom";
import { IconButton, Typography, Box, Paper } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
//   border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BasicTable = () => {
  const [allBracelets, setAllBracelets] = useState([]);
  const [bracelet, setBracelet] = useState([]);
  console.log("allBracelets", allBracelets);
  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllBracelets();
        console.log("result all", result);
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
  }, []);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <Button onClick={handleOpen}>Adicionar Operador</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>{/* <Operator></Operator> */}</Box>
        </Modal>
      </GridToolbarContainer>
    );
  }

  function ModalBracelet() {
    return (
    <>
    {/* <Button onClick={handleOpen}>Open modal</Button> */}
    <IconButton
              component={Link}
              edge="start"
              aria-label="edit"
              onClick={handleOpen}
            //   onClick={(e) => ModalBracelet(row.id)}
            >
              <Edit />
            </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Paper>
      </Modal>
    </>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "userId",
      headerName: "userId",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    { field: "title", headerName: "Title", width: 250 },
    { field: "completed", headerName: "Completed", width: 250 },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      renderCell: () => {
        return (
          <div>
            <Stack spacing={1} alignItems="right">
              <Stack class="status-chip" direction="row" spacing={1}>
                <Chip label="Ativo" color="success" />
              </Stack>
            </Stack>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (row) => {
        return (
          <div>
            {/* <IconButton
              component={Link}
              edge="start"
              aria-label="edit"
              onClick={handleOpen}
            //   onClick={(e) => ModalBracelet(row.id)}
            >
              <Edit />
            </IconButton> */}
            <ModalBracelet/>
            <IconButton edge="start" aria-label="delete">
              <Delete />
            </IconButton>
          </div>
        );
      },
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
          checkboxSelection
        />
      </div>
    </Box>
  );
};

export default BasicTable;
