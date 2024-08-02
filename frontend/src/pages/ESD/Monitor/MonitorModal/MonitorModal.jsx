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
import "./MonitorModal.css";

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

const MonitorModal = ({ open, handleClose, monitor }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Tooltip title={monitor.serialNumber} arrow>
        <Typography
          className="card-text"
          variant="h6"
          id="contained-modal-title-vcenter"
          gutterBottom
        >
            Monitor: {monitor.serialNumber}
        </Typography>
          </Tooltip>
        <Box component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.USER_ID", {
                appName: "App for Translations",
              })}
              defaultValue={monitor.serialNumber}
              margin="normal"
              InputProps={{
                className: "ellipsis",
              }}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={monitor.description}
              margin="normal"
              InputProps={{
                className: "ellipsis",
              }}
            />
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="success" onClick={handleClose}>
            {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default MonitorModal;
