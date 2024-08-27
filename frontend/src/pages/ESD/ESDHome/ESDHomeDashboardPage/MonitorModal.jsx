import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const MonitorModal = ({ monitor, onClose }) => {
  return (
    <Dialog open={Boolean(monitor)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Monitor Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Serial Number: {monitor.serialNumber}</Typography>
        <Typography variant="body1">Status: {monitor.status}</Typography>
        <Typography variant="body1">Description: {monitor.description}</Typography>
        <Typography variant="body1">Last Date: {monitor.lastDate}</Typography>
        <Typography variant="body1">Date Hour: {monitor.dateHour}</Typography>
        <Typography variant="body1">Status Operador: {monitor.statusOperador}</Typography>
        <Typography variant="body1">Status Jig: {monitor.statusJig}</Typography>
        <Typography variant="body1">UNM: {monitor.unm}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonitorModal;
