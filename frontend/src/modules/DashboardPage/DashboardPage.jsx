import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const DashboardPage = () => {
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/comments');
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchTodos = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/todos');
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchTodos();
        fetchUsers();
        fetchComments();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Comments</Typography>
                        <Typography variant="body1">Number of comments: {comments.length}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Users</Typography>
                        <Typography variant="body1">Number of users: {users.length}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Todos</Typography>
                        <Typography variant="body1">Number of Todos: {todos.length}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;