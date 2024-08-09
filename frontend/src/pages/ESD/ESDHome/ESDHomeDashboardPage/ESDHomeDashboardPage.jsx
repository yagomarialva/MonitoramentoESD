import { Tooltip, Button, Box } from "@mui/material";
import "./ESDTable.css";
import ESDHomeModal from "../ESDHomeModal/ESDHomeModal";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ESDDashboardPage = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 2, 5, 14, 15, 16, 17, 18,
  ]);
  const [rows, setRows] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        // const result = await getAllOperators();
        // handleStateChange({ allOperators: result.value });
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

  return (
    <>
      {/* <Card className="control-painel">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Controle de Monitores
            </Typography>
            <Row>
              <Col sm={1}>
                <Button variant="outlined" color="success" onClick={addColumn}>
                  Definir Linha
                </Button>
              </Col>
              <Col sm={1}>
                <Button variant="outlined" color="success" onClick={addRow}>
                  Adicionar Jig
                </Button>
              </Col>
            </Row>
          </CardContent>
      </Card> */}

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

      <ESDHomeModal open={open} handleClose={handleClose} />
    </>
  );
};

export default ESDDashboardPage;
