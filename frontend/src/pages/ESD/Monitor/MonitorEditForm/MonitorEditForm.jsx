import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";


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

const MonitorEditForm = ({ open, handleClose, onSubmit, initialData }) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const [monitor, setMonitor] = useState({
    id: "",
    description: "",
    serialNumber: "",
    status: "",
  });

  useEffect(() => {
    if (initialData) {
      setMonitor(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMonitor((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(monitor);
      handleClose();
    } catch (error) {
      console.error("Error creating or updating monitor:", error);
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
          {t("ESD_MONITOR.ADD_MONITOR", {
            appName: "App for Translations",
          })}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="outlined-title"
            name="serialNumber"
            label={t("ESD_MONITOR.TABLE.NAME", {
              appName: "App for Translations",
            })}
            value={monitor.serialNumber}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="outlined-description"
            name="description"
            label={t("ESD_MONITOR.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            value={monitor.description}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="status">Status</InputLabel>
            <Select
              labelId="status"
              id="status"
              name="status"
              value={monitor.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="success"
              sx={{ mr: 2 }}
            >
              {t("ESD_MONITOR.DIALOG.CLOSE", {
                appName: "App for Translations",
              })}
            </Button>
            <Button type="submit" variant="contained" color="success">
              {t("ESD_MONITOR.DIALOG.SAVE", {
                appName: "App for Translations",
              })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default MonitorEditForm;
