import React from "react";
import {
  Paper,
  Modal,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

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

const MonitorModal = ({ monitor, onClose }) => {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Opções de formatação
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    return date.toLocaleString('pt-BR', options);
};

  return (
    <Dialog open={Boolean(monitor)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Monitor Details</DialogTitle>
      <DialogContent>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            disabled
            required
            label="Descrição"
            defaultValue={monitor.description ?? "N/A"}
            margin="normal"
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            disabled
            required
            label="Hora"
            defaultValue={ formatDateTime(monitor.lastDate) ?? "N/A"}
            margin="normal"
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            disabled
            required
            label="Operador"
            defaultValue={monitor?.status ?? "N/A"}
            margin="normal"
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            disabled
            required
            label="Logs"
            defaultValue={monitor?.statusJig ?? "N/A"}
            margin="normal"
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            disabled
            required
            label="Logs"
            defaultValue={monitor?.statusOperador ?? "N/A"}
            margin="normal"
          />
        </Typography>
        {/* <Typography variant="h6">Serial Number: {monitor.serialNumber}</Typography>
        <Typography variant="body1">Status: {monitor.status}</Typography>
        <Typography variant="body1">Description: {monitor.description}</Typography>
        <Typography variant="body1">Last Date: {monitor.lastDate}</Typography>
        <Typography variant="body1">Date Hour: {monitor.dateHour}</Typography>
        <Typography variant="body1">Status Operador: {monitor.statusOperador}</Typography>
        <Typography variant="body1">Status Jig: {monitor.statusJig}</Typography>
        <Typography variant="body1">UNM: {monitor.unm}</Typography> */}
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
