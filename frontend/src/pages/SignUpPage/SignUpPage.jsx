import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Snackbar,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import TokenApi from "../../api/TokenApi";
import Logo from "./logo.png";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rolesName, setRolesName] = useState("");
  const [badge, setBadge] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarOpen = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangeRole = (event) => {
    setRolesName(event.target.value);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      handleSnackbarOpen("As senhas não coincidem.", "error");
      return;
    }

    setLoading(true);
    try {
      await TokenApi.post("/criacao", {
        username,
        password,
        rolesName,
        badge,
      });
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setRolesName("");
      setBadge("");
      handleSnackbarOpen("Usuário criado com sucesso!", "success");
    } catch (error) {
      handleSnackbarOpen(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card
        sx={{
          p: 4,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro
        </Typography>
        <img
          src={Logo}
          alt="Logo"
          width="150px"
          style={{ marginBottom: "20px" }}
        />
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Matricula"
          variant="outlined"
          fullWidth
          margin="normal"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirmar Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="role-select-label">Função</InputLabel>
          <Select
            labelId="role-select-label"
            value={rolesName}
            onChange={handleChangeRole}
            label="Função"
          >
            <MenuItem value="">
              <em>Selecione uma Função</em>
            </MenuItem>
            <MenuItem value="administrator">Administrador</MenuItem>
            <MenuItem value="operator">Operador</MenuItem>
            <MenuItem value="developer">Desenvolvedor</MenuItem>
          </Select>
        </FormControl>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Cadastrar
        </LoadingButton>
        <Button
          sx={{ mt: 2 }}
          fullWidth
          variant="outlined"
          onClick={() => navigate("/")}
        >
          Voltar para home
        </Button>
      </Card>
    </Container>
  );
};

export default SignUpPage;
