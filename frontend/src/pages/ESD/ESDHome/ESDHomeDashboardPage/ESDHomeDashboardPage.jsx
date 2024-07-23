import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import "./ESDTable.css";
import ESDHomeModal from "../ESDHomeModal/ESDHomeModal";

const ESDDashboardPage = () => {
  const [columns] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 2, 5, 14, 15, 16, 17, 18,
  ]);
  const [rows] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <>
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
                  {""}
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
