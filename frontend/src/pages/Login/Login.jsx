import React from 'react';
import { Button, Card, Container, TextField } from '@mui/material'

const Login = () => {

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>


      <Card sx={{ mt: 5, pt: 5, px: 10, width: '40%', display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
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