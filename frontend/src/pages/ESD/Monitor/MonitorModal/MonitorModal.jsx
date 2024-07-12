import React from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const {
    t,
  } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Typography
          variant="h6"
          id="contained-modal-title-vcenter"
          gutterBottom
        >
          Monitor: {monitor.serialNumber}
        </Typography>
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
