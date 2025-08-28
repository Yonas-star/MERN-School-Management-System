import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box, IconButton, Card, CardContent, Stack, Typography,
    Avatar, CircularProgress, Paper, TableContainer, Table,
    TableHead, TableBody, TableRow, TableCell, Tooltip, Button,
    TextField, InputAdornment, MenuItem, Select, FormControl,
    InputLabel, TableSortLabel
} from '@mui/material';
import {
    PostAdd as PostAddIcon,
    Delete as DeleteIcon,
    Book as BookIcon,
    Search as SearchIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
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
    padding: '8px 16px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    marginLeft: theme.spacing(1),
}));

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    // State for sorting, searching, and filtering
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('subName');
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [sessionFilter, setSessionFilter] = useState('all');

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const handleDeleteAll = () => {
        if (window.confirm("Are you sure you want to delete all subjects? This action cannot be undone.")) {
            deleteHandler(currentUser._id, "Subjects");
        }
    };

    // Get unique class names for filter
    const uniqueClasses = [...new Set(subjectsList?.map(subject => subject.sclassName?.sclassName).filter(Boolean))];

    // Handle sorting
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Sort function
    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    // Filter and search function
    const filteredSubjects = subjectsList?.filter(subject => {
        const matchesSearch = subject.subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             subject.sclassName?.sclassName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesClass = classFilter === 'all' || subject.sclassName?.sclassName === classFilter;
        const matchesSession = sessionFilter === 'all' || 
                              (sessionFilter === 'with' && subject.sessions > 0) ||
                              (sessionFilter === 'without' && subject.sessions === 0);
        
        return matchesSearch && matchesClass && matchesSession;
    }) || [];

    const sortedSubjects = stableSort(filteredSubjects, getComparator(order, orderBy));

    const subjectColumns = [
        { id: 'subName', label: 'Subject Name', minWidth: 170, sortable: true },
        { id: 'sessions', label: 'Sessions', minWidth: 100, sortable: true },
        { id: 'sclassName', label: 'Class', minWidth: 170, sortable: true, getValue: (subject) => subject.sclassName?.sclassName || 'N/A' },
        { id: 'actions', label: 'Actions', minWidth: 200, align: 'right', sortable: false },
    ];

    const subjectRows = sortedSubjects.map((subject) => ({
        subName: subject.subName,
        sessions: subject.sessions,
        sclassName: subject.sclassName?.sclassName || 'N/A',
        sclassID: subject.sclassName?._id,
        id: subject._id,
    }));

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Tooltip title="Delete Subject">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Subject")}
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
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}
                >
                    View Details
                </ActionButton>
            </Stack>
        );
    };

    return (
        <Box sx={{ padding: '24px', maxWidth: '1400px', margin: 'auto' }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : (
                <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3 }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ 
                                    bgcolor: 'secondary.light', 
                                    color: 'secondary.main',
                                    width: 56,
                                    height: 56
                                }}>
                                    <BookIcon fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        Subject Management
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {filteredSubjects.length} subjects found
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <ActionButton
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteAll}
                                    startIcon={<DeleteIcon />}
                                    disabled={subjectsList?.length === 0}
                                >
                                    Delete All
                                </ActionButton>
                                <ActionButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate("/Admin/subjects/chooseclass")}
                                    startIcon={<PostAddIcon />}
                                >
                                    Add New Subject
                                </ActionButton>
                            </Stack>
                        </Stack>

                        {/* Search and Filter Bar */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search subjects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ minWidth: 250 }}
                            />
                            
                            <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel>Filter by Class</InputLabel>
                                <Select
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    label="Filter by Class"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterIcon fontSize="small" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="all">All Classes</MenuItem>
                                    {uniqueClasses.map((className) => (
                                        <MenuItem key={className} value={className}>
                                            {className}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel>Filter by Sessions</InputLabel>
                                <Select
                                    value={sessionFilter}
                                    onChange={(e) => setSessionFilter(e.target.value)}
                                    label="Filter by Sessions"
                                >
                                    <MenuItem value="all">All Subjects</MenuItem>
                                    <MenuItem value="with">With Sessions</MenuItem>
                                    <MenuItem value="without">Without Sessions</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {filteredSubjects.length > 0 ? (
                            <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {subjectColumns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align || 'left'}
                                                    style={{ 
                                                        minWidth: column.minWidth, 
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#f5f5f5'
                                                    }}
                                                >
                                                    {column.sortable ? (
                                                        <TableSortLabel
                                                            active={orderBy === column.id}
                                                            direction={orderBy === column.id ? order : 'asc'}
                                                            onClick={() => handleRequestSort(column.id)}
                                                        >
                                                            {column.label}
                                                        </TableSortLabel>
                                                    ) : (
                                                        column.label
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subjectRows.map((row) => (
                                            <StyledTableRow hover key={row.id}>
                                                {subjectColumns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell 
                                                            key={column.id} 
                                                            align={column.align || 'left'}
                                                            sx={{ fontSize: '0.875rem' }}
                                                        >
                                                            {column.id === 'actions' ? (
                                                                <SubjectsButtonHaver row={row} />
                                                            ) : (
                                                                value
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                minHeight: '200px',
                                border: '1px dashed #ccc',
                                borderRadius: '8px',
                                p: 4
                            }}>
                                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                                    No subjects match your search criteria
                                </Typography>
                                <ActionButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setClassFilter('all');
                                        setSessionFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </ActionButton>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ShowSubjects;