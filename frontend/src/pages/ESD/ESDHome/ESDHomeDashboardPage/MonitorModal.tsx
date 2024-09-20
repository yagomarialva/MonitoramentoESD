import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";

interface Monitor {
  description?: string;
  lastDate?: string;
  status?: string;
  statusJig?: string;
  statusOperador?: string;
}

interface MonitorModalProps {
  monitor: Monitor | null;
  onClose: () => void;
}

const MonitorModal: React.FC<MonitorModalProps> = ({ monitor, onClose }) => {
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);

    // Formatting options
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return date.toLocaleString("pt-BR", options);
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
            defaultValue={monitor?.description ?? "N/A"}
            margin="normal"
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            disabled
            required
            label="Hora"
            defaultValue={formatDateTime(monitor?.lastDate)}
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
