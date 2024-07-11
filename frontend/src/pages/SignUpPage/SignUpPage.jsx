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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [loading, setLoading] = useState(false);
  const [rolesName, setRole] = useState("");
  const [badge, setBadge] = useState("");
  const [state, setState] = useState({
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
  });
  const handleStateChange = (changes) => {
    setState((prevState) => ({ ...prevState, ...changes }));
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const showSnackbar = (message, severity) => {
    handleStateChange({
      snackbarMessage: message,
      snackbarSeverity: severity,
      snackbarOpen: true,
    });
  };
  
  const handleClick = () => {
    setLoading(true);
    TokenApi.post("/criacao", {
      username: username,
      password: password,
      rolesName: rolesName,
      badge: badge
    })
      .then(({ data }) => {
        console.log(data)
        setusername('')
        setPassword('')
        setRole('')
        setBadge('')
        showSnackbar("Usuário criado com sucesso!", "success");
      })
      .catch((e) => {
        console.log(e);
        showSnackbar(e.response.data, "error");
      })
      .finally(() => {
        // const userData = { token: localStorage.getItem("token") };
        // login(userData);
        setLoading(false);
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
          Cadastro
        </Typography>
        <img src={Logo} alt="" width="200px" style={{ marginTop: "20px" }} />
        <TextField
          label="E-mail"
          sx={{ my: 3 }}
          fullWidth
          onChange={(e) => setusername(e.target.value)}
          value={username}
        />
        <TextField
          label="Matricula"
          sx={{ mb: 3 }}
          fullWidth
          onChange={(e) => setBadge(e.target.value)}
          value={badge}
        />
        <TextField
          label="Senha"
          type="password"
          sx={{ mb: 3 }}
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <FormControl sx={{ mb: 3, minWidth: 300 }} size="normal">
          <InputLabel id="demo-select-normal-label">Função</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={rolesName}
            label="Função"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Selecione uma Função</em>
            </MenuItem>
            {/* "Admin,Operator,Developer" */}
            <MenuItem value={"admininstrator"}>Administrador</MenuItem>
            <MenuItem value={"Operator"}>Operador</MenuItem>
            <MenuItem value={"Developer"}>Desenvolvedor</MenuItem>
          </Select>
        </FormControl>
        <LoadingButton
          loading={loading}
          color="primary"
          variant="contained"
          fullWidth
          onClick={handleClick}
        >
          Cadastrar
        </LoadingButton>
        <Button
          sx={{ mt: 2, mb: 1 }}
          onClick={() => {
            navigate("/login");
          }}
        >
          Voltar para login
        </Button>
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

export default SignUpPage;
