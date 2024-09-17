import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAllStations,
  createStation,
  deleteStation,
} from "../../../../api/stationApi";
import {
  List,
  Button,
  Typography,
  Input,
  Modal,
  Tooltip,
  Pagination,
  Space,
  message,
} from "antd";
import StationModal from "../StationModal/StationModal";
import StationForm from "../StationForm/StationForm";
import StationConfirmModal from "../StationConfirmModal/StationConfirmModal";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { SearchOutlined } from "@ant-design/icons";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
const StationTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    allStations: [],
    station: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    stationToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    filterSerialNumber: "",
    filterDescription: "",
    page: 1,
    rowsPerPage: 10,
  });

  const showMessage = (messageText, type = "success") => {
    message[type](messageText);
  };

  const handleStateChange = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const showSnackbar = (message, severity = "success") => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

  const handleOpen = (station) => handleStateChange({ station, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (station) =>
    handleStateChange({ stationToDelete: station, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, stationToDelete: null });

  const handlePageChange = (page) => {
    handleStateChange({ page });
  };

  const handleCreateStation = async (station) => {
    try {
      await createStation(station);
      const result = await getAllStations();
      handleStateChange({ allStations: result });
      showMessage(
        t("STATION.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
    } catch (error) {
      showMessage(
        t("STATION.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStation(id);
      handleStateChange({
        allStations: state.allStations.filter((station) => station.id !== id),
      });
      showMessage(
        t("STATION.TOAST.DELETE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error) {
      showMessage(
        t("STATION.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleEditCellChange = async (params) => {
    try {
      await createStation(params);
      const result = await getAllStations();
      handleStateChange({ allStations: result });
      showMessage(
        t("STATION.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      return result;
    } catch (error) {
      showMessage(
        t("STATION.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllStations();
        handleStateChange({ allStations: result });
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          localStorage.removeItem("token");
          navigate("/");
        }
        showSnackbar(t(error.message));
      }
    };
    fetchDataAllUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (state.stationToDelete) {
      await handleDelete(state.stationToDelete.id);
      handleDeleteClose();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    handleStateChange({ [name]: value });
  };


  const filteredStations = state.allStations.filter((station) => {
    const name = station.name ? station.name.toLowerCase() : "";
    const filterSerialNumber = state.filterSerialNumber.toLowerCase();
    return name.includes(filterSerialNumber);
  });

  const paginatedStations = filteredStations.slice(
    (state.page - 1) * state.rowsPerPage,
    state.page * state.rowsPerPage
  );

  return (
    <>
      <div className="line-header-container">
        <div className="line-header-title-container">
          <RouteOutlinedIcon className="axis-icon" />
          <Typography.Title className="line-header-title" level={4}>
            {t("STATION.TABLE_HEADER")}
          </Typography.Title>
        </div>
        <Button
          type="default"
          onClick={handleOpenModal}
          className="line-header-button"
        >
          + {t("STATION.ADD_STATION", { appName: "App for Translations" })}
        </Button>
      </div>
      <Input
        className="search-button"
        placeholder={t("LINE.SEARCH_INPUT", {
          appName: "App for Translations",
        })}
        prefix={<SearchOutlined />}
        name="filterSerialNumber"
        value={state.filterSerialNumber}
        onChange={handleFilterChange}
      />
      <List
        dataSource={paginatedStations}
        renderItem={(line, index) => (
          <List.Item
            className={`list-item ${index % 2 === 0 ? "even" : "odd"}`}
            actions={[
              <Tooltip title={t("STATION.INFO_STATION")}>
                <Button
                  className="no-border-button-informations"
                  icon={<VisibilityOutlinedIcon />}
                  onClick={() => handleOpen(line)}
                />
              </Tooltip>,
              <Tooltip title={t("STATION.DELETE_STATION")}>
                <Button
                  className="no-border-button-delete"
                  icon={<DeleteOutlineOutlinedIcon />}
                  danger
                  onClick={() => handleDeleteOpen(line)}
                />
              </Tooltip>,
            ]}
          >
            <List.Item.Meta title={`${line.name}`} />
          </List.Item>
        )}
        className="custom-list"
      />

      <Space
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <span>
          {`${(state.page - 1) * state.rowsPerPage + 1}-${Math.min(
            state.page * state.rowsPerPage,
            filteredStations.length
          )} de ${filteredStations.length}`}
        </span>
        <Pagination
          current={state.page}
          pageSize={state.rowsPerPage}
          total={filteredStations.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Space>

      <StationForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateStation}
      />

      <StationModal
        open={state.open}
        handleClose={handleClose}
        stationName={state.station.name}
        onSubmit={handleEditCellChange}
        station={state.station}
      />

      <StationConfirmModal
        open={state.deleteConfirmOpen}
        handleClose={handleDeleteClose}
        handleConfirm={handleConfirmDelete}
        title={t("STATION.CONFIRM_DIALOG.DELETE_STATION", {
          appName: "App for Translations",
        })}
        description={t("STATION.CONFIRM_DIALOG.CONFIRM-TEXT", {
          appName: "App for Translations",
        })}
      />
    </>
  );
};

export default StationTable;
