import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Menu from "../Menu/Menu";
import { useAuth } from "../../context/AuthContext";
import Login from "../Login/Login";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const { user, logout } = useAuth();
  // const userIsInactive = useFakeInactiveUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // fake.logout();
      navigate("/esd-dashboard");
    } else {
      navigate("/");
    }
  }, []);
  return (
    <>
      {user ? (
        <div>
          <Menu></Menu>
        </div>
      ) : (
        <Login></Login>

      )}

    </>

  );
};

export default HomePage;
