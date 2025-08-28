import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [assignment, setAssignment] = useState('');
    const [attendance, setAttendance] = useState('');
    const [midExam, setMidExam] = useState('');
    const [finalExam, setFinalExam] = useState('');
    
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            const stdID = params.id
            dispatch(getUserDetails(stdID, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const fields = {
        subName: chosenSubName,
        marks: {
            assignment: Number(assignment),
            attendance: Number(attendance),
            midExam: Number(midExam),
            finalExam: Number(finalExam),
        }
    };
    
    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"))
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <>
                    <Box
                        sx={{
                            flex: '1 1 auto',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: 550,
                                px: 3,
                                py: '100px',
                                width: '100%'
                            }}
                        >
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="h4">
                                    Student Name: {userDetails.name}
                                </Typography>
                                {currentUser.teachSubject &&
                                    <Typography variant="h4">
                                        Subject Name: {currentUser.teachSubject?.subName}
                                    </Typography>
                                }
                            </Stack>
                            <form onSubmit={submitHandler}>
    <Stack spacing={3}>
        {situation === "Student" && (
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Subject</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={subjectName}
                    label="Choose an option"
                    onChange={changeHandler}
                    required
                >
                    {subjectsList?.map((subject, index) => (
                        <MenuItem key={index} value={subject.subName}>
                            {subject.subName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )}
        <FormControl>
            <TextField
                type="number"
                label="Assignment (10%)"
                value={assignment}
                onChange={(e) => setAssignment(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
            />
        </FormControl>
        <FormControl>
            <TextField
                type="number"
                label="Attendance (10%)"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
            />
        </FormControl>
        <FormControl>
            <TextField
                type="number"
                label="Mid Exam (20%)"
                value={midExam}
                onChange={(e) => setMidExam(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
            />
        </FormControl>
        <FormControl>
            <TextField
                type="number"
                label="Final Exam (60%)"
                value={finalExam}
                onChange={(e) => setFinalExam(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
            />
        </FormControl>
    </Stack>
    <BlueButton
        fullWidth
        size="large"
        sx={{ mt: 3 }}
        variant="contained"
        type="submit"
        disabled={loader}
    >
        {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
    </BlueButton>
</form>

                        </Box>
                    </Box>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            }
        </>
    )
}

export default StudentExamMarks