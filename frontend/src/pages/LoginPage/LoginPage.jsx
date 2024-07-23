import {
  Alert,
  Button,
  Card,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Logo from "./logo.png";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import TokenApi from "../../api/TokenApi";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [state, setState] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
  });
  const handleStateChange = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };
  const handleClick = () => {
    setLoading(true);
    TokenApi.post("/api/Authentication", {
      username: username,
      password: password,
    })
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        navigate("/");
      })
      .catch(() => {
        showSnackbar('Login ou senha invalidos, tente novamente!');
      })
      .finally(() => {
        const userData = { token: localStorage.getItem("token") };
        login(userData);
        setLoading(false);
      });
  };

  const showSnackbar = (message, severity = "error") => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };

  return (
    <Container sx={{ display: "flex", justifyContent: "center" }}>
      <Snackbar
        open={error.length > 0}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Card
        sx={{
          mt: 5,
          ml: 5,
          mb: 10,
          pt: 5,
          px: 10,
          width: "40%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" align="center">
          LOGIN
        </Typography>
        <img src={Logo} alt="" width="200px" style={{ marginTop: "20px" }} />

        <TextField
          label="Nome"
          sx={{ my: 3 }}
          fullWidth
          onChange={(e) => setusername(e.target.value)}
          value={username}
        />
        <TextField
          label="Senha"
          type="password"
          sx={{ mb: 3 }}
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <LoadingButton
          loading={loading}
          color="primary"
          variant="contained"
          fullWidth
          onClick={handleClick}
          sx={{ mb: 4 }}
        >
          Fazer Login
        </LoadingButton>

      </Card>
      <Snackbar
              open={state.snackbarOpen}
              autoHideDuration={6000}
              onClose={() => handleStateChange({ snackbarOpen: false })}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              className={`snackbar-content snackbar-${state.snackbarSeverity}`}
            >
              <Alert
                onClose={() => handleStateChange({ snackbarOpen: false })}
                severity={state.snackbarSeverity}
                sx={{
                  backgroundColor: "inherit",
                  color: "inherit",
                  fontWeight: "inherit",
                  boxShadow: "inherit",
                  borderRadius: "inherit",
                  padding: "inherit",
                }}
              >
                {state.snackbarMessage}
              </Alert>
            </Snackbar>
    </Container>
  );
};

export default LoginPage;
