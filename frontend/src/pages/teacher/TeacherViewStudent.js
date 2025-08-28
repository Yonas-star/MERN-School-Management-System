import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Skeleton,
    Alert,
    useTheme,
    Container,
    Stack,
    Divider,
    Grid,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    Person as PersonIcon,
    School as SchoolIcon,
    Class as ClassIcon,
    Assignment as AssignmentIcon,
    Add as AddIcon,
    EmojiEvents as EmojiEventsIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Calculate as CalculateIcon,
    Percent as PercentIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject
} from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { PurpleButton } from '../../components/buttonStyles';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { currentUser, userDetails, loading, error, response } = useSelector((state) => state.user);
    const studentID = params.id;
    const teachSubject = currentUser?.teachSubject?.subName;
    const teachSubjectID = currentUser?.teachSubject?._id;

    const [openStates, setOpenStates] = useState({});
    const [studentData, setStudentData] = useState({
        sclassName: '',
        school: '',
        marks: [],
        attendance: []
    });

    useEffect(() => {
        dispatch(getUserDetails(studentID, "Student"));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails) {
            setStudentData({
                sclassName: userDetails.sclassName || '',
                school: userDetails.school || '',
                marks: userDetails.examResult || [],
                attendance: userDetails.attendance || []
            });
        }
    }, [userDetails]);

    const handleOpen = (subId) => {
        setOpenStates(prev => ({
            ...prev,
            [subId]: !prev[subId]
        }));
    };

    const calculateMarksStats = () => {
        if (!studentData.marks || studentData.marks.length === 0) {
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

        const validMarks = studentData.marks.filter(mark =>
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
        const passedCount = validMarks.filter(mark => mark.marksObtained >= 40).length;
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
    const attendanceBySubject = groupAttendanceBySubject(studentData.attendance);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(studentData.attendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage, color: theme.palette.success.main },
        { name: 'Absent', value: overallAbsentPercentage, color: theme.palette.error.main }
    ];

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
                            <TrendingUpIcon color={marksStats.average >= 50 ? 'success' : 'error'} sx={{ mr: 1 }} />
                            <Typography variant="h6">Average Marks</Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color={marksStats.average >= 50 ? 'success.main' : 'error.main'}>
                            {marksStats.average.toFixed(2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <PercentIcon color={marksStats.passPercentage >= 50 ? 'success' : 'error'} sx={{ mr: 1 }} />
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

    const renderStudentInfo = () => (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
                Student Information
            </Typography>
            <Stack spacing={1}>
                <Box display="flex" alignItems="center">
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography><strong>Name:</strong> {userDetails?.name || 'N/A'}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography><strong>Roll Number:</strong> {userDetails?.rollNum || 'N/A'}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <ClassIcon color="primary" sx={{ mr: 1 }} />
                    <Typography><strong>Class:</strong> {studentData.sclassName?.sclassName || 'N/A'}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography><strong>School:</strong> {studentData.school?.schoolName || 'N/A'}</Typography>
                </Box>
            </Stack>
        </Paper>
    );

    const renderAttendanceSection = () => {
        const subjectAttendance = Object.entries(attendanceBySubject).find(
            ([subName]) => subName === teachSubject
        );

        if (!subjectAttendance) return null;

        const [subName, { present, allData, subId, sessions }] = subjectAttendance;
        const percentage = calculateSubjectAttendancePercentage(present, sessions);

        return (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4">Attendance</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                    >
                        Add Attendance
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Present</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Total</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Percentage</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow hover>
                                <TableCell>{subName}</TableCell>
                                <TableCell align="center">{present}</TableCell>
                                <TableCell align="center">{sessions}</TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ color: percentage >= 75 ? 'success.main' : 'error.main' }}
                                >
                                    {percentage}%
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleOpen(subId)}
                                        endIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                    >
                                        Details
                                    </Button>
                                </TableCell>
                            </StyledTableRow>
                            <TableRow>
                                <TableCell style={{ padding: 0 }} colSpan={5}>
                                    <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 1 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Detailed Attendance for {subName}
                                            </Typography>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell align="right">Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {allData.map((data, idx) => {
                                                        const date = new Date(data.date);
                                                        const dateString = date.toString() !== "Invalid Date"
                                                            ? date.toLocaleDateString()
                                                            : "Invalid Date";
                                                        return (
                                                            <TableRow key={idx}>
                                                                <TableCell>{dateString}</TableCell>
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{
                                                                        color: data.status === 'Present'
                                                                            ? 'success.main'
                                                                            : 'error.main'
                                                                    }}
                                                                >
                                                                    {data.status}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box mt={3}>
                    <Typography variant="h6">
                        Overall Attendance: {overallAttendancePercentage.toFixed(1)}%
                    </Typography>
                    <Box height={300} mt={2}>
                        <CustomPieChart data={chartData} />
                    </Box>
                </Box>
            </Paper>
        );
    };

    const renderMarksSection = () => {
        const subjectMark = studentData.marks.find(
            result => result.subName?.subName === teachSubject
        );

        return (
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4">Subject Marks</Typography>
                    <PurpleButton
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                    >
                        Add Marks
                    </PurpleButton>
                </Box>

                {studentData.marks.length > 0 && renderMarksSummary()}

                {subjectMark ? (
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Marks Obtained</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <StyledTableRow hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                                            {subjectMark.subName.subName}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        Assignment: {subjectMark.marks.assignment}<br />
                                        Attendance: {subjectMark.marks.attendance}<br />
                                        Mid Exam: {subjectMark.marks.midExam}<br />
                                        Final Exam: {subjectMark.marks.finalExam}<br />
                                        <strong>Total: {subjectMark.totalWeightedMark.toFixed(2)}</strong>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={subjectMark.marksObtained >= 40 ? 'Passed' : 'Failed'}
                                            color={subjectMark.marksObtained >= 40 ? 'success' : 'error'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography color="text.secondary">
                        No marks recorded for {teachSubject}
                    </Typography>
                )}
            </Paper>
        );
    };

    const renderLoadingSkeleton = () => (
        <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={150} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={200} />
        </Box>
    );

    if (loading) {
        return renderLoadingSkeleton();
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 3 }}>
                Error loading student data: {error.message || 'Unknown error'}
            </Alert>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {response && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    {response.message}
                </Alert>
            )}

            {renderStudentInfo()}
            {renderAttendanceSection()}
            {renderMarksSection()}
        </Container>
    );
};

export default TeacherViewStudent;