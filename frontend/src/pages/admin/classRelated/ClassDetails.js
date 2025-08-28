import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton, Avatar, Card, CardContent,
    Stack, Divider, Tooltip, Button, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, BottomNavigation,
    BottomNavigationAction
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import {
    PersonAddAlt1 as PersonAddAlt1Icon,
    PersonRemove as PersonRemoveIcon,
    Delete as DeleteIcon,
    PostAdd as PostAddIcon,
    School as SchoolIcon,
    Book as BookIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon,
    InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon
} from '@mui/icons-material';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import { styled } from '@mui/material/styles';

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    minWidth: 0,
    marginRight: theme.spacing(2),
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontWeight: 600,
    letterSpacing: '0.3px',
    marginLeft: theme.spacing(1),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ClassDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);

    const classID = params.id;
    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };
    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    if (error) {
        console.log(error);
    }

    const [value, setValue] = useState('1');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedSection, setSelectedSection] = useState('table');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList?.length || 0;
        const numberOfStudents = sclassStudents?.length || 0;

        return (
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56 }}>
                            <SchoolIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                Class {sclassDetails?.sclassName}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Detailed information and statistics
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Subjects
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {numberOfSubjects}
                            </Typography>
                        </Card>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Students
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {numberOfStudents}
                            </Typography>
                        </Card>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        {getresponse && (
                            <ActionButton
                                variant="contained"
                                color="success"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                startIcon={<PersonAddAlt1Icon />}
                            >
                                Add Students
                            </ActionButton>
                        )}
                        {response && (
                            <ActionButton
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/Admin/addsubject/" + classID)}
                                startIcon={<PostAddIcon />}
                            >
                                Add Subjects
                            </ActionButton>
                        )}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    const renderSubjectsTable = () => {
        return (
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                            <BookIcon />
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold">
                            Subjects
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {subjectsList?.length || 0} subjects
                        </Typography>
                    </Stack>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <TableCell>Subject Name</TableCell>
                                    <TableCell>Subject Code</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {subjectsList?.map((subject) => (
                                    <StyledTableRow key={subject._id}>
                                        <TableCell>{subject.subName}</TableCell>
                                        <TableCell>{subject.subCode}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Delete Subject">
                                                    <IconButton 
                                                        onClick={() => deleteHandler(subject._id, "Subject")}
                                                        sx={{ 
                                                            bgcolor: 'error.light', 
                                                            color: 'error.main',
                                                            '&:hover': { bgcolor: 'error.main', color: 'white' }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <ActionButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => navigate(`/Admin/class/subject/${classID}/${subject._id}`)}
                                                    startIcon={<PersonIcon fontSize="small" />}
                                                >
                                                    View
                                                </ActionButton>
                                            </Stack>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        );
    };

    const renderStudentsTable = () => {
        return (
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                            <PeopleIcon />
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold">
                            Students
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {sclassStudents?.length || 0} students
                        </Typography>
                    </Stack>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Roll Number</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {sclassStudents?.map((student) => (
                                    <StyledTableRow key={student._id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.rollNum}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Remove Student">
                                                    <IconButton 
                                                        onClick={() => deleteHandler(student._id, "Student")}
                                                        sx={{ 
                                                            bgcolor: 'error.light', 
                                                            color: 'error.main',
                                                            '&:hover': { bgcolor: 'error.main', color: 'white' }
                                                        }}
                                                    >
                                                        <PersonRemoveIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <ActionButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => navigate("/Admin/students/student/" + student._id)}
                                                    startIcon={<PersonIcon fontSize="small" />}
                                                >
                                                    View
                                                </ActionButton>
                                                <ActionButton
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => navigate("/Admin/students/student/attendance/" + student._id)}
                                                    startIcon={<PostAddIcon fontSize="small" />}
                                                >
                                                    Attendance
                                                </ActionButton>
                                            </Stack>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        );
    };

    const ClassSubjectsSection = () => {
        return (
            <Box sx={{ mt: 3 }}>
                {response ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ActionButton
                            variant="contained"
                            color="success"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                            startIcon={<PostAddIcon />}
                        >
                            Add Subjects
                        </ActionButton>
                    </Box>
                ) : (
                    <>
                        {selectedSection === 'table' && renderSubjectsTable()}
                        <SpeedDialTemplate actions={[
                            {
                                icon: <PostAddIcon sx={{ color: 'white' }} />,
                                name: 'Add New Subject',
                                action: () => navigate("/Admin/addsubject/" + classID),
                                fabProps: {
                                    sx: { bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }
                                }
                            },
                            {
                                icon: <DeleteIcon sx={{ color: 'white' }} />,
                                name: 'Delete All Subjects',
                                action: () => deleteHandler(classID, "SubjectsClass"),
                                fabProps: {
                                    sx: { bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }
                                }
                            }
                        ]} />
                    </>
                )}
            </Box>
        );
    };

    const ClassStudentsSection = () => {
        return (
            <Box sx={{ mt: 3 }}>
                {getresponse ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ActionButton
                            variant="contained"
                            color="success"
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            startIcon={<PersonAddAlt1Icon />}
                        >
                            Add Students
                        </ActionButton>
                    </Box>
                ) : (
                    <>
                        {selectedSection === 'table' && renderStudentsTable()}
                        <SpeedDialTemplate actions={[
                            {
                                icon: <PersonAddAlt1Icon sx={{ color: 'white' }} />,
                                name: 'Add New Student',
                                action: () => navigate("/Admin/class/addstudents/" + classID),
                                fabProps: {
                                    sx: { bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }
                                }
                            },
                            {
                                icon: <PersonRemoveIcon sx={{ color: 'white' }} />,
                                name: 'Delete All Students',
                                action: () => deleteHandler(classID, "StudentsClass"),
                                fabProps: {
                                    sx: { bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }
                                }
                            }
                        ]} />
                    </>
                )}
            </Box>
        );
    };

    const ClassTeachersSection = () => {
        return (
            <Box sx={{ mt: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                        <PersonIcon />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                        Teachers
                    </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                    Teacher management coming soon
                </Typography>
            </Box>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (
              
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Button onClick={handleBack}>Go Back</Button>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 2 }}>
                            <TabList onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                <StyledTab label="Overview" value="1" icon={<SchoolIcon fontSize="small" />} />
                                <StyledTab label="Subjects" value="2" icon={<BookIcon fontSize="small" />} />
                                <StyledTab label="Students" value="3" icon={<PeopleIcon fontSize="small" />} />
                                <StyledTab label="Teachers" value="4" icon={<PersonIcon fontSize="small" />} />
                            </TabList>
                        </Box>

                        <Box sx={{ pt: 3 }}>
                            <TabPanel value="1">
                                <ClassDetailsSection />
                            </TabPanel>
                            <TabPanel value="2">
                                <ClassSubjectsSection />
                            </TabPanel>
                            <TabPanel value="3">
                                <ClassStudentsSection />
                            </TabPanel>
                            <TabPanel value="4">
                                <ClassTeachersSection />
                            </TabPanel>
                        </Box>
                    </TabContext>
                </Box>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ClassDetails;