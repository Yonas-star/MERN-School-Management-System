import { 
    Container, 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    Skeleton,
    useTheme,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import { 
    People as PeopleIcon,
    MenuBook as LessonsIcon,
    Assignment as TestsIcon,
    Schedule as TimeIcon
} from '@mui/icons-material';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents, loading, error } = useSelector((state) => state.sclass);

    const classID = currentUser?.teachSclass?._id;
    const subjectID = currentUser?.teachSubject?._id;
    const [stats, setStats] = useState({
        students: 0,
        lessons: 0,
        tests: 0,
        hours: 0
    });

    useEffect(() => {
        if (subjectID && classID) {
            dispatch(getSubjectDetails(subjectID, "Subject"));
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, subjectID, classID]);

    useEffect(() => {
        setStats({
            students: sclassStudents?.length || 0,
            lessons: subjectDetails?.sessions || 0,
            tests: 24, // Mock data - replace with actual API call if available
            hours: 30  // Mock data - replace with actual API call if available
        });
    }, [sclassStudents, subjectDetails]);

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
            <Typography variant="h6" component="h3" gutterBottom>
                {title}
            </Typography>
            {loading ? (
                <Skeleton variant="text" width={60} height={40} />
            ) : (
                <CountUp 
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

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading dashboard data: {error.message || 'Unknown error'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <StatCard 
                        icon={<PeopleIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />}
                        title="Class Students"
                        value={stats.students}
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <StatCard 
                        icon={<LessonsIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />}
                        title="Total Lessons"
                        value={stats.lessons}
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <StatCard 
                        icon={<TestsIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />}
                        title="Tests Taken"
                        value={stats.tests}
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <StatCard 
                        icon={<TimeIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />}
                        title="Total Hours"
                        value={stats.hours}
                        loading={loading}
                        suffix="hrs"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Paper 
                        elevation={3}
                        sx={{ 
                            p: 3, 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Recent Notices
                        </Typography>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

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

export default TeacherHomePage;