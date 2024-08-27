import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  FormControl,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getAllLines, getLine } from "../../../../api/linerApi";
import { getAllStations, getStation } from "../../../../api/stationApi";
import {
  getAllMonitors,
  createMonitor,
  getMonitor,
  deleteMonitor,
  updateMonitor,
} from "../../../../api/monitorApi";
import { getAllLinks, getLink } from "../../../../api/linkStationLine";

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

const ESDHomeForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();
  const [allMonitors, setAllMonitors] = useState([]);
  const [allLinks, setAllLinks] = useState([]);
  const [mappedItem, setMappedItem] = useState({
    monitorEsdId: 0,
    linkStationAndLineId: 0
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMappedItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(mappedItem);
      handleClose();
    } catch (error) {
      console.error("Error creating bracelet:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lines = await getAllLines();
        const stations = await getAllStations();
        const result = await getAllMonitors();
        const links = await getAllLinks();
        console.log("monitors", links);
        setAllLinks(links);
        setAllMonitors(result);
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
    } catch (error) {
      console.error("Error fetching line details:", error);
    }
  };

  const handleMonitorSelect = async (id) => {
    try {
      const selectedLine = await getMonitor(id);
      // Atualize o estado se necessário com informações de `selectedLine`
    } catch (error) {
      console.error("Error fetching line details:", error);
    }
  };

  const handleLinkSelect = async (id) => {
    try {
      const selectedLine = await getLink(id);
      // const selectedMonitor = await getStation(id.stationID);
      // console.log("selectedMonitor", selectedMonitor);
      // Atualize o estado se necessário com informações de `selectedLine`
    } catch (error) {
      console.error("Error fetching line details:", error);
    }
  };

  const handleStationSelect = async (id) => {
    try {
      const selectedStation = await getStation(id);
      // Atualize o estado se necessário com informações de `selectedStation`
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
          {t("LINK_STATION_LINE.ADD_LINK_STATION_LINE", {
            appName: "App for Translations",
          })}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="monitorEsdId">
              Monitor ESD
            </InputLabel>
            <Select
              labelId="monitorEsdId"
              id="monitorEsdId"
              name="monitorEsdId"
              value={mappedItem.monitorEsdId}
              onChange={(e) => {
                handleChange(e);
                handleMonitorSelect(e.target.value);
              }}
              label="Monitor ESD"
            >
              {allMonitors.map((monitor) => (
                <MenuItem key={monitor.id} value={monitor.id}>
                  {monitor.serialNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="linkStationAndLineId">
              {" "}
              {t("LINK_STATION_LINE.TABLE.LINE", {
                appName: "App for Translations",
              })}
            </InputLabel>
            <Select
              labelId="linkStationAndLineId"
              id="linkStationAndLineId"
              name="linkStationAndLineId"
              value={mappedItem.linkStationAndLineId}
              onChange={(e) => {
                handleChange(e);
                handleLinkSelect(e.target.value);
              }}
              label="Ligação"
            >
              {allLinks.map((monitor) => (
                <MenuItem key={monitor.id} value={monitor.id}>
                  {monitor.id}
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
              {t("LINK_STATION_LINE.DIALOG.SAVE", {
                appName: "App for Translations",
              })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ESDHomeForm;
