import React, { useState, useEffect } from 'react';
import { getUser, createUser, updateUser } from '../../../api/userApi'
import UserForm from '../../../components/UserForm/UserForm';
import * as reactRouterDom from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const UserEditPage = () => {
    const [user, setUser] = useState(null);
    const { id } = reactRouterDom.useParams();
    const navigate = reactRouterDom.useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (id !== 'new') {
                const result = await getUser(id);
                setUser(result);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (userData) => {
        if (id === 'new') {
            await createUser(userData);
        } else {
            await updateUser(id, userData);
        }
        navigate('/users');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>{id === 'new' ? 'Add User' : 'Edit User'}</Typography>
            <UserForm user={user} onSubmit={handleSubmit} />
        </Box>
    );
};

export default UserEditPage;