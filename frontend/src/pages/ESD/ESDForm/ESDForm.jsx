import React, { useState } from "react";

import { Typography, Box, Paper } from "@mui/material";

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

const ESDForm = ({ open, handleClose, onSubmit }) => {
  const [station, setStation] = useState({
    userId: "",
    title: "",
    completed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(station);
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="userId"
              name="userId"
              label="User ID"
              value={station.userId}
              defaultValue={station.userId}
              onChange={handleChange}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="title"
              name="title"
              label="Title"
              value={station.title}
              defaultValue={station.title}
              onChange={handleChange}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="completed"
              name="completed"
              label="completed"
              value={station.completed}
              defaultValue={station.completed}
              onChange={handleChange}
            />
          </Typography>

          <Button type="submit" variant="contained" color="success">
            Submit
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ESDForm;
