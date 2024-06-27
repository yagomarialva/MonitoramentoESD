import React, { useState } from "react";

import { Typography, Box, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

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

const ESDForm = ({ open, handleClose, onSubmit }) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  // eslint-disable-next-line no-unused-vars
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const [station, setStation] = useState({
    userId: "",
    title: "",
    completed: false,
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="userId"
              name="userId"
              label={t("ESD_TEST.TABLE.USER_ID", {
                appName: "App for Translations",
              })}
              value={station.userId}
              defaultValue={station.userId}
              onChange={handleChange}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="title"
              name="title"
              label={t("ESD_TEST.TABLE.NAME", {
                appName: "App for Translations",
              })}
              value={station.title}
              defaultValue={station.title}
              onChange={handleChange}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="completed-label">Completed</InputLabel>
                <Select
                  labelId="completed-label"
                  id="completed"
                  name="completed"
                  label="completed"
                  value={station.completed}
                  onChange={handleChange}
                >
                  <MenuItem value={true}>True</MenuItem>
                  <MenuItem value={false}>False</MenuItem>
                </Select>
              </FormControl>
            </Typography>

          <Button type="submit" variant="contained" color="success">
          {t("ESD_TEST.DIALOG.SAVE", {
                appName: "App for Translations",
              })}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ESDForm;
