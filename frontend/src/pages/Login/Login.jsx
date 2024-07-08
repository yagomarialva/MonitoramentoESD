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
// import api from '../../services/api'
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [senha, setSenha] = useState(null);
  const [error] = useState("");
  const [username, setUsername] = useState(null);
  const { login } = useAuth();

  const handleClick = () => {
    const userData = { name: username, senha: senha };
    if(userData.name === null && userData.senha === null){
      console.log('here', userData)
      return
    }else {
      login(userData);
    }
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
          label="E-mail"
          sx={{ my: 3 }}
          fullWidth
          type="text"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          sx={{ mb: 3 }}
          fullWidth
          required
          onChange={(e) => setSenha(e.target.value)}
          value={senha}
        />

        <Button onClick={handleClick}>Fazer Login</Button>

        <Button
          sx={{ mt: 2, mb: 1 }}
          onClick={() => {
            navigate("/esd-dashboard");
          }}
        >
          Cadastrar Operador
        </Button>

        {/* <Button onClick={() => {
          // navigate('/cadastrar-fornecedor')
        }}>
          Cadastrar Fornecedor
        </Button> */}
      </Card>
    </Container>
  );
};

export default Login;
