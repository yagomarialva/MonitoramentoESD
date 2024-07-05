import * as React from "react";
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
import { Container } from "@mui/material";
import AppRoutes from "../../routes/Routes";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const drawerWidth = 190;

export default function Menu() {
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };
  const [open] = React.useState(true);


  const list = () => (
    <List>
      {[
        { text: "Controller", icon: <HomeIcon />, path: "/esd-dashboard" },
        {
          text: "Operators",
          icon: <AccountCircleOutlinedIcon />,
          path: "/users",
        },
        {
          text: "Stations",
          icon: <PrecisionManufacturingOutlinedIcon />,
          path: "/bracelets",
        },
        { text: "Monitors", icon: <SensorsOutlinedIcon />, path: "/monitors" },
      ].map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            component={Link}
            to={item.path}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#4caf50",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FCT Auto Test
          </Typography>
          <Button color="inherit" onClick={handleChangeLanguage}>Change Language {currentLanguage}</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          ml: "-100px",
          whiteSpace: "nowrap",
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : 64,
            boxSizing: "border-box",
            mt: "64px",
            ml: "10px",
            transition: "width 0.3s",
          },
        }}
      >
        {list()}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          ml: open ? `${drawerWidth}px` : "64px",
          transition: "margin-left 0.3s",
          mt: "64px",
        }}
      >
        <Typography paragraph>
          <Container sx={{ mt: -3, ml: -10 }}>
            <AppRoutes />
          </Container>
        </Typography>
      </Box>
    </Box>
  );
}
