import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Button,
  Box,
  Switch,
  FormControlLabel,
  TextField,
} from "@mui/material";
import ESDHomeModal from "../ESDHomeModal/ESDHomeModal";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getAllStationMapper } from "../../../../api/mapingAPI";
import "./ESDTable.css";

// Função para obter a cor com base no status
const getStatusColor = (status) => {
  switch (status) {
    case "OK":
      return "green";
    case "FAIL":
      return "red";
    case "WARNING":
      return "orange";
    default:
      return "gray";
  }
};

// Componente principal
const ESDDashboardPage = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("map");
  const [searchText, setSearchText] = useState("");
  const [rowsTable, setRowsTable] = useState([]);
  const [columnsTable] = useState([
    { field: "id", headerName: "ID", width: 180 },
    { field: "serialNumber", headerName: "Monitor", width: 180 },
    { field: "linkStationAndLineId", headerName: "Link Station and Line ID", width: 180 },
    { field: "positionSequence", headerName: "Position Sequence", width: 180 },
    { field: "created", headerName: "Created", width: 180 },
    { field: "lastUpdated", headerName: "Last Updated", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: getStatusColor(params.value),
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationData = await getAllStationMapper();
        const allStations = stationData.flatMap(({ line, stations }) => 
          stations.flatMap(({ station, monitorsEsd }) => 
            monitorsEsd.map((monitor) => ({
              id: monitor.monitorsEsd.id,
              serialNumber: monitor.monitorsEsd.serialNumber,
              linkStationAndLineId: `${line.id}-${station.id}`,
              positionSequence: monitor.positionSequence,
              created: station.created,
              lastUpdated: station.lastUpdated,
              status: monitor.monitorsEsd.status,
            }))
          )
        );
        setRowsTable(allStations);
        
        const gridColumns = Array.from(
          new Set(stationData.flatMap(({ stations }) => 
            stations.flatMap(({ station }) => station.sizeX)
          ))
        );
        
        const gridRows = Array.from(
          new Set(stationData.flatMap(({ stations }) => 
            stations.flatMap(({ station }) => station.sizeY)
          ))
        );
        
        setColumns(gridColumns);
        setRows(gridRows);
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const getStatusTooltip = (indexColumn, indexRow) => {
    const station = rowsTable.find(
      (s) => s.positionSequence === indexRow && s.linkStationAndLineId === `${indexColumn}-${indexRow}`
    );
    return station
      ? `Estação: ${indexColumn}, Sequência: ${indexRow}, Status: ${station.status}`
      : `Estação: ${indexColumn}, Sequência: ${indexRow}, Status: 'Desconectado'`;
  };

  const getStatusClass = (indexColumn, indexRow) => {
    const station = rowsTable.find(
      (s) => s.positionSequence === indexRow && s.linkStationAndLineId === `${indexColumn}-${indexRow}`
    );
    return station ? (station.status === "OK" ? "ok" : "ng") : "";
  };

  const setMargin = (indexColumn) => {
    return indexColumn % 3 === 0 ? "mRight" : "";
  };

  // Filtrar os dados com base no texto de busca
  const filteredRows = rowsTable.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={viewMode === "map"}
              onChange={() => setViewMode(viewMode === "map" ? "grid" : "map")}
            />
          }
          label={viewMode === "map" ? "Exibir Grid" : "Exibir Mapa"}
        />
        {viewMode === "grid" && (
          <TextField
            variant="outlined"
            label="Buscar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Box>

      {viewMode === "map" ? (
        <div className="container">
          {columns.map((columnIndex) => (
            <div key={`column-${columnIndex}`}>
              {rows.map((rowIndex) => (
                <Tooltip
                  key={`tooltip-col${columnIndex}-row${rowIndex}`}
                  title={getStatusTooltip(columnIndex, rowIndex)}
                  placement="top"
                  arrow
                >
                  <p
                    onClick={handleClickOpen}
                    className={`box ${getStatusClass(
                      columnIndex,
                      rowIndex
                    )} ${setMargin(columnIndex)}`}
                    id={`col${columnIndex}-row${rowIndex}`}
                  >
                    <div className="icon-one-one"></div>
                  </p>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <Box className="grid-table">
          <DataGrid
            rows={filteredRows}
            columns={columnsTable}
            pageSize={10}
            rowsPerPageOptions={[10]}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      )}

      <ESDHomeModal open={open} handleClose={handleClose} />
    </>
  );
};

export default ESDDashboardPage;
