import React from 'react';
import { Typography, Box } from '@mui/material';

const HomePage = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h3">Home Page</Typography>
            <Typography variant="body1">Welcome to the user management system.</Typography>
        </Box>
    );
};

export default HomePage;