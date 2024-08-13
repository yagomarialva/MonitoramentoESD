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
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Importar o DataGrid e GridToolbar
import { getMonitor } from "../../../../api/monitorApi";

import "./ESDTable.css";

// Função para gerar dados fictícios
const generateFakeData = (numItems) => {
  const statuses = ["ok", "error", "warning"]; // Status fictícios
  const data = [];

  for (let i = 1; i <= numItems; i++) {
    data.push({
      id: `id-${i}`,
      monitorEsdId: i,
      linkStationAndLineId: i,
      positionSequence: i,
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: statuses[i % statuses.length], // Status fictício baseado no índice
    });
  }

  return data;
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

// Função para definir a margem com base na coluna (se necessário)
const setMargin = () => {
  return "";
};

const ESDDashboardPage = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 2, 5, 14, 15, 16, 17, 18,
  ]);
  const [rows, setRows] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);

  //table
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
  //table

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        // Simulação de obtenção de dados
        const data = generateFakeData(288); // Gerar 288 itens
        // setRowsTable(data); // Atualize o estado com os dados gerados
        // Atualize os dados com o nome do monitor
        const updatedData = await Promise.all(
          data.map(async (item) => {
            const monitorData = await getMonitor(item.monitorEsdId);
            return {
              ...item,
              serialNumber: monitorData.serialNumber, // Assuma que getMonitor retorna o serialNumber diretamente
            };
          })
        );
        console.log('updatedData', updatedData)
        setRowsTable(updatedData);
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
      ) : (
        <Box className="grid-table">
          <DataGrid
            rows={filteredRows}
            columns={columnsTable}
            pageSize={10}
            rowsPerPageOptions={[10]}
            components={{ Toolbar: GridToolbar }} // Adiciona a barra de ferramentas com filtros
          />
        </Box>
      )}

      <ESDHomeModal open={open} handleClose={handleClose} />
    </>
  );
};

export default ESDDashboardPage;
