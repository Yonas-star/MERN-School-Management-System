import React, { useEffect, useState } from "react";
import { 
    Box, Button, CircularProgress, Stack, TextField, 
    Typography, Avatar, Card, CardContent, Divider
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from "../../../components/Popup";
import Classroom from "../../../assets/classroom.png";
import { School as SchoolIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
}));

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error: stateError, tempDetails } = userState;

    const adminID = currentUser._id;
    const address = "Sclass";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const validateClassName = (name) => {
        if (!name.trim()) {
            return "Class name is required";
        }
        if (name.length > 30) {
            return "Class name must be less than 30 characters";
        }
        return "";
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setSclassName(value);
        setError(validateClassName(value));
    };

    const fields = {
        sclassName: sclassName.trim(),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const validationError = validateClassName(sclassName);
        if (validationError) {
            setError(validationError);
            return;
        }
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id);
            dispatch(underControl());
            setLoader(false);
        }
        else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        }
        else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, stateError, response, dispatch, tempDetails]);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            p: 2
        }}>
            <Card sx={{
                maxWidth: 550,
                width: '100%',
                p: { xs: 2, sm: 4 },
                boxShadow: 3,
                borderRadius: '16px'
            }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar sx={{ 
                            bgcolor: 'primary.light', 
                            color: 'primary.main',
                            width: 56,
                            height: 56
                        }}>
                            <SchoolIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold">
                            Create New Class
                        </Typography>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 4
                    }}>
                        <img
                            src={Classroom}
                            alt="classroom"
                            style={{ 
                                width: '80%',
                                maxWidth: '300px',
                                borderRadius: '8px'
                            }}
                        />
                    </Box>

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Class Name"
                                variant="outlined"
                                value={sclassName}
                                onChange={handleChange}
                                error={!!error}
                                helperText={error}
                                required
                                inputProps={{ maxLength: 30 }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    }
                                }}
                            />
                            <StyledButton
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                disabled={loader || !!error}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                    height: '48px'
                                }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Create Class"}
                            </StyledButton>
                            <StyledButton
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                sx={{
                                    borderColor: 'grey.400',
                                    color: 'text.primary',
                                    '&:hover': {
                                        borderColor: 'grey.600',
                                    }
                                }}
                            >
                                Go Back
                            </StyledButton>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default AddClass;