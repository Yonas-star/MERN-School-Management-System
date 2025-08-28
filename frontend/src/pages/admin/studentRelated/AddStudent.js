import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { 
    CircularProgress, 
    TextField, 
    Button, 
    Typography, 
    Paper, 
    Container, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Box,
    Autocomplete
} from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
}));

const StyledForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    marginTop: theme.spacing(2),
}));

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList, loading: classesLoading } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [className, setClassName] = useState('');
    const [sclassName, setSclassName] = useState('');

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
            // Find the class name from sclassesList if available
            if (sclassesList && sclassesList.length > 0) {
                const selectedClass = sclassesList.find(classItem => classItem._id === params.id);
                if (selectedClass) {
                    setClassName(selectedClass.sclassName);
                }
            }
        }
    }, [params.id, situation, sclassesList]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event, newValue) => {
        if (!newValue) {
            setClassName('');
            setSclassName('');
        } else {
            setClassName(newValue.sclassName);
            setSclassName(newValue._id);
        }
    };

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance };

    const submitHandler = (event) => {
        event.preventDefault();
        if (sclassName === "") {
            setMessage("Please select a class");
            setShowPopup(true);
        }
        else if (!rollNum) {
            setMessage("Please enter a roll number");
            setShowPopup(true);
        }
        else if (!name) {
            setMessage("Please enter student name");
            setShowPopup(true);
        }
        else if (!password) {
            setMessage("Please enter a password");
            setShowPopup(true);
        }
        else {
            setLoader(true);
            dispatch(registerUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
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
    }, [status, navigate, error, response, dispatch]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Button onClick={handleBack} sx={{ mb: 2 }}>Go Back</Button>
            <StyledContainer>
                <StyledPaper elevation={3}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                        Add New Student
                    </Typography>
                    
                    <StyledForm onSubmit={submitHandler}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            required
                        />

                        {situation === "Student" && (
                            <FormControl fullWidth required>
                                {classesLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <Autocomplete
                                        id="class-select"
                                        options={sclassesList || []}
                                        getOptionLabel={(option) => option.sclassName}
                                        value={sclassesList.find(c => c._id === sclassName) || null}
                                        onChange={changeHandler}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                label="Select Class" 
                                                required
                                            />
                                        )}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        noOptionsText="No classes available"
                                    />
                                )}
                            </FormControl>
                        )}

                        {situation === "Class" && (
                            <TextField
                                label="Class"
                                variant="outlined"
                                fullWidth
                                value={className}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        )}

                        <TextField
                            label="Roll Number"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={rollNum}
                            onChange={(event) => setRollNum(event.target.value)}
                            required
                        />

                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            required
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <StyledButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loader}
                                size="large"
                                fullWidth
                            >
                                {loader ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Add Student'
                                )}
                            </StyledButton>
                        </Box>
                    </StyledForm>
                </StyledPaper>
            </StyledContainer>
            
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddStudent;