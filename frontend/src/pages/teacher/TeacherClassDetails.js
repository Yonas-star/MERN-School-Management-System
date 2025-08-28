import React, { useEffect, useState } from "react"; // Added React import here
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Paper, 
    Box, 
    Typography, 
    ButtonGroup, 
    Button, 
    Popper, 
    Grow, 
    ClickAwayListener, 
    MenuList, 
    MenuItem,
    Skeleton,
    Alert,
    useTheme,
    Container,
    Stack
} from '@mui/material';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp,
    People as PeopleIcon,
    School as SchoolIcon
} from "@mui/icons-material";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import TableTemplate from "../../components/TableTemplate";
import { BlueButton, BlackButton } from "../../components/buttonStyles";

const TeacherClassDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);
    
    const classID = currentUser?.teachSclass?._id;
    const subjectID = currentUser?.teachSubject?._id;
    const className = currentUser?.teachSclass?.sclassName;
    const subjectName = currentUser?.teachSubject?.subName;

    useEffect(() => {
        if (classID) {
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, classID]);

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ];

    const studentRows = sclassStudents?.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    })) || [];

    const StudentsButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];
        const [open, setOpen] = useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleActions = {
            0: () => navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`),
            1: () => navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
        };

        const handleClick = () => {
            handleActions[selectedIndex]?.();
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
            handleActions[index]?.();
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current?.contains(event.target)) {
                return;
            }
            setOpen(false);
        };

        return (
            <Stack direction="row" spacing={1}>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate(`/Teacher/class/student/${row.id}`)}
                    size="small"
                >
                    View
                </BlueButton>
                
                <ButtonGroup variant="contained" ref={anchorRef}>
                    <Button 
                        onClick={handleClick}
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        {options[selectedIndex]}
                    </Button>
                    <BlackButton
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </BlackButton>
                </ButtonGroup>
                
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    sx={{ zIndex: theme.zIndex.modal }}
                >
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                            <Paper elevation={3}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu" autoFocusItem>
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                                sx={{ minWidth: 180 }}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Stack>
        );
    };

    const renderLoadingSkeleton = () => (
        <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={400} />
        </Box>
    );

    const renderEmptyState = () => (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 2 }}>
            <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
                No Students Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
                This class currently has no enrolled students.
            </Typography>
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading class details: {error.message || 'Unknown error'}
                </Alert>
            )}

            {loading ? (
                renderLoadingSkeleton()
            ) : (
                <>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h3" gutterBottom>
                            Class Details
                        </Typography>
                        <Typography variant="h5" color="text.secondary">
                            <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {className} - {subjectName}
                        </Typography>
                    </Box>

                    {getresponse || !sclassStudents?.length ? (
                        renderEmptyState()
                    ) : (
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                Students List
                            </Typography>
                            <TableTemplate 
                                buttonHaver={StudentsButtonHaver} 
                                columns={studentColumns} 
                                rows={studentRows} 
                                rowsPerPage={100} 
                            />
                        </Paper>
                    )}
                </>
            )}
        </Container>
    );
};

export default TeacherClassDetails;