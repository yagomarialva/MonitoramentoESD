import React, { useState, useEffect } from "react";
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

const ESDEditForm = ({ open, handleClose, onSubmit, initialData }) => {
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

  const [bracelet, setBracelet] = useState({
    userId: "",
    title: "",
    completed: false,
  });

  useEffect(() => {
    if (initialData) {
      setBracelet(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBracelet((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(bracelet);
      handleClose();
    } catch (error) {
      console.error("Error creating or updating bracelet:", error);
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
          {t("ESD_TEST.DIALOG.EDIT_STATION", {
            appName: "App for Translations",
          })}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="outlined-userId"
            name="userId"
            label={t("ESD_TEST.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            value={bracelet.userId}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="outlined-title"
            name="title"
            label={t("ESD_TEST.TABLE.NAME", {
              appName: "App for Translations",
            })}
            value={bracelet.title}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="completed-label">Completed</InputLabel>
            <Select
              labelId="completed-label"
              id="completed"
              name="completed"
              label="completed"
              value={bracelet.completed}
              onChange={handleChange}
            >
              <MenuItem value={true}>True</MenuItem>
              <MenuItem value={false}>False</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="success"
              sx={{ mr: 2 }}
            >
              {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
            <Button type="submit" variant="contained" color="success">
              {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ESDEditForm;
