import React from "react";
import { Typography, Paper } from "@mui/material";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBootstrap from "react-bootstrap/Button";
import ModalBootstrap from "react-bootstrap/Modal";
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

const ESDModal = ({ open, handleClose, bracelet }) => (
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
            label="UserId"
            defaultValue={bracelet.userId}
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            disabled
            required
            id="outlined-required"
            label="Title"
            defaultValue={bracelet.title}
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            disabled
            required
            id="outlined-required"
            label="Completed"
            defaultValue={bracelet.completed}
          />
        </Typography>
        {/* <ESDForm open={open} handleClose={handleClose} onSubmit={bracelet} ></ESDForm> */}
      </ModalBootstrap.Body>
      <ModalBootstrap.Footer>
        <ButtonBootstrap sx={{ mt: 2 }} onClick={handleClose}>
          Close
        </ButtonBootstrap>
      </ModalBootstrap.Footer>
    </Paper>
  </Modal>
);

export default ESDModal;
