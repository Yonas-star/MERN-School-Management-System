import React, { useState } from 'react';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp,
    Delete,
    Edit
} from '@mui/icons-material';
import { 
    Button,
    Collapse,
    Paper,
    Typography,
    TextField,
    Box,
    Divider,
    Avatar,
    IconButton,
    useTheme,
    Alert,
    CircularProgress,
    Container,
    Grid,
    Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';

const AdminProfile = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { currentUser } = useSelector((state) => state.user);
    const address = "Admin";

    const [formData, setFormData] = useState({
        name: currentUser.name,
        email: currentUser.email,
        password: "",
        schoolName: currentUser.schoolName
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        
        try {
            const fields = formData.password === "" 
                ? { name: formData.name, email: formData.email, schoolName: formData.schoolName } 
                : formData;
            
            await dispatch(updateUser(fields, currentUser._id, address));
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setShowEdit(false), 1500);
        } catch (error) {
            setErrorMessage('Failed to update profile. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        
        setLoading(true);
        try {
            await dispatch(deleteUser(currentUser._id, "Students"));
            await dispatch(deleteUser(currentUser._id, address));
            dispatch(authLogout());
            navigate('/');
        } catch (error) {
            setErrorMessage('Failed to delete account. Please try again.');
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Admin Profile
                    </Typography>
                    <Box>
                        <IconButton
                            color="error"
                            onClick={deleteHandler}
                            sx={{ mr: 1 }}
                            disabled={loading}
                        >
                            <Delete />
                        </IconButton>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setShowEdit(!showEdit)}
                            startIcon={showEdit ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            endIcon={<Edit />}
                            disabled={loading}
                        >
                            {showEdit ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: 48,
                                    bgcolor: theme.palette.primary.main,
                                    mb: 2
                                }}
                            >
                                {currentUser.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" gutterBottom>
                                {currentUser.name}
                            </Typography>
                            <Chip
                                label="Administrator"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Account Information
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ ml: 2 }}>
                                <strong>Email:</strong> {currentUser.email}
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ ml: 2 }}>
                                <strong>School:</strong> {currentUser.schoolName}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Collapse in={showEdit} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 3 }} />
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {successMessage}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={submitHandler} sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="School Name"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="New Password (leave blank to keep current)"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                        sx={{ px: 4, py: 1.5 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>
            </Paper>
        </Container>
    );
};

export default AdminProfile;