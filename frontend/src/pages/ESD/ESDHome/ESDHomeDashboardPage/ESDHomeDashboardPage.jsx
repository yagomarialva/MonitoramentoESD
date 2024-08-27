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
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputAdornment from "@mui/material/InputAdornment";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import {
  getAllStationMapper,
  getStationMapper,
} from "../../../../api/mapingAPI";
import Grid from "@mui/material/Unstable_Grid2";

import "./ESDTable.css";
import ESDTableView from "./ESDTableView";
import StationMap from "./StationMap";
async function monitorPicker(data) {
  return await Promise.all(
    data.map(async (item) => {
      const monitorData = await getStationMapper(item.monitorEsdId);
      return {
        ...item,
        serialNumber: monitorData.serialNumber,
      };
    })
  );
}

function groupLines() {
  return (data) => {
    const lineGroups = {};

    data.forEach((item) => {
      const lineId = item.line.id;
      if (!lineGroups[lineId]) {
        lineGroups[lineId] = [];
      }
      lineGroups[lineId].push(item);
    });

    return lineGroups;
  };
}

const groupStationsByLine = (data) => {
  // Cria um objeto para armazenar as linhas e suas estações
  const grouped = data.reduce((acc, entry) => {
    const lineId = entry.line.id;

    // Se a linha ainda não estiver no acumulador, cria uma nova entrada
    if (!acc[lineId]) {
      acc[lineId] = { line: entry.line, stations: [] };
    }

    // Processa as estações para cada linha
    entry.stations.forEach((stationItem) => {
      const existingStationIndex = acc[lineId].stations.findIndex(
        (s) => s.station.id === stationItem.station.id
      );

      // Se a estação não estiver no acumulador, adiciona-a
      if (existingStationIndex === -1) {
        acc[lineId].stations.push({
          ...stationItem,
          monitorsESD: stationItem.monitorsESD || [],
        });
      } else {
        // Se a estação já estiver no acumulador, combina os monitores
        const existingStation = acc[lineId].stations[existingStationIndex];

        // Utiliza um mapa para evitar duplicação de monitores com base no ID
        const existingMonitorsMap = new Map(
          existingStation.monitorsESD.map((m) => [m.id, m])
        );

        // Adiciona novos monitores ao mapa
        (stationItem.monitorsESD || []).forEach((monitor) => {
          existingMonitorsMap.set(monitor.id, monitor);
        });

        // Atualiza a estação com os monitores combinados
        acc[lineId].stations[existingStationIndex] = {
          ...existingStation,
          monitorsESD: Array.from(existingMonitorsMap.values()),
        };
      }
    });

    return acc;
  }, {});

  // Converte o objeto para um array de valores
  return Object.values(grouped);
};

// Função para obter a cor com base no status
const getStatusColor = (status) => {
  switch (status) {
    case "ok":
      return "green";
    case "error":
      return "red";
    case "warning":
      return "orange";
    default:
      return "gray";
  }
};

// Função para determinar a classe CSS com base no status
const getStatusClass = (status) => {
  return status === "ok" ? "ok" : status === "error" ? "ng" : "warning";
};

const ESDDashboardPage = () => {
  const [groupedStations, setGroupedStations] = useState([]);
  const navigate = useNavigate();
  const handleStationsUpdate = (updatedStations) => {
    setGroupedStations(updatedStations);
  };

  const [group, setGroup] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]); // Inicialmente vazio

  // Table states
  const [openTable, setOpenTable] = useState(false);
  const [columnsTable, setColumnsTable] = useState([
    { field: "id", headerName: "ID", width: 180 },
    { field: "serialNumber", headerName: "Monitor", width: 180 },
    {
      field: "linkStationAndLineId",
      headerName: "Link Station and Line ID",
      width: 180,
    },
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
  const [rowsTable, setRowsTable] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("map"); // Estado para alternar entre visualizações
  const [searchText, setSearchText] = useState(""); // Estado para o texto de busca

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        setRows([]);
        setColumns([]);
        const result = await getAllStationMapper();
        const toMount = await getAllStationMapper();
        const mounted = groupStationsByLine(toMount);
        setGroupedStations(mounted)
        mounted.map((item) => {
          item.stations.forEach((station) => {
            for (let index = 1; index < station.station.sizeX; index++) {
              console.log('indexX', index)
              setRows([...rows, rows.length + 1]);
            }
            for (let index = 1; index < station.station.sizeY; index++) {
              console.log('indexY', index)
              setColumns([...columns, columns.length + 1]);
              
            }
            console.log("=================================");
            console.log("sizeX", station.station.sizeX);
            console.log("sizeY", station.station.sizeY);
            console.log("rows", rows);
            console.log("columuns", columns);
          });
        });
        // Função para agrupar linhas por ID
        const groupLinesById = groupLines();
        const groupedItens = groupStationsByLine(result);
        // Agrupa as linhas
        const groupedLines = groupLinesById(result);
        // Atualiza o estado rows com a quantidade de itens em cada grupo
        // setRows(Object.values(groupedLines).map((group) => group.length));
        setGroup(groupedItens);
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };
    fetchDataAllUsers();
  }, [navigate]);

  const [status] = useState([
    { indexColumn: 0, indexRow: 0, status: "ok" },
    { indexColumn: 1, indexRow: 0, status: "error" },
    { indexColumn: 2, indexRow: 2, status: "ok" },
    { indexColumn: 3, indexRow: 1, status: "ok" },
    { indexColumn: 3, indexRow: 6, status: "ok" },
    { indexColumn: 4, indexRow: 0, status: "ok" },
  ]);

  const getStatusTooltip = (indexColumn, indexRow) => {
    const item = status.find(
      (s) => s.indexColumn === indexColumn && s.indexRow === indexRow
    );
    return item
      ? `Coluna: ${indexColumn}, Linha:  ${indexRow}  Status: ${item.status}`
      : `Coluna: ${indexColumn}, Linha:  ${indexRow}  Status: 'Desconectado'`;
  };

  const getStatusClass = (indexColumn, indexRow) => {
    const item = status.find(
      (s) => s.indexColumn === indexColumn && s.indexRow === indexRow
    );
    return item ? (item.status === "ok" ? "ok" : "ng") : "";
  };

  const setMargin = (indexColumn) => {
    return indexColumn % 3 === 0 ? "mRight" : "";
  };

  const addColumn = () => {
    setColumns([...columns, columns.length + 1]);
  };

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  // Filtrar os dados com base no texto de busca
  const filteredRows = rowsTable.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(5),
    width: 500,
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Button onClick={addRow}>Test</Button>
      <Button onClick={addColumn}>Test</Button>
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
        <>
          {/* <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 6 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {Array.from(Array(group.length)).map((_, index) => (
                <Grid xs={2} sm={4} md={4} key={index}>
                  <Item className="line-group">
                    <div className="station-map">
                      <div className="group">
                        <div className="container">
                          {columns.map((_, indexColumn) => (
                            <div key={`column-${indexColumn}`}>
                              {rows.map((_, indexRow) => (
                                <Tooltip
                                  key={`tooltip-col${indexColumn}-row${indexRow} --item${status.status}`}
                                  title={getStatusTooltip(
                                    indexColumn,
                                    indexRow
                                  )}
                                  placement="top"
                                  arrow
                                >
                                  <p
                                    onClick={handleClickOpen}
                                    key={`col${indexColumn}-row${indexRow}-${indexColumn}`}
                                    className={`box ${getStatusClass(
                                      indexColumn,
                                      indexRow
                                    )} ${setMargin(indexColumn)}`}
                                    id={`col${indexColumn}-row${indexRow}`}
                                  >
                                    <div className="icon-one-one"></div>
                                  </p>
                                </Tooltip>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box> */}
          <StationMap groupedStations={group} ></StationMap>
          
          {/* {group.map((lineGroup, lineIndex) => (
            <div className="group-container" key={lineIndex}>
              <Row>
                <Col sm={lineIndex}>
                  <div className="station-map">
                    <div className="group">
                      <div className="container">
                        {columns.map((_, indexColumn) => (
                          <div key={`column-${indexColumn}`}>
                            {rows.map((_, indexRow) => (
                              <Tooltip
                                key={`tooltip-col${indexColumn}-row${indexRow} --item${status.status}`}
                                title={getStatusTooltip(indexColumn, indexRow)}
                                placement="top"
                                arrow
                              >
                                <p
                                  onClick={handleClickOpen}
                                  key={`col${indexColumn}-row${indexRow}-${indexColumn}`}
                                  className={`box ${getStatusClass(
                                    indexColumn,
                                    indexRow
                                  )} ${setMargin(indexColumn)}`}
                                  id={`col${indexColumn}-row${indexRow}`}
                                >
                                  <div className="icon-one-one"></div>
                                </p>
                              </Tooltip>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))} */}
        </>
      ) : (
        <Box className="grid-table">
          <ESDTableView></ESDTableView>
        </Box>
      )}

      <ESDHomeModal open={open} handleClose={handleClose} />
    </>
  );
};

export default ESDDashboardPage;
