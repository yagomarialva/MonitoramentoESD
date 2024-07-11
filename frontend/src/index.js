import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./AppRoutes.js";
import { BrowserRouter as Router, HashRouter } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext.js";
import Menu from "./pages/Menu/Menu.jsx";
import { Container, Typography } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));
const token = localStorage.getItem("token");

root.render(
  <AuthProvider>
    <HashRouter>
      {/* <Typography paragraph>
        <Container sx={{ mt: -7, ml: 22 }}> */}
          <AppRoutes />
        {/* </Container>
      </Typography> */}
    </HashRouter>
  </AuthProvider>
);
