import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box,
    BottomNavigation, 
    BottomNavigationAction, 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer,
    TableHead, 
    TableRow,
    Typography,
    Skeleton,
    Alert,
    useTheme,
    Card,
    CardContent,
    Grid,
    Chip
} from '@mui/material';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';
import {
    InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon,
    TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon,
    School as SchoolIcon,
    Book as BookIcon,
    EmojiEvents as EmojiEventsIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Calculate as CalculateIcon,
    List as ListIcon,
    Percent as PercentIcon
} from '@mui/icons-material';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { subjectsList, sclassDetails, loading: classLoading } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading: userLoading, response, error } = useSelector((state) => state.user);

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
    }, [dispatch, currentUser?._id]);

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (currentUser?.sclassName?._id && subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser?.sclassName?._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    // Calculate marks statistics
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

    const renderTableSection = () => (
        <>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
                Subject Performance
            </Typography>
            
            {renderMarksSummary()}
            
            <TableContainer component={Paper} elevation={3} sx={{ mb: 8 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Marks Obtained</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks.map((result, index) => {
                            const isPassed = result.marksObtained >= 40;
                            return (
                                <TableRow key={index} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <BookIcon color="primary" sx={{ mr: 1 }} />
                                            {result.subName?.subName || 'N/A'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">{result.marksObtained || 'N/A'}</TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={isPassed ? 'Passed' : 'Failed'} 
                                            color={isPassed ? 'success' : 'error'} 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );

    const renderChartSection = () => (
        <>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
                Performance Visualization
            </Typography>
            
            {renderMarksSummary()}
            
            <Paper elevation={3} sx={{ p: 3, mb: 8 }}>
                <CustomBarChart 
                    chartData={subjectMarks} 
                    dataKey="marksObtained" 
                    nameKey="subName.subName"
                />
            </Paper>
        </>
    );

    const renderClassDetailsSection = () => (
        <Paper elevation={3} sx={{ p: 3, mb: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Class Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h5">
                    Class {sclassDetails?.sclassName || 'N/A'}
                </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Subjects:
            </Typography>
            {subjectsList?.length > 0 ? (
                <Box component="ul" sx={{ pl: 4 }}>
                    {subjectsList.map((subject, index) => (
                        <Box component="li" key={index} sx={{ mb: 1 }}>
                            <Typography variant="body1">
                                <strong>{subject.subName}</strong> ({subject.subCode})
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No subjects found
                </Typography>
            )}
        </Paper>
    );

    const renderLoadingSkeleton = () => (
        <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={400} />
        </Box>
    );

    if (userLoading || classLoading) {
        return renderLoadingSkeleton();
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading data: {error.message || 'Unknown error'}
            </Alert>
        );
    }

    return (
        <Container maxWidth="lg">
            {response && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {response.message}
                </Alert>
            )}

            {subjectMarks?.length > 0 ? (
                <>
                    {selectedSection === 'table' && renderTableSection()}
                    {selectedSection === 'chart' && renderChartSection()}

                    <Paper sx={{ 
                        position: 'fixed', 
                        bottom: 0, 
                        left: 0, 
                        right: 0,
                        zIndex: theme.zIndex.appBar
                    }} elevation={3}>
                        <BottomNavigation 
                            value={selectedSection} 
                            onChange={handleSectionChange}
                            showLabels
                            sx={{
                                bgcolor: theme.palette.background.paper,
                                '& .Mui-selected': {
                                    color: theme.palette.primary.main
                                }
                            }}
                        >
                            <BottomNavigationAction
                                label="Table View"
                                value="table"
                                icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                            />
                            <BottomNavigationAction
                                label="Chart View"
                                value="chart"
                                icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                            />
                        </BottomNavigation>
                    </Paper>
                </>
            ) : (
                renderClassDetailsSection()
            )}
        </Container>
    );
};

export default StudentSubjects;