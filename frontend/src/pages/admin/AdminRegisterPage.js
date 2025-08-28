import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Grid, 
    Box, 
    Typography, 
    Paper, 
    Checkbox, 
    FormControlLabel, 
    TextField, 
    CssBaseline, 
    IconButton, 
    InputAdornment, 
    CircularProgress,
    Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bgpic from "../../assets/designlogin.jpg";
import { LightPurpleButton } from '../../components/buttonStyles';
import { registerUser } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import Popup from '../../components/Popup';

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#7f56da',
        },
        secondary: {
            main: '#2c2143',
        },
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
    }
});

const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({
        name: false,
        schoolName: false,
        email: false,
        password: false
    });
    const [formData, setFormData] = useState({
        name: '',
        schoolName: '',
        email: '',
        password: ''
    });
    const role = "Admin";

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Validate form
        const newErrors = {
            name: !formData.name,
            schoolName: !formData.schoolName,
            email: !formData.email,
            password: !formData.password
        };
        
        setErrors(newErrors);
        
        if (Object.values(newErrors).some(error => error)) {
            setMessage('Please fill in all required fields');
            setShowPopup(true);
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrors(prev => ({ ...prev, email: true }));
            setMessage('Please enter a valid email address');
            setShowPopup(true);
            return;
        }

        // Password validation
        if (formData.password.length < 6) {
            setErrors(prev => ({ ...prev, password: true }));
            setMessage('Password must be at least 6 characters');
            setShowPopup(true);
            return;
        }

        const fields = { ...formData, role };
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        }
        else if (status === 'error') {
            setMessage('An error occurred during registration');
            setShowPopup(true);
            setLoader(false);
            console.error(error);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "primary.main", fontWeight: 'bold' }}>
                            Create Admin Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                            Create your own school by registering as an admin.
                            You will be able to add students and faculty and manage the system.
                        </Typography>
                        <Box 
                            component="form" 
                            noValidate 
                            onSubmit={handleSubmit} 
                            sx={{ 
                                mt: 2,
                                width: '100%'
                            }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={formData.name}
                                error={errors.name}
                                helperText={errors.name && 'Name is required'}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="schoolName"
                                label="School Name"
                                name="schoolName"
                                autoComplete="off"
                                value={formData.schoolName}
                                error={errors.schoolName}
                                helperText={errors.schoolName && 'School name is required'}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                error={errors.email}
                                helperText={errors.email && 'Valid email is required'}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                error={errors.password}
                                helperText={errors.password ? 'Password must be at least 6 characters' : ''}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                                sx={{ mb: 2 }}
                            />
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    py: 1.5,
                                    fontSize: '1rem'
                                }}
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Register Now"}
                            </LightPurpleButton>
                            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                Already have an account?{' '}
                                <StyledLink to="/Adminlogin">
                                    Sign in
                                </StyledLink>
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        }
                    }}
                />
            </Grid>
            <Popup 
                message={message} 
                setShowPopup={setShowPopup} 
                showPopup={showPopup} 
                severity={status === 'failed' || status === 'error' ? "error" : "info"}
            />
        </ThemeProvider>
    );
};

const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

export default AdminRegisterPage;