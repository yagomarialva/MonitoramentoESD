import React from "react";
import AppRoutes from "./routes/Routes";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import "./i18n.js"; // ts => import './i18n.ts'
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Menu from "./pages/Menu/Menu.jsx";
import { Helmet } from "react-helmet"
import { useEffect } from "react"

const App = () => {
  useEffect(() => {
    document.title = "FCT Auto Test"
  }, [])
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <>
    <div className="App">

    <Menu></Menu>
    </div>
      {/* <div className="App">
        <h1>
          Our Translated Header:
          {t("headerTitle", { appName: "App for Translations" })}
        </h1>
        <h3>Current Language: {currentLanguage}</h3>
        <button type="button" onClick={handleChangeLanguage}>
          Change Language
        </button>
      </div> */}
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Button color="inherit" component={Link} to="/bracelets">
            Bracelets ESD
          </Button>
          <Button color="inherit" onClick={handleChangeLanguage}>
            Change Language
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2 }}>
        <AppRoutes />
      </Container> */}
    </>
  );
};

export default App;
