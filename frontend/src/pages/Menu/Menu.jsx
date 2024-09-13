import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Menu.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress"; // Importa o indicador de progresso circular

// Funções de utilitário
const getUserRoleFromToken = (token) => {
  return token === "administrator" ? "administrator" : "operator";
};

const getMenuItems = (userRole) => {
  const allItems = [
    {
      text: "Controle",
      icon: <HomeIcon />,
      path: "/dashboard",
      roles: ["administrator", "operator"],
      subItems: [
        { text: "Linhas", path: "/liners" },
        { text: "Estações", path: "/stations" },
        { text: "Ligar Estação e Linha", path: "/linkstationline" },
      ],
    },
    {
      text: "Operadores",
      icon: <AccountCircleOutlinedIcon />,
      path: "/users",
      roles: ["administrator"],
    },
    {
      text: "Jigs",
      icon: <PrecisionManufacturingOutlinedIcon />,
      path: "/jigs",
      roles: ["operator", "administrator"],
    },
    {
      text: "Monitores",
      icon: <SensorsOutlinedIcon />,
      path: "/monitors",
      roles: ["operator", "administrator"],
    },
    {
      text: "Cadastrar",
      icon: <PersonAddIcon />,
      path: "/register",
      roles: ["administrator"],
    },
  ];

  return allItems.filter((item) => item.roles.includes(userRole));
};

// Componente do MenuList
const MenuList = ({ menuItems }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleItemClick = (item) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  useEffect(() => {
    const currentItem = menuItems.find((item) =>
      item.subItems?.some((subItem) => subItem.path === currentPath)
    );
    if (currentItem && expandedItem !== currentItem.text) {
      setExpandedItem(currentItem.text);
    }
  }, [location, menuItems, expandedItem, currentPath]);

  const isSelected = (path) => currentPath === path;

  return (
    <List>
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem
            disablePadding
            sx={{
              display: "flex", // Alinha os itens lado a lado
              alignItems: "center", // Centraliza os itens verticalmente
            }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              className={`list-items-buttons ${
                isSelected(item.path) ? "selected" : ""
              }`}
              sx={{ flexGrow: 1 }} // Permite que o botão ocupe o espaço disponível
            >
              <ListItemIcon className="list-items-buttons-icons">
                {item.icon}
              </ListItemIcon >
              <ListItemText primary={item.text} />
            </ListItemButton>
            {item.subItems && (
              <IconButton
              className={`list-items-buttons ${
                isSelected(item.path) ? "selected" : ""
              }`}
                onClick={() => item.subItems && handleItemClick(item.text)}
                edge="end"
                sx={{ borderRadius: 0 }} // Define a área clicável como quadrada
              >
                {expandedItem === item.text ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItem>
          {expandedItem === item.text && item.subItems && (
            <List component="div" disablePadding className="drawer-sublist">
              {item.subItems.map((subItem, subIndex) => (
                <ListItem key={subIndex} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={subItem.path}
                    className={isSelected(subItem.path) ? "selected" : ""}
                  >
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

// Componente principal Menu
export default function Menu({ componentToShow }) {
  const token = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const userRole = getUserRoleFromToken(token);
  const menuItems = getMenuItems(userRole);
  const { logout } = useAuth();
  const [open] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Simula um tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 segundo de atraso

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#4caf50",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FCT Auto Test
          </Typography>
          <Typography sx={{ mr: 2 }}>{name}</Typography>
          <Button onClick={logout} color="inherit" component={Link} to="/login">
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <div className="drawer-paper">
          <MenuList menuItems={menuItems} />
        </div>
      </Drawer>
      <Box component="main" className="main-content">
        <Card
          sx={{ overflowY: "auto", overflowX: "auto" }}
          className="drawer-card"
        >
          <CardContent>
            {isLoading ? ( // Exibe o loading enquanto isLoading for true
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "500px",
                }}
              >
                <CircularProgress /> {/* Indicador de progresso */}
              </Box>
            ) : (
              componentToShow
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
