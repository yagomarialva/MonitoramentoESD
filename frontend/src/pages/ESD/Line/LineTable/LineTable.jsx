import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllLines, createLine, deleteLine } from "../../../../api/linerApi";
import {
  List,
  Button,
  Typography,
  Input,
  Modal,
  Tooltip,
  Pagination,
  Alert,
  Space,
} from "antd";
import {
  DeleteOutlined,
  InfoCircleOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LineModal from "../LineModal/LineModal";
import LineForm from "../LineForm/LineForm";
import LineConfirmModal from "../LineConfirmModal/LineConfirmModal";
import LineEditForm from "../LineEditForm/LineEditForm";
import { useNavigate } from "react-router-dom";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "./Line.css";
const LineTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    allLines: [],
    line: {},
    open: false,
    openModal: false,
    openEditModal: false,
    editCell: null,
    editData: null,
    deleteConfirmOpen: false,
    lineToDelete: null,
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    filterSerialNumber: "",
    page: 1,
    rowsPerPage: 10,
  });

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

  const handleOpen = (line) => handleStateChange({ line, open: true });
  const handleClose = () => handleStateChange({ open: false });
  const handleEditClose = () =>
    handleStateChange({ openEditModal: false, editData: null });
  const handleOpenModal = () => handleStateChange({ openModal: true });
  const handleCloseModal = () => handleStateChange({ openModal: false });
  const handleDeleteOpen = (line) =>
    handleStateChange({ lineToDelete: line, deleteConfirmOpen: true });
  const handleDeleteClose = () =>
    handleStateChange({ deleteConfirmOpen: false, lineToDelete: null });

  const handleEditOpen = (line) => {
    handleStateChange({ editData: line, openEditModal: true });
  };

  const handleCreateLine = async (line) => {
    try {
      await createLine(line);
      const result = await getAllLines();
      handleStateChange({ allLines: result });
      showSnackbar(
        t("LINE.TOAST.CREATE_SUCCESS", { appName: "App for Translations" })
      );
    } catch (error) {
      showSnackbar(
        t("LINE.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLine(id);
      handleStateChange({
        allLines: state.allLines.filter((line) => line.id !== id),
      });
      showSnackbar(
        t("LINE.TOAST.DELETE_SUCCESS", { appName: "App for Translations" })
      );
    } catch (error) {
      showSnackbar(
        t("LINE.TOAST.TOAST_ERROR", { appName: "App for Translations" }),
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchDataAllUsers = async () => {
      try {
        const result = await getAllLines();
        handleStateChange({ allLines: result });
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
    if (state.lineToDelete) {
      await handleDelete(state.lineToDelete.id);
      handleDeleteClose();
    }
  };

  const handleFilterChange = (e) => {
    handleStateChange({ filterSerialNumber: e.target.value });
  };

  const handlePageChange = (page) => {
    handleStateChange({ page });
  };

  const filteredLines = state.allLines.filter((line) => {
    const name = line.name ? line.name.toLowerCase() : "";
    const filterSerialNumber = state.filterSerialNumber.toLowerCase();
    return name.includes(filterSerialNumber);
  });

  const paginatedLines = filteredLines.slice(
    (state.page - 1) * state.rowsPerPage,
    state.page * state.rowsPerPage
  );

  return (
    <>
      <div className="line-header-container">
        <div className="line-header-title-container">
          <LineAxisIcon  className="axis-icon" />
          <Typography.Title className="line-header-title" level={4}>
            {t("LINE.TABLE_HEADER")}
          </Typography.Title>
        </div>
        <Button
          type="default"
          onClick={handleOpenModal}
          className="line-header-button"
        >
          + {t("LINE.ADD_LINE", { appName: "App for Translations" })}
        </Button>
      </div>
      <Input
        className="search-button"
        placeholder={t("LINE.SEARCH_INPUT", {
          appName: "App for Translations",
        })}
        prefix={<SearchOutlined />} // Use prefix para posicionar o ícone à esquerda
        value={state.filterSerialNumber}
        onChange={handleFilterChange}
      />
      <List
        dataSource={paginatedLines}
        renderItem={(line, index) => (
          <List.Item
            className={`list-item ${index % 2 === 0 ? "even" : "odd"}`} // Alterna as classes para linhas pares e ímpares
            actions={[
              <Tooltip title={t("LINE.INFO_LINE")}>
                <Button
                  className="no-border-button-informations"
                  icon={<VisibilityOutlinedIcon />}
                  onClick={() => handleOpen(line)}
                />
              </Tooltip>,
              <Tooltip title={t("LINE.DELETE_LINE")}>
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
        className="custom-list" // Adiciona uma classe CSS ao List
      />

      <Space
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        {/* Legenda */}
        <span>
          {`${(state.page - 1) * state.rowsPerPage + 1}-${Math.min(
            state.page * state.rowsPerPage,
            filteredLines.length
          )} de ${filteredLines.length}`}
        </span>

        {/* Paginação */}
        <Pagination
          current={state.page}
          pageSize={state.rowsPerPage}
          total={filteredLines.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Space>

      {/* Modals */}
      <LineModal
        open={state.open}
        handleClose={handleClose}
        lineName={state.line.name}
        line={state.line}
      />
      <LineForm
        open={state.openModal}
        handleClose={handleCloseModal}
        onSubmit={handleCreateLine}
      />
      {/* <LineEditForm
        open={state.openEditModal}
        handleClose={handleEditClose}
        onSubmit={handleEditCellChange}
        initialData={state.editData}
      /> */}
      <LineConfirmModal
        open={state.deleteConfirmOpen}
        handleClose={handleDeleteClose}
        handleConfirm={handleConfirmDelete}
        title={t("LINE.CONFIRM_DIALOG.DELETE_LINE", {
          appName: "App for Translations",
        })}
        description={t("LINE.CONFIRM_DIALOG.CONFIRM-TEXT", {
          appName: "App for Translations",
        })}
      />
      {state.snackbarOpen && (
        <Alert
          message={state.snackbarMessage}
          type={state.snackbarSeverity}
          showIcon
          closable
          afterClose={() => handleStateChange({ snackbarOpen: false })}
          style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}
        />
      )}
    </>
  );
};

export default LineTable;
