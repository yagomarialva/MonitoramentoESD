import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./AppRoutes.js";
import { BrowserRouter as Router, HashRouter } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const token = localStorage.getItem("token");

root.render(
  <AuthProvider>
    <HashRouter>
          <AppRoutes />
    </HashRouter>
  </AuthProvider>
);
