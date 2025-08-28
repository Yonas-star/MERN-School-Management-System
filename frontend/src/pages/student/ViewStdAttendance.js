import React, { useEffect, useState } from 'react';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp,
    InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon,
    TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Box, 
    Button, 
    Collapse, 
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
    styled
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { 
    calculateOverallAttendancePercentage, 
    calculateSubjectAttendancePercentage, 
    groupAttendanceBySubject 
} from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ViewStdAttendance = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    const [openStates, setOpenStates] = useState({});
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
    }, [dispatch, currentUser?._id]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const handleOpen = (subId) => {
        setOpenStates((prev) => ({
            ...prev,
            [subId]: !prev[subId],
        }));
    };

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => ({
        subject: subName,
        attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
        totalClasses: sessions,
        attendedClasses: present
    }));

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <TableContainer component={Paper} elevation={3} sx={{ mb: 8 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ p: 2 }}>
                Attendance Overview
            </Typography>
            <Typography variant="h6" align="center" gutterBottom sx={{ mb: 2 }}>
                Overall Attendance: {overallAttendancePercentage.toFixed(1)}%
            </Typography>
            
            <Table>
                <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Present</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Total Sessions</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Attendance %</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Details</TableCell>
                    </TableRow>
                </TableHead>
                
                {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                    const percentage = calculateSubjectAttendancePercentage(present, sessions);
                    return (
                        <React.Fragment key={index}>
                            <StyledTableRow hover>
                                <TableCell>{subName}</TableCell>
                                <TableCell align="center">{present}</TableCell>
                                <TableCell align="center">{sessions}</TableCell>
                                <TableCell align="center" sx={{ color: percentage >= 75 ? 'success.main' : 'error.main' }}>
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
                                                                <TableCell align="right" sx={{ 
                                                                    color: data.status === 'Present' 
                                                                        ? 'success.main' 
                                                                        : 'error.main'
                                                                }}>
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
                        </React.Fragment>
                    );
                })}
            </Table>
        </TableContainer>
    );

    const renderChartSection = () => (
        <Paper elevation={3} sx={{ p: 3, mb: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Attendance Visualization
            </Typography>
            <CustomBarChart 
                chartData={subjectData} 
                dataKey="attendancePercentage" 
                nameKey="subject"
            />
        </Paper>
    );

    const renderLoadingSkeleton = () => (
        <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={400} />
        </Box>
    );

    const renderNoData = () => (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
                No Attendance Records Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Your attendance details will appear here once available.
            </Typography>
        </Paper>
    );

    if (loading) {
        return renderLoadingSkeleton();
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading attendance data: {error.message || 'Unknown error'}
            </Alert>
        );
    }

    return (
        <Box sx={{ pb: 7 }}>
            {response && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {response.message}
                </Alert>
            )}

            {subjectAttendance?.length > 0 ? (
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
                renderNoData()
            )}
        </Box>
    );
};

export default ViewStdAttendance;