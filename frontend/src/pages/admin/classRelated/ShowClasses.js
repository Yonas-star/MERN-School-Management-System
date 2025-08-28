import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    Tooltip,
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    Avatar,
    CircularProgress,
    Button,
    Chip
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import Popup from '../../../components/Popup';
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

const ShowClasses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sclassesList, loading, error } = useSelector((state) => state.sclass);
    const { studentsList } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllStudents(adminID));
    }, [adminID, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry, the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Create a map of class IDs to student counts
    const getStudentCountsByClass = () => {
        const counts = {};
        if (studentsList && studentsList.length > 0) {
            studentsList.forEach(student => {
                const classId = student.sclassName?._id;
                if (classId) {
                    counts[classId] = (counts[classId] || 0) + 1;
                }
            });
        }
        return counts;
    };

    const studentCounts = getStudentCountsByClass();

    const sclassRows = sclassesList?.map((sclass) => ({
        name: sclass.sclassName,
        id: sclass._id,
        studentCount: studentCounts[sclass._id] || 0
    })) || [];

    return (
        <Box sx={{ padding: '24px', maxWidth: '1200px', margin: 'auto' }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (
                <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56 }}>
                                <SchoolIcon fontSize="large" />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    Class Management
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Manage all class records and activities
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} />
                            <ActionButton
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/Admin/addclass")}
                                startIcon={<SchoolIcon />}
                            >
                                Add Class
                            </ActionButton>
                        </Stack>

                        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Class Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Students</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sclassRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<PeopleIcon fontSize="small" />}
                                                    label={`${row.studentCount} students`}
                                                    color={row.studentCount > 0 ? 'primary' : 'default'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Tooltip title="Delete Class">
                                                        <IconButton 
                                                            onClick={() => deleteHandler(row.id, "Sclass")}
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
                                                        onClick={() => navigate("/Admin/classes/class/" + row.id)}
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

                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={sclassRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ mt: 2 }}
                        />
                    </CardContent>
                </Card>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ShowClasses;