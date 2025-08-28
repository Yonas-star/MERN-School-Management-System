import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, IconButton, Typography, CircularProgress, Button, ButtonGroup, 
    Menu, MenuItem, Stack, Divider, Tooltip, Card, CardHeader, Avatar,
    TextField, InputAdornment, Chip, Grid, Tabs, Tab, Select, FormControl,
    InputLabel, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import {
    PersonRemove, PersonAddAlt1, KeyboardArrowDown, Groups, School, 
    Assignment, Grade, Visibility, Add, Search, FilterList, Clear
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { blue, green, red, grey, orange, purple } from '@mui/material/colors';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
    },
}));

const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: alpha(theme.palette.common.white, 0.9),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.95),
        },
    },
    width: '100%',
    maxWidth: '400px',
}));

const FilterButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '8px 16px',
    borderColor: grey[300],
    color: theme.palette.mode === 'dark' ? grey[100] : grey[800],
    '&:hover': {
        borderColor: grey[400],
        backgroundColor: alpha(grey[500], 0.08),
    },
}));
const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '12px',
    padding: '8px 16px',
    fontWeight: 600,
    letterSpacing: '0.5px',
}));

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [classFilter, setClassFilter] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filteredStudents, setFilteredStudents] = useState([]);

    // Get unique class names for filter
    const classOptions = [...new Set(
        studentsList?.map(student => student.sclassName?.sclassName).filter(Boolean)
    )];

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    // Apply filters whenever search term, active filter or studentsList changes
    useEffect(() => {
        if (studentsList) {
            let result = studentsList;
            
            // Apply search filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                result = result.filter(student => 
                    student.name.toLowerCase().includes(term) ||
                    student.rollNum.toString().includes(term) ||
                    (student.sclassName?.sclassName?.toLowerCase().includes(term) ?? false)
                );
            }
            
            // Apply class filter
            if (classFilter.length > 0) {
                result = result.filter(student => 
                    classFilter.includes(student.sclassName?.sclassName)
                );
            }
            
            // Apply active status filter
            if (activeFilter !== 'all') {
                // You can add more status filters here if needed
                // For now just showing the basic structure
            }
            
            setFilteredStudents(result);
        }
    }, [searchTerm, activeFilter, classFilter, studentsList]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Sorry, the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClassFilterChange = (event) => {
        const value = event.target.value;
        setClassFilter(typeof value === 'string' ? value.split(',') : value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setClassFilter([]);
        setActiveFilter('all');
    };

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 120 },
        { id: 'sclassName', label: 'Class', minWidth: 150 },
        { id: 'actions', label: 'Actions', minWidth: 300, align: 'right' },
    ];

    const studentRows = filteredStudents?.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        sclassName: student.sclassName?.sclassName || 'Class not assigned',
        id: student._id,
    })) || [];

    const StudentButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) {
                navigate(`/Admin/students/student/attendance/${row.id}`);
            } else {
                navigate(`/Admin/students/student/marks/${row.id}`);
            }
        };

        return (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                <Tooltip title="View Student">
                    <ActionButton 
                        variant="outlined" 
                        color="primary" 
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/Admin/students/student/${row.id}`)}
                        sx={{ 
                            borderColor: blue[200], 
                            color: blue[600],
                            '&:hover': {
                                borderColor: blue[300],
                                backgroundColor: alpha(blue[500], 0.08)
                            }
                        }}
                    >
                        View
                    </ActionButton>
                </Tooltip>
                
                <Tooltip title="Student Actions">
                    <ButtonGroup variant="contained" size="small">
                        <Button 
                            onClick={handleClick}
                            startIcon={selectedIndex === 0 ? <Assignment /> : <Grade />}
                            sx={{ 
                                bgcolor: green[500],
                                '&:hover': { bgcolor: green[600] }
                            }}
                        >
                            {options[selectedIndex]}
                        </Button>
                        <Button 
                            size="small" 
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                            sx={{ 
                                bgcolor: green[500],
                                '&:hover': { bgcolor: green[600] }
                            }}
                        >
                            <KeyboardArrowDown />
                        </Button>
                    </ButtonGroup>
                </Tooltip>
                
                <Menu 
                    anchorEl={anchorEl} 
                    open={open} 
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            borderRadius: '12px',
                            mt: 1,
                            minWidth: 180,
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                            '& .MuiMenuItem-root': {
                                padding: '10px 16px',
                            },
                        },
                    }}
                >
                    {options.map((option, index) => (
                        <MenuItem 
                            key={option} 
                            selected={index === selectedIndex} 
                            onClick={() => { 
                                setSelectedIndex(index); 
                                setAnchorEl(null); 
                            }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: alpha(green[500], 0.1),
                                }
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                {index === 0 ? <Assignment fontSize="small" /> : <Grade fontSize="small" />}
                                <Typography variant="body2">{option}</Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </Menu>
                
                <Tooltip title="Remove Student">
                    <IconButton 
                        onClick={() => deleteHandler(row.id, "Student")} 
                        sx={{ 
                            bgcolor: red[50], 
                            color: red[500], 
                            '&:hover': { 
                                bgcolor: red[100] 
                            } 
                        }}
                    >
                        <PersonRemove />
                    </IconButton>
                </Tooltip>
            </Stack>
        );
    };

    const actions = [
        { 
            icon: <PersonAddAlt1 sx={{ color: 'white' }} />, 
            name: 'Add New Student', 
            action: () => navigate("/Admin/addstudents"),
            fabProps: {
                sx: {
                    bgcolor: blue[500],
                    '&:hover': {
                        bgcolor: blue[600]
                    }
                }
            }
        },
        { 
            icon: <Groups sx={{ color: 'white' }} />, 
            name: 'Delete All Students', 
            action: () => deleteHandler(currentUser._id, "Students"),
            fabProps: {
                sx: {
                    bgcolor: red[500],
                    '&:hover': {
                        bgcolor: red[600]
                    }
                }
            }
        },
    ];

    return (
        <Box sx={{ 
            padding: { xs: '16px', md: '24px' }, 
            maxWidth: '1600px', 
            margin: 'auto',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: 'background.default'
        }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{ 
                    bgcolor: purple[100], 
                    color: purple[600], 
                    width: 56, 
                    height: 56,
                    boxShadow: '0 4px 12px 0 rgba(156, 39, 176, 0.2)'
                }}>
                    <School sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="textPrimary" gutterBottom>
                        Student Management
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage all student records and activities
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                {!response && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate("/Admin/addstudents")}
                        sx={{
                            bgcolor: green[500],
                            '&:hover': { bgcolor: green[600] },
                            borderRadius: '12px',
                            px: 3,
                            py: 1
                        }}
                    >
                        Add Student
                    </Button>
                )}
            </Stack>

            {/* Search and Filter Section */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <SearchField
                            placeholder="Search students..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="clear search"
                                            onClick={() => setSearchTerm('')}
                                            edge="end"
                                            size="small"
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Stack direction="row" spacing={2}>
                            <FilterButton
                                variant="outlined"
                                startIcon={<FilterList />}
                                onClick={() => setShowFilters(!showFilters)}
                                sx={{
                                    bgcolor: showFilters ? alpha(orange[500], 0.1) : 'inherit'
                                }}
                            >
                                Filters
                            </FilterButton>
                            {(searchTerm || classFilter.length > 0) && (
                                <Button
                                    variant="text"
                                    startIcon={<Clear />}
                                    onClick={clearFilters}
                                    sx={{ color: grey[600] }}
                                >
                                    Clear
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                </Grid>

                {/* Expanded Filters */}
                {showFilters && (
                    <Box sx={{ 
                        mt: 2, 
                        p: 2, 
                        backgroundColor: 'background.paper',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)'
                    }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        multiple
                                        value={classFilter}
                                        onChange={handleClassFilterChange}
                                        input={<OutlinedInput label="Class" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} size="small" />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {classOptions.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={classFilter.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>

            {/* Results count */}
            {!loading && !response && (
                <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                    Showing {filteredStudents.length} of {studentsList.length} students
                </Typography>
            )}

            {loading ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '50vh',
                    backgroundColor: 'background.paper',
                    borderRadius: '12px'
                }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: purple[500] }} />
                </Box>
            ) : (
                <>
                    {response ? (
                        <StyledCard>
                            <CardHeader 
                                title="No Students Found" 
                                subheader="You haven't added any students yet"
                                action={
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonAddAlt1 />}
                                        onClick={() => navigate("/Admin/addstudents")}
                                        sx={{
                                            bgcolor: green[500],
                                            '&:hover': { bgcolor: green[600] },
                                            borderRadius: '12px'
                                        }}
                                    >
                                        Add Students
                                    </Button>
                                }
                                sx={{
                                    borderBottom: `1px solid ${grey[100]}`
                                }}
                            />
                        </StyledCard>
                    ) : (
                        <StyledCard sx={{ 
                            backgroundColor: 'background.paper',
                            '& .MuiTable-root': {
                                minWidth: 650,
                            }
                        }}>
                            <TableTemplate 
                                buttonHaver={StudentButtonHaver} 
                                columns={studentColumns} 
                                rows={studentRows} 
                                rowsPerPage={100} 
                                sx={{ p: 0 }}
                                tableHeader={
                                    <CardHeader 
                                        title={`Students (${filteredStudents.length})`}
                                        subheader="Filtered student results"
                                        sx={{ 
                                            borderBottom: `1px solid ${grey[100]}`,
                                            backgroundColor: 'background.default'
                                        }}
                                    />
                                }
                            />
                            <SpeedDialTemplate 
                                actions={actions} 
                                sx={{ 
                                    position: 'fixed', 
                                    bottom: 32, 
                                    right: 32,
                                    '& .MuiSpeedDial-fab': {
                                        backgroundColor: purple[500],
                                        '&:hover': {
                                            backgroundColor: purple[600],
                                        }
                                    }
                                }}
                            />
                        </StyledCard>
                    )}
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ShowStudents;