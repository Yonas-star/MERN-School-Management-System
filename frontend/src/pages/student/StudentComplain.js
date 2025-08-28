import { useEffect, useState } from 'react';
import { 
    Box, 
    CircularProgress, 
    Stack, 
    TextField, 
    Typography,
    InputAdornment,
    Alert,
    Card,
    CardContent
} from '@mui/material';
import Popup from '../../components/Popup';
import { BlueButton } from '../../components/buttonStyles';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const dispatch = useDispatch();
    const { status, currentUser, error } = useSelector(state => state.user);

    const user = currentUser._id;
    const school = currentUser.school._id;
    const address = "Complain";

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        user,
        date,
        complaint,
        school,
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!date) {
            newErrors.date = "Date is required";
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate > today) {
                newErrors.date = "Date cannot be in the future";
            }
        }
        
        if (!complaint.trim()) {
            newErrors.complaint = "Complaint description is required";
        } else if (complaint.length < 20) {
            newErrors.complaint = "Complaint should be at least 20 characters";
        } else if (complaint.length > 500) {
            newErrors.complaint = "Complaint should not exceed 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = (event) => {
        event.preventDefault();
        
        if (validateForm()) {
            setLoader(true);
            setIsSubmitted(true);
            dispatch(addStuff(fields, address));
        }
    };

    useEffect(() => {
        if (isSubmitted) {
            if (status === "added") {
                setLoader(false);
                setShowPopup(true);
                setMessage("Complaint submitted successfully!");
                setComplaint("");
                setDate("");
                setIsSubmitted(false);
            }
            else if (error) {
                setLoader(false);
                setShowPopup(true);
                setMessage(error.message || "Network Error");
                setIsSubmitted(false);
            }
        }
    }, [status, error, isSubmitted]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 2
            }}
        >
            <Card
                sx={{
                    maxWidth: 600,
                    width: '100%',
                    boxShadow: 3,
                    borderRadius: 2
                }}
            >
                <CardContent>
                    <Typography 
                        variant="h4" 
                        component="h1"
                        sx={{ 
                            mb: 3,
                            textAlign: 'center',
                            color: 'primary.main',
                            fontWeight: 'bold'
                        }}
                    >
                        Submit Complaint
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error.message || "An error occurred. Please try again."}
                        </Alert>
                    )}

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Date of Complaint"
                                type="date"
                                value={date}
                                onChange={(event) => setDate(event.target.value)}
                                error={!!errors.date}
                                helperText={errors.date}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Complaint Details"
                                variant="outlined"
                                value={complaint}
                                onChange={(event) => {
                                    setComplaint(event.target.value);
                                    if (errors.complaint) {
                                        setErrors({...errors, complaint: ""});
                                    }
                                }}
                                error={!!errors.complaint}
                                helperText={errors.complaint || "Please describe your complaint in detail (20-500 characters)"}
                                required
                                multiline
                                rows={4}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>

                        <BlueButton
                            fullWidth
                            size="large"
                            sx={{ mt: 3, py: 1.5 }}
                            variant="contained"
                            type="submit"
                            disabled={loader}
                        >
                            {loader ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Submit Complaint"
                            )}
                        </BlueButton>
                    </form>
                </CardContent>
            </Card>

            <Popup 
                message={message} 
                setShowPopup={setShowPopup} 
                showPopup={showPopup} 
            />
        </Box>
    );
};

export default StudentComplain;