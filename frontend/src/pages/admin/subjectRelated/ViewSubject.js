import React, { useEffect, useState } from 'react';
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Tab, Container, Typography, BottomNavigation,
    BottomNavigationAction, Paper, Card, CardContent,
    Stack, Avatar, Divider, CircularProgress, Table,
    TableBody, TableCell, TableContainer, TableHead,
    TableRow, Tooltip, Button
} from '@mui/material';
import {
    InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon,
    TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Book as BookIcon,
    Visibility as ViewIcon,
    Assignment as AttendanceIcon,
    Grade as MarksIcon
} from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
      border: 0,
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

const ViewSubject = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

    const { classID, subjectID } = params;

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    if (error) {
        console.log(error);
    }

    const [value, setValue] = useState('1');
    const [selectedSection, setSelectedSection] = useState('attendance');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const studentColumns = [
        { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'actions', label: 'Actions', minWidth: 300, align: 'right' },
    ];

    const studentRows = sclassStudents?.map((student) => ({
        rollNum: student.rollNum,
        name: student.name,
        id: student._id,
    })) || [];

    const StudentsAttendanceButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Tooltip title="View Student">
                    <ActionButton
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/Admin/students/student/" + row.id)}
                        startIcon={<ViewIcon />}
                    >
                        View
                    </ActionButton>
                </Tooltip>
                <Tooltip title="Take Attendance">
                    <ActionButton
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}
                        startIcon={<AttendanceIcon />}
                    >
                        Attendance
                    </ActionButton>
                </Tooltip>
            </Stack>
        );
    };

    const StudentsMarksButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Tooltip title="View Student">
                    <ActionButton
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/Admin/students/student/" + row.id)}
                        startIcon={<ViewIcon />}
                    >
                        View
                    </ActionButton>
                </Tooltip>
                <Tooltip title="Provide Marks">
                    <ActionButton
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}
                        startIcon={<MarksIcon />}
                    >
                        Marks
                    </ActionButton>
                </Tooltip>
            </Stack>
        );
    };

    const renderStudentsTable = (buttonHaver) => {
        return (
            <TableContainer component={Paper} sx={{ borderRadius: '8px', mb: 3 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {studentColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentRows.map((row) => (
                            <StyledTableRow hover key={row.id}>
                                <TableCell>{row.rollNum}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="right">
                                    {buttonHaver({ row })}
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const SubjectStudentsSection = () => {
        return (
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                            <PersonIcon />
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold">
                            Students
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {sclassStudents?.length || 0} students
                        </Typography>
                    </Stack>

                    {getresponse ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <ActionButton
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                startIcon={<PersonIcon />}
                            >
                                Add Students
                            </ActionButton>
                        </Box>
                    ) : (
                        <>
                            {selectedSection === 'attendance' && renderStudentsTable(StudentsAttendanceButtonHaver)}
                            {selectedSection === 'marks' && renderStudentsTable(StudentsMarksButtonHaver)}

                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Attendance"
                                        value="attendance"
                                        icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Marks"
                                        value="marks"
                                        icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };

    const SubjectDetailsSection = () => {
        const numberOfStudents = sclassStudents?.length || 0;

        return (
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56 }}>
                            <BookIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                {subjectDetails?.subName}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Subject Details
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Subject Code
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {subjectDetails?.subCode}
                            </Typography>
                        </Card>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Sessions
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {subjectDetails?.sessions}
                            </Typography>
                        </Card>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Class
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {subjectDetails?.sclassName?.sclassName}
                            </Typography>
                        </Card>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Students
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {numberOfStudents}
                            </Typography>
                        </Card>
                    </Box>

                    {subjectDetails?.teacher ? (
                        <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h6" color="text.secondary">
                                Teacher
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {subjectDetails.teacher.name}
                            </Typography>
                        </Card>
                    ) : (
                        <ActionButton
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails?._id)}
                            sx={{ mt: 2 }}
                            startIcon={<PersonIcon />}
                        >
                            Assign Teacher
                        </ActionButton>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {subloading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 2 }}>
                            <TabList onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                <Tab label="Details" value="1" icon={<BookIcon fontSize="small" />} />
                                <Tab label="Students" value="2" icon={<PersonIcon fontSize="small" />} />
                            </TabList>
                        </Box>

                        <Box sx={{ pt: 3 }}>
                            <TabPanel value="1">
                                <SubjectDetailsSection />
                            </TabPanel>
                            <TabPanel value="2">
                                <SubjectStudentsSection />
                            </TabPanel>
                        </Box>
                    </TabContext>
                </Box>
            )}
        </Container>
    );
};

export default ViewSubject;