import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import ButtonBootstrap from "react-bootstrap/Button";

const LinkStantionLineConfirmModal = ({ open, handleClose, handleConfirm, title, content }) => {
    const modalStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {content}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonBootstrap style={{ marginTop: "10px", marginLeft: "4px" }}
              variant="outline-success" onClick={handleClose} sx={{ mr: 1 }}>Cancel</ButtonBootstrap>
          <ButtonBootstrap style={{ marginTop: "10px", marginLeft: "4px" }}
              variant="danger" onClick={handleConfirm} color="error">Delete</ButtonBootstrap>
        </Box>
      </Box>
    </Modal>
  );
};


export default LinkStantionLineConfirmModal;
