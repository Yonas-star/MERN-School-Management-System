import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box, Button, Collapse, IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction,
    Container, Card, CardContent, Stack, Divider, Tooltip, Avatar, CircularProgress,Alert,useTheme, Grid, Chip
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
    KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon,
    School as SchoolIcon, Person as PersonIcon, TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon, InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon, Edit as EditIcon, Calculate as CalculateIcon,
    Percent as PercentIcon,  TrendingUp as TrendingUpIcon,
        TrendingDown as TrendingDownIcon, EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import Popup from '../../../components/Popup';
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

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response); }
    else if (error) { console.log(error); }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState('1');
    const [selectedSection, setSelectedSection] = useState('table');

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === ""
        ? { name, rollNum }
        : { name, rollNum, password };

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, studentID, address))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            });
    };

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            });
    };

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                                <PersonIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold">
                                Attendance Details
                            </Typography>
                        </Stack>
                        
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Present</TableCell>
                                        <TableCell>Total Sessions</TableCell>
                                        <TableCell>Attendance %</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </StyledTableRow>
                                </TableHead>
                                {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                    return (
                                        <TableBody key={index}>
                                            <StyledTableRow>
                                                <TableCell>{subName}</TableCell>
                                                <TableCell>{present}</TableCell>
                                                <TableCell>{sessions}</TableCell>
                                                <TableCell>{subjectAttendancePercentage}%</TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <ActionButton
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleOpen(subId)}
                                                            startIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                        >
                                                            Details
                                                        </ActionButton>
                                                        <Tooltip title="Delete Attendance">
                                                            <IconButton 
                                                                onClick={() => removeSubAttendance(subId)}
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
                                                            color="secondary"
                                                            onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}
                                                        >
                                                            Change
                                                        </ActionButton>
                                                    </Stack>
                                                </TableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                    <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Attendance History
                                                            </Typography>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <StyledTableRow>
                                                                        <TableCell>Date</TableCell>
                                                                        <TableCell align="right">Status</TableCell>
                                                                    </StyledTableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {allData.map((data, index) => {
                                                                        const date = new Date(data.date);
                                                                        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                        return (
                                                                            <StyledTableRow key={index}>
                                                                                <TableCell component="th" scope="row">
                                                                                    {dateString}
                                                                                </TableCell>
                                                                                <TableCell align="right">{data.status}</TableCell>
                                                                            </StyledTableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    );
                                })}
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <ActionButton
                                variant="contained"
                                color="error"
                                onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
                                startIcon={<DeleteIcon />}
                            >
                                Delete All
                            </ActionButton>
                            <ActionButton
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}
                            >
                                Add Attendance
                            </ActionButton>
                        </Stack>
                    </CardContent>
                </Card>
            );
        };

        const renderChartSection = () => {
            return (
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Attendance Visualization
                        </Typography>
                        <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                    </CardContent>
                </Card>
            );
        };

        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                ) : (
                    <ActionButton
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}
                        sx={{ mt: 2 }}
                    >
                        Add Attendance
                    </ActionButton>
                )}
            </>
        );
    };

    const StudentMarksSection = () => {
        // Calculate marks summary
        const calculateMarksSummary = () => {
            if (!subjectMarks || !Array.isArray(subjectMarks) || subjectMarks.length === 0) {
                return {
                    total: 0,
                    average: 0,
                    count: 0,
                    highestMark: 0,
                    lowestMark: 0,
                    passedSubjects: 0,
                    passPercentage: 0
                };
            }

            const validMarks = subjectMarks.filter(result => 
                result.marksObtained !== undefined && result.marksObtained !== null
            );

            if (validMarks.length === 0) {
                return {
                    total: 0,
                    average: 0,
                    count: 0,
                    highestMark: 0,
                    lowestMark: 0,
                    passedSubjects: 0,
                    passPercentage: 0
                };
            }

            const total = validMarks.reduce((sum, result) => sum + result.marksObtained, 0);
            const average = total / validMarks.length;
            const highestMark = Math.max(...validMarks.map(result => result.marksObtained));
            const lowestMark = Math.min(...validMarks.map(result => result.marksObtained));
            const passedSubjects = validMarks.filter(result => result.marksObtained >= 50).length;
            const passPercentage = (passedSubjects / validMarks.length) * 100;

            return {
                total,
                average,
                count: validMarks.length,
                highestMark,
                lowestMark,
                passedSubjects,
                passPercentage
            };
        };
        const calculateMarksStats = () => {
            if (!subjectMarks || subjectMarks.length === 0) {
                return {
                    total: 0,
                    average: 0,
                    highest: 0,
                    lowest: 0,
                    passedCount: 0,
                    passPercentage: 0,
                    subjectCount: 0
                };
            }
    
            const validMarks = subjectMarks.filter(mark => 
                mark.marksObtained !== undefined && mark.marksObtained !== null
            );
    
            if (validMarks.length === 0) {
                return {
                    total: 0,
                    average: 0,
                    highest: 0,
                    lowest: 0,
                    passedCount: 0,
                    passPercentage: 0,
                    subjectCount: 0
                };
            }
    
            const total = validMarks.reduce((sum, mark) => sum + mark.marksObtained, 0);
            const average = total / validMarks.length;
            const highest = Math.max(...validMarks.map(mark => mark.marksObtained));
            const lowest = Math.min(...validMarks.map(mark => mark.marksObtained));
            const passedCount = validMarks.filter(mark => mark.marksObtained >= 50).length;
            const passPercentage = (passedCount / validMarks.length) * 100;
    
            return {
                total,
                average,
                highest,
                lowest,
                passedCount,
                passPercentage,
                subjectCount: validMarks.length
            };
        };
        const marksStats = calculateMarksStats();
        const marksSummary = calculateMarksSummary();

            const renderMarksSummary = () => (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <CalculateIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Total Marks</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {marksStats.total.toFixed(2)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Across {marksStats.subjectCount} subjects
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Average Marks</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color={marksStats.average >= 50 ? 'success.main' : 'error.main'}>
                                    {marksStats.average.toFixed(2)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Class performance indicator
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <PercentIcon color="info" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Pass Percentage</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {marksStats.passPercentage.toFixed(2)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {marksStats.passedCount} of {marksStats.subjectCount} subjects passed
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <EmojiEventsIcon color="warning" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Highest Mark</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {marksStats.highest.toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Lowest Mark</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {marksStats.lowest.toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            );

        const renderTableSection = () => {
            return (
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                                <SchoolIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold">
                                Exam Results
                            </Typography>
                        </Stack>

                        {renderMarksSummary()}

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Marks Obtained</TableCell>
                                        <TableCell>Status</TableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {subjectMarks.map((result, index) => {
                                        if (!result.subName || !result.marksObtained) {
                                            return null;
                                        }
                                        const isPassed = result.marksObtained >= 50;
                                        return (
                                            <StyledTableRow key={index}>
                                                <TableCell>{result.subName.subName}</TableCell>
                                                <TableCell>{result.marksObtained}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ 
                                                        display: 'inline-block',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        bgcolor: isPassed ? 'success.light' : 'error.light',
                                                        color: isPassed ? 'success.dark' : 'error.dark',
                                                        fontWeight: 600
                                                    }}>
                                                        {isPassed ? 'Passed' : 'Failed'}
                                                    </Box>
                                                </TableCell>
                                            </StyledTableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <ActionButton
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/Admin/students/student/marks/" + studentID)}
                            sx={{ mt: 2 }}
                        >
                            Add Marks
                        </ActionButton>
                    </CardContent>
                </Card>
            );
        };

        const renderChartSection = () => {
            return (
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Marks Visualization
                        </Typography>
                        <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                        
                        {/* Display marks summary in chart section */}
                        {marksSummary.count > 0 && (
                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                                gap: 2, 
                                mt: 3 
                            }}>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Average Marks
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {marksSummary.average.toFixed(2)}
                                    </Typography>
                                </Card>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Pass Percentage
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color={marksSummary.passPercentage >= 50 ? 'success.main' : 'error.main'}>
                                        {marksSummary.passPercentage.toFixed(2)}%
                                    </Typography>
                                </Card>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            );
        };

        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                ) : (
                    <ActionButton
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/Admin/students/student/marks/" + studentID)}
                        sx={{ mt: 2 }}
                    >
                        Add Marks
                    </ActionButton>
                )}
            </>
        );
    };

    const StudentDetailsSection = () => {
        return (
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56 }}>
                            <PersonIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                {userDetails.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Student Details
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Roll Number
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {userDetails.rollNum}
                            </Typography>
                        </Card>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Class
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {sclassName.sclassName}
                            </Typography>
                        </Card>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                School
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {studentSchool.schoolName}
                            </Typography>
                        </Card>
                    </Box>

                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Overall Attendance
                            </Typography>
                            <CustomPieChart data={chartData} />
                        </Box>
                    )}

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <ActionButton
                            variant="contained"
                            color="error"
                            onClick={deleteHandler}
                            startIcon={<DeleteIcon />}
                        >
                            Delete Student
                        </ActionButton>
                        <ActionButton
                            variant="contained"
                            color="primary"
                            onClick={() => setShowTab(!showTab)}
                            startIcon={<EditIcon />}
                        >
                            {showTab ? 'Hide Editor' : 'Edit Details'}
                        </ActionButton>
                    </Stack>

                    <Collapse in={showTab} timeout="auto" unmountOnExit>
                        <Card variant="outlined" sx={{ mt: 3 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Edit Student Details
                                </Typography>
                                <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="subtitle1">Name</Typography>
                                            <input
                                                type="text"
                                                placeholder="Enter student's name..."
                                                value={name}
                                                onChange={(event) => setName(event.target.value)}
                                                autoComplete="name"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1">Roll Number</Typography>
                                            <input
                                                type="number"
                                                placeholder="Enter roll number..."
                                                value={rollNum}
                                                onChange={(event) => setRollNum(event.target.value)}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1">Password</Typography>
                                            <input
                                                type="password"
                                                placeholder="Enter new password..."
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                autoComplete="new-password"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </Box>
                                        <ActionButton
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Update Details
                                        </ActionButton>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Collapse>
                </CardContent>
            </Card>
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
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 2 }}>
                            <TabList onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                <StyledTab label="Details" value="1" icon={<PersonIcon fontSize="small" />} />
                                <StyledTab label="Attendance" value="2" icon={<TableChartIcon fontSize="small" />} />
                                <StyledTab label="Marks" value="3" icon={<SchoolIcon fontSize="small" />} />
                            </TabList>
                        </Box>

                        <Box sx={{ pt: 3 }}>
                            <TabPanel value="1">
                                <StudentDetailsSection />
                            </TabPanel>
                            <TabPanel value="2">
                                <StudentAttendanceSection />
                            </TabPanel>
                            <TabPanel value="3">
                                <StudentMarksSection />
                            </TabPanel>
                        </Box>
                    </TabContext>
                </Box>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ViewStudent;