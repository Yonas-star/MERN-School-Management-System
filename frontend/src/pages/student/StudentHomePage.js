import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Grid, 
    Paper, 
    Typography, 
    Skeleton,
    Box,
    useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import SubjectIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { styled } from '@mui/material/styles';

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);
    const { subjectsList, loading: subjectsLoading } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [stats, setStats] = useState({
        subjects: 0,
        assignments: 0
    });

    const classID = currentUser?.sclassName?._id;

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
        if (classID) {
            dispatch(getSubjectList(classID, "ClassSubjects"));
        }
    }, [dispatch, currentUser?._id, classID]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectsList) {
            setStats(prev => ({
                ...prev,
                subjects: subjectsList.length,
                // Mock assignments data - replace with real data if available
                assignments: subjectsList.length * 3 
            }));
        }
    }, [subjectsList]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage, color: theme.palette.success.main },
        { name: 'Absent', value: overallAbsentPercentage, color: theme.palette.error.main }
    ];

    const StatCard = ({ icon, title, value, loading }) => (
        <StyledPaper elevation={3}>
            {loading ? (
                <Skeleton variant="circular" width={60} height={60} />
            ) : (
                <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                }}>
                    {icon}
                </Box>
            )}
            <Title variant="h6">{title}</Title>
            {loading ? (
                <Skeleton variant="text" width={60} height={40} />
            ) : (
                <Data 
                    start={0} 
                    end={value} 
                    duration={2.5} 
                    style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: 'bold',
                        color: theme.palette.primary.main
                    }} 
                />
            )}
        </StyledPaper>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <StatCard 
                        icon={<SubjectIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />}
                        title="Total Subjects"
                        value={stats.subjects}
                        loading={subjectsLoading}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <StatCard 
                        icon={<AssignmentIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />}
                        title="Total Assignments"
                        value={stats.assignments}
                        loading={subjectsLoading}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <ChartContainer elevation={3}>
                        {loading ? (
                            <>
                                <Skeleton variant="circular" width={150} height={150} />
                                <Skeleton variant="text" width={100} sx={{ mt: 2 }} />
                            </>
                        ) : error ? (
                            <Typography color="error" variant="h6">
                                Error loading attendance
                            </Typography>
                        ) : response || !subjectAttendance?.length ? (
                            <Typography variant="h6">No Attendance Data</Typography>
                        ) : (
                            <>
                                <CustomPieChart data={chartData} />
                                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                    Overall Attendance: {overallAttendancePercentage.toFixed(1)}%
                                </Typography>
                            </>
                        )}
                    </ChartContainer>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ 
                        p: 3, 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: theme.shadows[3]
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Notices
                        </Typography>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius,
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6]
    }
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius
}));

const Title = styled(Typography)({
    marginBottom: 8,
    fontWeight: 500
});

const Data = styled(CountUp)(({ theme }) => ({
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main
}));

export default StudentHomePage;