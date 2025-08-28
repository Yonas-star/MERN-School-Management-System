import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton,
    Container, Typography, CircularProgress, Tooltip, Chip
} from '@mui/material';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchBar from '../../../components/SearchBar';
import FilterListIcon from '@mui/icons-material/FilterList';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 150 },
        { id: 'teachSclass', label: 'Class', minWidth: 150 },
    ];

    const filteredRows = teachersList
        .map((teacher) => ({
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        }))
        .filter(row => 
            row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (row.teachSubject && row.teachSubject.toLowerCase().includes(searchTerm.toLowerCase())) ||
            row.teachSclass.toLowerCase().includes(searchTerm.toLowerCase()));

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, 
            name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon color="error" />, 
            name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    if (loading) {
        return (
            <Container sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '80vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: 2,
                p: 4
            }}>
                <Box textAlign="center">
                    <CircularProgress size={60} thickness={4} sx={{ mb: 2, color: '#3f51b5' }} />
                    <Typography variant="h6" color="textSecondary">
                        Loading Teachers...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ 
                mt: 4,
                p: 4,
                background: '#ffebee',
                borderRadius: 2,
                borderLeft: '4px solid #f44336'
            }}>
                <Typography color="error" variant="h6" sx={{ fontWeight: 'bold' }}>
                    Error Loading Teachers
                </Typography>
                <Typography color="textSecondary" sx={{ mt: 1 }}>
                    Please try again later or contact support if the problem persists.
                </Typography>
                <Button 
                    variant="outlined" 
                    color="error" 
                    sx={{ mt: 2 }}
                    onClick={() => dispatch(getAllTeachers(currentUser._id))}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    if (response) {
        return (
            <Container sx={{ 
                mt: 4,
                p: 4,
                background: '#e8f5e9',
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Typography variant="h5" color="textPrimary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    No Teachers Found
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                    It looks like you haven't added any teachers yet. Get started by adding your first teacher.
                </Typography>
                <GreenButton 
                    variant="contained" 
                    onClick={() => navigate("/Admin/teachers/chooseclass")}
                    startIcon={<PersonAddAlt1Icon />}
                    sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                    Add Your First Teacher
                </GreenButton>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
            <Paper elevation={3} sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ 
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            mb: 1
                        }}>
                            Teachers Management
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {filteredRows.length} {filteredRows.length === 1 ? 'Teacher' : 'Teachers'} Found
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <SearchBar 
                            searchTerm={searchTerm} 
                            setSearchTerm={setSearchTerm} 
                            placeholder="Search teachers..." 
                        />
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            sx={{ px: 3, borderRadius: 2 }}
                        >
                            Filters
                        </Button>
                        <GreenButton 
                            variant="contained" 
                            onClick={() => navigate("/Admin/teachers/chooseclass")}
                            startIcon={<PersonAddAlt1Icon />}
                            sx={{ px: 3, py: 1.5, borderRadius: 2 }}
                        >
                            Add Teacher
                        </GreenButton>
                    </Box>
                </Box>

                <TableContainer sx={{ 
                    maxHeight: 'calc(400vh - 300px)',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                    }
                }}>
                    <Table stickyHeader aria-label="teachers table">
                        <TableHead>
                            <StyledTableRow>
                                {columns.map((column) => (
                                    <StyledTableCell
                                        key={column.id}
                                        align="left"
                                        style={{ 
                                            minWidth: column.minWidth,
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            background: '#3f51b5',
                                            color: 'white'
                                        }}
                                    >
                                        {column.label}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell 
                                    align="center" 
                                    width="200px"
                                    style={{ 
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        background: '#3f51b5',
                                        color: 'white'
                                    }}
                                >
                                    Actions
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.length > 0 ? (
                                filteredRows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <StyledTableRow hover key={row.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'teachSubject') {
                                                    return (
                                                        <StyledTableCell key={column.id} align="left">
                                                            {value ? (
                                                                <Chip 
                                                                    label={value} 
                                                                    color="primary" 
                                                                    variant="outlined"
                                                                    sx={{ 
                                                                        fontWeight: 'bold',
                                                                        borderRadius: 1
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Button 
                                                                    variant="outlined"
                                                                    onClick={() => navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)}
                                                                    sx={{ 
                                                                        textTransform: 'none',
                                                                        borderRadius: 2,
                                                                        px: 2
                                                                    }}
                                                                >
                                                                    Assign Subject
                                                                </Button>
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                }
                                                return (
                                                    <StyledTableCell key={column.id} align="left" sx={{ fontSize: '0.95rem' }}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell align="center">
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    gap: 1, 
                                                    justifyContent: 'center',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <Tooltip title="View Details">
                                                        <BlueButton 
                                                            variant="contained"
                                                            onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                                                            startIcon={<VisibilityIcon />}
                                                            sx={{ 
                                                                px: 2,
                                                                borderRadius: 2,
                                                                minWidth: '100px'
                                                            }}
                                                        >
                                                            Details
                                                        </BlueButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Teacher">
                                                        <IconButton 
                                                            onClick={() => deleteHandler(row.id, "Teacher")}
                                                            color="error"
                                                            sx={{ 
                                                                backgroundColor: '#ffebee',
                                                                '&:hover': {
                                                                    backgroundColor: '#ffcdd2'
                                                                },
                                                                borderRadius: 2,
                                                                p: 1.5
                                                            }}
                                                        >
                                                            <PersonRemoveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <Typography variant="h6" color="textSecondary">
                                                No matching teachers found
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary">
                                                Try adjusting your search or add a new teacher
                                            </Typography>
                                            <GreenButton 
                                                variant="contained" 
                                                onClick={() => navigate("/Admin/teachers/chooseclass")}
                                                startIcon={<PersonAddAlt1Icon />}
                                                sx={{ mt: 1, borderRadius: 2 }}
                                            >
                                                Add Teacher
                                            </GreenButton>
                                        </Box>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredRows.length > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        sx={{ 
                            mt: 2,
                            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                fontWeight: 'bold'
                            }
                        }}
                    />
                )}

                <SpeedDialTemplate actions={actions} />
                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </Paper>
        </Container>
    );
};

export default ShowTeachers;