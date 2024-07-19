import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Modal,
  Button,
  TextField,
  Container,
} from "@mui/material";
import { CardHeader } from "react-bootstrap";
import Menu from "../../../Menu/Menu";
import "./ESDTable.css";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ESDDashboardPage = () => {
  const [count, setCount] = useState(0);
  const [columns, setColumns] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 2, 5, 14, 15, 16, 17, 18,
  ]);
  const [rows, setRows] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [status, setStatus] = useState([
    { indexColumn: 0, indexRow: 0, status: "ok" },
    { indexColumn: 1, indexRow: 0, status: "ng" },
    { indexColumn: 2, indexRow: 2, status: "ok" },
    { indexColumn: 3, indexRow: 1, status: "ok" },
    { indexColumn: 3, indexRow: 6, status: "ok" },
    { indexColumn: 4, indexRow: 0, status: "ok" },
  ]);

  const getStatusClass = (indexColumn, indexRow) => {
    const item = status.find(
      (s) => s.indexColumn === indexColumn && s.indexRow === indexRow
    );
    return item ? (item.status === "ok" ? "ok" : "ng") : "";
  };

  const setMargin = (indexColumn) => {
    if (indexColumn % 3 === 0) {
      return "mRight";
    }
  };

  return (
    <>
      <Menu />
      <div className="container">
        {columns.map((_, indexColumn) => (
          <div key={`column-${indexColumn}`}>
            {rows.map((_, indexRow) => (
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
            ))}
          </div>
        ))}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ESDDashboardPage;
