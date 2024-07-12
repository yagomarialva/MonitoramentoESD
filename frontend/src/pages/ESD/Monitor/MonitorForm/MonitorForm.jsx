import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  TextField,
  Button,
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

const MonitorForm = ({ open, handleClose, onSubmit }) => {
  const {
    t,
  } = useTranslation();

  const [station, setStation] = useState({
    serialNumber: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(station);
      handleClose();
    } catch (error) {
      console.error("Error creating bracelet:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("ESD_TEST.DIALOG.CREATE_STATION", {
            appName: "App for Translations",
          })}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="serialNumber"
            name="serialNumber"
            label={t("ESD_TEST.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="description"
            name="description"
            label={t("ESD_TEST.TABLE.NAME", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
          >
            {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
          </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default MonitorForm;
