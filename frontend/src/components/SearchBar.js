// src/components/SearchBar.js
import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search..." }) => {
    return (
        <Box sx={{ minWidth: 250 }}>
            <TextField
                variant="outlined"
                size="small"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                    },
                    '& .MuiOutlinedInput-input': {
                        py: 1,
                    },
                }}
            />
        </Box>
    );
};

export default SearchBar;