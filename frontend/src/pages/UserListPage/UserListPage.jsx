import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getAllUsers } from "../../api/userApi";
import { Link } from "react-router-dom";
import { IconButton, Typography, Box } from "@mui/material";
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
import Operator from "../Operator/Operator";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUsers();
        setUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllUsers();
        console.log("result", result);
        setAllUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchDataAllUsers();
    fetchData();
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
          <Box sx={style}>
                <Operator></Operator>
          </Box>
        </Modal>
      </GridToolbarContainer>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "Image",
      headerName: "Image",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.name || ""} ${row.badge || ""}`,
    },
    { field: "name", headerName: "Name", width: 250 },
    { field: "badge", headerName: "Badge", width: 250 },
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
      renderCell: () => {
        return (
          <div>
            <IconButton component={Link} edge="start" aria-label="edit">
              <Edit />
            </IconButton>
            <IconButton edge="start" aria-label="delete">
              <Delete />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const rows = allUsers;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User List
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

export default UserListPage;
