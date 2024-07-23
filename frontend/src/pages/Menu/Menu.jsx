import React, {  useState } from "react";
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
import { Link } from "react-router-dom";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "../../context/AuthContext";
import "./Menu.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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
      path: "/stations",
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

const MenuList = ({ menuItems }) => (
  <List>
    {menuItems.map((item) => (
      <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component={Link}
          to={item.path}
          className="list-items-buttons"
        >
          <ListItemIcon className="list-items-buttons-icons">
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);

export default function Menu({ componentToShow }) {
  const token = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const userRole = getUserRoleFromToken(token);
  const menuItems = getMenuItems(userRole);
  const { logout } = useAuth();
  const [open] = useState(true);

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
        <Card sx={{overflowY: 'auto', overflowX: 'auto'}} className="drawer-card">
          <CardContent>{componentToShow}</CardContent>
        </Card>
      </Box>
    </Box>
  );
}
