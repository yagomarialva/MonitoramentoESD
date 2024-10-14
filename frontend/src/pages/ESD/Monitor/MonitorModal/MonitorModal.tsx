import React from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Tooltip,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface MonitorDetails {
  serialNumber: string;
  description: string;
  status: string;
  statusJig: string;
  statusOperador: string;
}

interface MonitorModalProps {
  open: boolean;
  handleClose: () => void;
  monitor: MonitorDetails;
}

const modalStyle = {
  position: "absolute" as const, // 'as const' para manter o valor literal
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const MonitorModal: React.FC<MonitorModalProps> = ({
  open,
  handleClose,
  monitor,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper sx={modalStyle}>
        <Tooltip title={monitor.serialNumber} arrow>
          <Typography
            variant="h6"
            id="modal-title"
            gutterBottom
            className="ellipsis-text"
            sx={{ width: "100%", overflow: "hidden" }}
          >
            Monitor: {monitor.serialNumber}
          </Typography>
        </Tooltip>
        <Box component="form" noValidate autoComplete="off">
          <Tooltip title={monitor.serialNumber} arrow>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.USER_ID")}
              defaultValue={monitor.serialNumber}
              margin="normal"
              InputProps={{
                sx: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Tooltip>
          <Tooltip title={monitor.description} arrow>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.NAME")}
              defaultValue={monitor.description}
              margin="normal"
              InputProps={{
                sx: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Tooltip>
          <Tooltip title={monitor.status} arrow>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_MONITOR.STATUS_MONITOR")}
              defaultValue={monitor.status}
              margin="normal"
              InputProps={{
                sx: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Tooltip>
          <Tooltip title={monitor.statusJig} arrow>
            <TextField
              fullWidth
              disabled
              required
              label="Status do Jig"
              defaultValue={monitor.statusJig}
              margin="normal"
              InputProps={{
                sx: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Tooltip>
          <Tooltip title={monitor.statusOperador} arrow>
            <TextField
              fullWidth
              disabled
              required
              label="Status do Operador"
              defaultValue={monitor.statusOperador}
              margin="normal"
              InputProps={{
                sx: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Tooltip>
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="success" onClick={handleClose}>
            {t("ESD_TEST.DIALOG.CLOSE")}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default MonitorModal;
