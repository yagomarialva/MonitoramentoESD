import {
  Typography,
  Box,
  Paper,
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getAllLines, getLine } from "../../../../api/linerApi";
import { getAllStations, getStation } from "../../../../api/stationApi";

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

const LinkStantionLineForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();
  const [link, setLink] = useState({
    order: 0,
    lineID: 0,
    stationID: 0,
  });
  const [errorName, setErrorName] = useState("");
  const [allLiners, setAllLiners] = useState([]);
  const [allStations, setAllStations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLink((prev) => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(link);
      handleClose();
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lines = await getAllLines();
        const stations = await getAllStations();
        setAllLiners(lines);
        setAllStations(stations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLineSelect = async (id) => {
    try {
      const selectedLine = await getLine(id);
      // Atualize o estado se necessário com informações de `selectedLine`
      console.log("Line selecionado:", selectedLine);
    } catch (error) {
      console.error("Error fetching line details:", error);
    }
  };

  const handleStationSelect = async (id) => {
    try {
      const selectedStation = await getStation(id);
      // Atualize o estado se necessário com informações de `selectedStation`
      console.log("Station selecionado:", selectedStation);
    } catch (error) {
      console.error("Error fetching station details:", error);
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
          Adicionar Monitor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="order"
            name="order"
            type="number"  // Define o tipo como "number"
            label="Order"
            onChange={handleChange}
            error={!!errorName}
            helperText={errorName}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="lineID">Line</InputLabel>
            <Select
              labelId="lineID"
              id="lineID"
              name="lineID"
              value={link.lineID}
              onChange={(e) => {
                handleChange(e);
                handleLineSelect(e.target.value);
              }}
              label="Line"
            >
              {allLiners.map((line) => (
                <MenuItem key={line.id} value={line.id}>
                  {line.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="stationID">Station</InputLabel>
            <Select
              labelId="stationID"
              id="stationID"
              name="stationID"
              value={link.stationID}
              onChange={(e) => {
                handleChange(e);
                handleStationSelect(e.target.value);
              }}
              label="Station"
            >
              {allStations.map((station) => (
                <MenuItem key={station.id} value={station.id}>
                  {station.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
            >
              {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default LinkStantionLineForm;
