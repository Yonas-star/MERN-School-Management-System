import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Box, 
    Table, 
    TableBody, 
    TableContainer, 
    TableHead, 
    Typography, 
    Paper,
    Container,
    CircularProgress,
    Button,
    Divider
} from '@mui/material';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { GreenButton, PurpleButton } from '../../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false);

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (situation === "Norm") {
            setClassID(params.id);
            const classID = params.id;
            dispatch(getTeacherFreeClassSubjects(classID));
        }
        else if (situation === "Teacher") {
            const { classID, teacherID } = params;
            setClassID(classID);
            setTeacherID(teacherID);
            dispatch(getTeacherFreeClassSubjects(classID));
        }
    }, [situation, params, dispatch]);

    const updateSubjectHandler = (teacherId, teachSubject) => {
        setLoader(true);
        dispatch(updateTeachSubject(teacherId, teachSubject));
        navigate("/Admin/teachers");
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    if (error) {
        console.log(error);
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography color="error" variant="h6">
                    Error loading subjects. Please try again.
                </Typography>
            </Container>
        );
    }

    if (response) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        All subjects have teachers assigned already
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        You can add new subjects to this class.
                    </Typography>
                    <PurpleButton 
                        variant="contained"
                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Add New Subjects
                    </PurpleButton>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {situation === "Teacher" ? "Assign Subject to Teacher" : "Select Subject"}
                    </Typography>
                    {situation === "Norm" && (
                        <PurpleButton 
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                            sx={{ px: 3, py: 1 }}
                        >
                            Add Subject
                        </PurpleButton>
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <TableContainer>
                    <Table aria-label="subjects table" sx={{ minWidth: 650 }}>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell width="10%">#</StyledTableCell>
                                <StyledTableCell align="center" width="40%">Subject Name</StyledTableCell>
                                <StyledTableCell align="center" width="30%">Subject Code</StyledTableCell>
                                <StyledTableCell align="center" width="20%">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                                subjectsList.map((subject, index) => (
                                    <StyledTableRow key={subject._id} hover>
                                        <StyledTableCell component="th" scope="row">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{subject.subName}</StyledTableCell>
                                        <StyledTableCell align="center">{subject.subCode}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {situation === "Norm" ? (
                                                <GreenButton 
                                                    variant="contained"
                                                    onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}
                                                    sx={{ px: 3 }}
                                                >
                                                    Choose
                                                </GreenButton>
                                            ) : (
                                                <GreenButton 
                                                    variant="contained" 
                                                    disabled={loader}
                                                    onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                                    sx={{ px: 3 }}
                                                >
                                                    {loader ? (
                                                        <CircularProgress size={24} color="inherit" />
                                                    ) : (
                                                        'Assign'
                                                    )}
                                                </GreenButton>
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="textSecondary">
                                            No subjects available for this class
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default ChooseSubject;