import React, { useEffect, useState } from "react";
import { 
    Button, TextField, Grid, Box, Typography, 
    CircularProgress, Card, CardContent, Stack,
    IconButton, Divider, Tooltip
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "0" }]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id;
    const adminID = currentUser._id;
    const address = "Subject";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const validateField = (name, value, index) => {
        let error = "";
        
        if (name === "subName" && !value.trim()) {
            error = "Subject name is required";
        } 
        else if (name === "subCode" && !value.trim()) {
            error = "Subject code is required";
        }
        else if (name === "sessions" && (isNaN(value) || value < 0)) {
            error = "Must be a positive number";
        }

        return error;
    };

    const handleChange = (index) => (event) => {
        const { name, value } = event.target;
        const newSubjects = [...subjects];
        newSubjects[index][name] = value;
        setSubjects(newSubjects);

        // Validate the changed field
        const error = validateField(name, value, index);
        setErrors({
            ...errors,
            [`${name}_${index}`]: error
        });
    };

    const handleBlur = (index) => (event) => {
        const { name } = event.target;
        setTouched({
            ...touched,
            [`${name}_${index}`]: true
        });
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "0" }]);
    };

    const handleRemoveSubject = (index) => () => {
        if (subjects.length > 1) {
            const newSubjects = [...subjects];
            newSubjects.splice(index, 1);
            setSubjects(newSubjects);

            // Clean up errors for removed field
            const newErrors = { ...errors };
            Object.keys(newErrors).forEach(key => {
                if (key.endsWith(`_${index}`)) {
                    delete newErrors[key];
                }
            });
            setErrors(newErrors);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        subjects.forEach((subject, index) => {
            const fields = ['subName', 'subCode', 'sessions'];
            fields.forEach(field => {
                const error = validateField(field, subject[field], index);
                if (error) {
                    newErrors[`${field}_${index}`] = error;
                    isValid = false;
                }
            });
        });

        setErrors(newErrors);
        return isValid;
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName.trim(),
            subCode: subject.subCode.trim(),
            sessions: parseInt(subject.sessions) || 0,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        
        if (validateForm()) {
            setLoader(true);
            dispatch(addStuff(fields, address));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
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
    }, [status, navigate, error, response, dispatch]);

    const hasError = (field, index) => {
        return touched[`${field}_${index}`] && errors[`${field}_${index}`];
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3, p: 3 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Add New Subjects
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={submitHandler}>
                    {subjects.map((subject, index) => (
                        <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Subject {index + 1}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Subject Name"
                                        name="subName"
                                        variant="outlined"
                                        value={subject.subName}
                                        onChange={handleChange(index)}
                                        onBlur={handleBlur(index)}
                                        error={hasError('subName', index)}
                                        helperText={hasError('subName', index) && errors[`subName_${index}`]}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Subject Code"
                                        name="subCode"
                                        variant="outlined"
                                        value={subject.subCode}
                                        onChange={handleChange(index)}
                                        onBlur={handleBlur(index)}
                                        error={hasError('subCode', index)}
                                        helperText={hasError('subCode', index) && errors[`subCode_${index}`]}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Sessions"
                                        name="sessions"
                                        type="number"
                                        variant="outlined"
                                        inputProps={{ min: 0 }}
                                        value={subject.sessions}
                                        onChange={handleChange(index)}
                                        onBlur={handleBlur(index)}
                                        error={hasError('sessions', index)}
                                        helperText={hasError('sessions', index) && errors[`sessions_${index}`]}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                    {index === 0 ? (
                                        <Tooltip title="Add another subject">
                                            <IconButton color="primary" onClick={handleAddSubject}>
                                                <AddCircleOutline fontSize="large" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Remove this subject">
                                            <IconButton color="error" onClick={handleRemoveSubject(index)}>
                                                <RemoveCircleOutline fontSize="large" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit" 
                            disabled={loader}
                            sx={{ minWidth: 120 }}
                        >
                            {loader ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Save Subjects'
                            )}
                        </Button>
                    </Box>
                </form>

                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </CardContent>
        </Card>
    );
};

export default SubjectForm;