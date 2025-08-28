import React, { useEffect, useState } from 'react';
import { getTeacherDetails, addTeacherClass, removeTeacherClass  } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Divider,
    Chip,
    Grid,
    Avatar,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SchoolIcon from '@mui/icons-material/School';
import SubjectIcon from '@mui/icons-material/Subject';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);
    const { sclassesList } = useSelector((state) => state.sclass);
    const [errorMessage, setErrorMessage] = useState('');


    const [openAddClassDialog, setOpenAddClassDialog] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [loadingClasses, setLoadingClasses] = useState(false);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    useEffect(() => {
        if (openAddClassDialog) {
            setLoadingClasses(true);
            dispatch(getAllSclasses())
                .then(() => setLoadingClasses(false))
                .catch(() => setLoadingClasses(false));
        }
    }, [openAddClassDialog, dispatch]);

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    const handleAddClass = () => {
        setOpenAddClassDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenAddClassDialog(false);
        setSelectedClass('');
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

// In your TeacherDetails component
const handleSubmitAdditionalClass = () => {
    if (selectedClass) {
        dispatch(addTeacherClass(teacherID, selectedClass))
            .then(() => {
                dispatch(getTeacherDetails(teacherID));
                handleCloseDialog();
            })
            .catch((error) => {
                console.error("Error adding class:", error);
                setErrorMessage(error || 'Failed to add class');
            });
    }
};

const handleRemoveClass = (classId) => {
    dispatch(removeTeacherClass(teacherID, classId))
        .then(() => {
            dispatch(getTeacherDetails(teacherID));
        })
        .catch((error) => {
            console.error("Error removing class:", error);
            setErrorMessage(error || 'Failed to remove class');
        });
};

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (openAddClassDialog) {
            setLoadingClasses(true);
            dispatch(getAllSclasses())
                .then(() => {
                    setLoadingClasses(false);
                    console.log("Fetched Classes: ", sclassesList);
                })
                .catch(() => setLoadingClasses(false));
        }
    }, [openAddClassDialog, dispatch]);
    

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography color="error" variant="h6" align="center">
                    Error loading teacher details. Please try again.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="contained" onClick={handleBack}>
                        Go Back
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Teacher Details
                    </Typography>
                    <Button variant="outlined" onClick={handleBack}>
                        Back to List
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: 48,
                                    bgcolor: 'primary.main',
                                    mb: 2
                                }}
                            >
                                {teacherDetails?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" gutterBottom>
                                {teacherDetails?.name}
                            </Typography>
                            <Chip
                                label="Teacher"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Primary Class Information
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ ml: 3 }}>
                                {teacherDetails?.teachSclass?.sclassName || 'Not assigned'}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Additional Classes
                            </Typography>
                            {teacherDetails?.additionalClasses?.length > 0 ? (
                                <List dense sx={{ ml: 3 }}>
                                    {teacherDetails.additionalClasses.map((classItem) => (
                                        <ListItem 
                                            key={classItem._id}
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => handleRemoveClass(classItem._id)}>
                                                    <CloseIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText primary={classItem.sclassName} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body1" sx={{ ml: 3 }}>
                                    No additional classes assigned
                                </Typography>
                            )}
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddClass}
                                sx={{ mt: 1, ml: 3 }}
                            >
                                Add Class
                            </Button>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                <SubjectIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Subject Information
                            </Typography>
                            {isSubjectNamePresent ? (
                                <Box sx={{ ml: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {teacherDetails?.teachSubject?.subName}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Sessions: {teacherDetails?.teachSubject?.sessions || 'Not specified'}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ ml: 3, mt: 2 }}>
                                    <GreenButton
                                        variant="contained"
                                        onClick={handleAddSubject}
                                        startIcon={<PersonAddAlt1Icon />}
                                        sx={{ px: 3 }}
                                    >
                                        Assign Subject
                                    </GreenButton>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <BlueButton
                        variant="contained"
                        onClick={() => navigate(`/Admin/teachers/teacher/${teacherID}/edit`)}
                        sx={{ mr: 2 }}
                    >
                        Edit Profile
                    </BlueButton>
                </Box>
            </Paper>

            {/* Add Class Dialog */}
            <Dialog open={openAddClassDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Additional Class</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="class-select-label">Select Class</InputLabel>
                        <Select
                            labelId="class-select-label"
                            id="class-select"
                            value={selectedClass}
                            label="Select Class"
                            onChange={handleClassChange}
                            disabled={loadingClasses}
                        >
                            {loadingClasses ? (
                                <MenuItem value="">
                                    <CircularProgress size={24} />
                                </MenuItem>
                            ) : (
                                sclassesList
                                    ?.filter(classItem => 
                                        classItem._id !== teacherDetails?.teachSclass?._id &&
                                        !teacherDetails?.additionalClasses?.some(c => c._id === classItem._id)
                                    )
                                    ?.map((classItem) => (
                                        <MenuItem key={classItem._id} value={classItem._id}>
                                            {classItem.sclassName}
                                        </MenuItem>
                                    ))
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSubmitAdditionalClass} 
                        disabled={!selectedClass || loadingClasses}
                        variant="contained"
                    >
                        Add Class
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TeacherDetails;