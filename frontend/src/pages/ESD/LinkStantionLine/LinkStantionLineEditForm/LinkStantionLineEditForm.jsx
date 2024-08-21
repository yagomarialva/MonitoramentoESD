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
  width: 450, // Adjusted for two columns
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const LinkStantionLineEditForm = ({
  open,
  handleClose,
  onSubmit,
  initialData = {}, // Ensure initialData has a default value
}) => {
  const { t } = useTranslation();

  // Safeguard against initialData being null or undefined
  const safeInitialData = initialData || {};

  const [link, setLink] = useState({
    id: safeInitialData.id || null,
    order: safeInitialData.order || 0,
    lineID: safeInitialData.lineID || 0,
    stationID: safeInitialData.stationID || 0,
  });

  const [errorName, setErrorName] = useState("");
  const [allLiners, setAllLiners] = useState([]);
  const [allStations, setAllStations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('initiral data', initialData)
      try {
        if (initialData) {
          setLink(initialData);
        }
        const lines = await getAllLines();
        if (!Array.isArray(lines)) throw new Error("Invalid lines data");
        const stations = await getAllStations();
        if (!Array.isArray(stations)) throw new Error("Invalid stations data");
        setAllLiners(lines);
        setAllStations(stations);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error accordingly (e.g., set an error state, show a message, etc.)
      }
    };
    fetchData();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLink((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('onsubmit', link)
      await onSubmit(link);
      handleClose();
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  const handleLineSelect = async (id) => {
    try {
      const selectedLine = await getLine(id);
      console.log("Selected line:", selectedLine);
    } catch (error) {
      console.error("Error fetching line details:", error);
    }
  };

  const handleStationSelect = async (id) => {
    try {
      const selectedStation = await getStation(id);
      console.log("Selected station:", selectedStation);
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
          {t("LINK_STATION_LINE.DIALOG.EDIT_LINK_STATION_LINE")}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="order"
            name="order"
            type="number"
            label="Order"
            value={link.order} // Added value binding to avoid uncontrolled input warning
            onChange={handleChange}
            error={!!errorName}
            helperText={errorName}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="lineID"> {t("LINK_STATION_LINE.TABLE.LINE")}</InputLabel>
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
              {allLiners.length > 0 ? (
                allLiners.map((line) => (
                  <MenuItem key={line.id} value={line.id}>
                    {line.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled> {t("LINK_STATION_LINE.CONFIRM_DIALOG.EMPTY")}</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="stationID"> {t("LINK_STATION_LINE.TABLE.STATION")}</InputLabel>
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
              {allStations.length > 0 ? (
                allStations.map((station) => (
                  <MenuItem key={station.id} value={station.id}>
                    {station.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No stations available</MenuItem>
              )}
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

export default LinkStantionLineEditForm;
