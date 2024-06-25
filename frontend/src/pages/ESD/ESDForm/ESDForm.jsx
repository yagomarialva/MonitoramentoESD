import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const ESDForm = ({ station, onSubmit }) => {
    const [title, setTitle] = useState(station ? station.title : '');
    const [completed, setCompleted] = useState(station ? station.completed : '');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ id: title ? title.id : null, title, completed });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
                label="Name" 
                variant="outlined" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
            <TextField 
                label="Email" 
                variant="outlined" 
                type="email" 
                value={completed} 
                onChange={(e) => setCompleted(e.target.value)} 
                required 
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
};

export default ESDForm;