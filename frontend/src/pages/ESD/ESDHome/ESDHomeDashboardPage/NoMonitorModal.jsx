import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const NoMonitorModal = ({ message, onClose }) => {
  return (
    <Dialog open={Boolean(message)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>No Monitor</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoMonitorModal;
