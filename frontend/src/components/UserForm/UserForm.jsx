import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import UserListPage from '../../pages/UserListPage/UserListPage';

const UserForm = ({ user, onSubmit }) => {
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ id: user ? user.id : null, name, email });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
                label="Name" 
                variant="outlined" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
            />
            <TextField 
                label="Email" 
                variant="outlined" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
            <UserListPage></UserListPage>
        </Box>
    );
};

export default UserForm;