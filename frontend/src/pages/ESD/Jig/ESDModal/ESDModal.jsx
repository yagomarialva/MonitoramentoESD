import React from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./ESDModal.css";

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

const ESDModal = ({ open, handleClose, station }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Tooltip title={station.name} arrow>
          <Typography
            variant="h6"
            id="contained-modal-title-vcenter"
            gutterBottom
            className="textOverflow"
          >
            {station.name}
          </Typography>
        </Tooltip>
        <Box component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Tooltip title={station.description} arrow>
              <TextField
                fullWidth
                disabled
                required
                label={t("ESD_TEST.TABLE.USER_ID", {
                  appName: "App for Translations",
                })}
                defaultValue={station.description}
                margin="normal"
              />
            </Tooltip>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <Tooltip title={station.name} arrow>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={station.name}
              margin="normal"
            />
          </Tooltip>
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

export default ESDModal;
