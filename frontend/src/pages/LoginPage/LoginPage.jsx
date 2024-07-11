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
import TokenApi from "../../api/TokenApi";
import { useAuth } from "../../context/AuthContext";


const LoginPage = () => {
  const navigate = useNavigate()
  const [username, setusername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth();

  const handleClick = () => {
    setLoading(true)
    TokenApi.post('/api/Authentication', {
      username: username,
      password: password,
    }).then(({ data }) => {
      localStorage.setItem('token', data.token)
      // localStorage.setItem('user-type', data.tipo)
      navigate('/')
    }).catch((e) => {
      setError(e.response.data.error)
    }).finally(() => {
      const userData = { token: localStorage.getItem('token') };
      login(userData);
      setLoading(false)
    })
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Snackbar open={error.length > 0} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Card sx={{ mt: 5,ml:5, mb:10, pt: 5, px: 10, width: '40%', display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
        <Typography variant='h4' align="center">LOGIN</Typography>
        <img src={Logo} alt="" width="200px" style={{ marginTop: '20px' }} />

        <TextField
          label="E-mail"
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

        <LoadingButton loading={loading} color="primary" variant="contained" fullWidth onClick={handleClick}>
          Fazer Login
        </LoadingButton>

        <Button sx={{ mt: 2, mb: 1 }} onClick={() => {
          navigate('/cadastrar-operador')
        }}>
          Cadastrar Operador
        </Button>
      </Card>
    </Container>
  );
};

export default LoginPage;
