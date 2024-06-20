import React, { useState } from 'react';
import { Alert, Button, Card, Container, Snackbar, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Login = () => {
//   const navigate = useNavigate()
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = await AuthService.login(username, password);
//       localStorage.setItem('token', token);
//       navigate('/')
//       // Redirecionar após o login, se necessário
      
//     } catch (error) {
//       console.error('Erro ao fazer login:', error);
//     }
//   };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      {/* <Snackbar autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar> */}

      <Card sx={{ mt: 5, pt: 5, px: 10, width: '40%', display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
        {/* <img src={} alt="" width="200px" style={{ marginTop: '20px' }} /> */}
        <form>
          <TextField
            label="username"
            sx={{ my: 3 }}
            fullWidth
            type="text" id="username" 
          />
          <TextField
            label="Senha"
            id="password"
            type="password"
            sx={{ mb: 3 }}
            fullWidth
          />
          <Button type="submit" sx={{ mt: 2, mb: 1 }}>
            Cadastrar
          </Button>
          <Button>
            Login
          </Button>
          
        </form>
      </Card>
    </Container>
  );

};

export default Login;