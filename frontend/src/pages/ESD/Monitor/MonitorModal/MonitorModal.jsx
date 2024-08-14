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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const MonitorModal = ({ open, handleClose, monitor }) => {
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
            className="ellipsis-text" // Adiciona a classe CSS
            sx={{ width: "100%", overflow: "hidden" }} // Adiciona um estilo adicional se necessário
          >
            Monitor: {monitor.serialNumber}
          </Typography>
        </Tooltip>
        <Box component="form" noValidate autoComplete="off">
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
