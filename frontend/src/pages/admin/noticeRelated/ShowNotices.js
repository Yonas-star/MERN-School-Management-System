import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Button,Paper, Box, IconButton, CircularProgress, Typography, Container
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

const LoadingBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
});


const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);
    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };
    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            });
    };

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 200 },
        { id: 'date', label: 'Date', minWidth: 120, align: 'center' },
        { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
    ];

    const noticeRows = noticesList && noticesList.length > 0 && noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" 
            ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
            : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    const NoticeButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton 
                    onClick={() => deleteHandler(row.id, "Notice")}
                    aria-label="delete notice"
                    size="medium"
                >
                    <DeleteIcon color="error" />
                </IconButton>
            </Box>
        );
    };

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />, 
            name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon color="error" />, 
            name: 'Delete All Notices',
            action: () => {
                if (window.confirm('Are you sure you want to delete all notices?')) {
                    deleteHandler(currentUser._id, "Notices");
                }
            }
        }
    ];

    return (
        <StyledContainer maxWidth="lg">
                                <Button onClick={handleBack}>Go Back</Button>
            
            {loading ? (
                <LoadingBox>
                    <CircularProgress size={60} />
                </LoadingBox>
            ) : (
                <>
                    {response ? (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                No notices found
                            </Typography>
                            <GreenButton 
                                variant="contained"
                                onClick={() => navigate("/Admin/addnotice")}
                                sx={{ mt: 2 }}
                            >
                                Add Your First Notice
                            </GreenButton>
                        </Box>
                    ) : (
                        <StyledPaper elevation={3}>
                            <HeaderBox>
                                <Typography variant="h4" component="h1">
                                    Notices
                                </Typography>
                                <GreenButton 
                                    variant="contained"
                                    onClick={() => navigate("/Admin/addnotice")}
                                    startIcon={<NoteAddIcon />}
                                >
                                    Add Notice
                                </GreenButton>
                            </HeaderBox>

                            {Array.isArray(noticesList) && noticesList.length > 0 ? (
                                <TableTemplate 
                                    buttonHaver={NoticeButtonHaver} 
                                    columns={noticeColumns} 
                                    rows={noticeRows} 
                                    rowsPerPage={100} 
                                />
                            ) : (
                                <Typography variant="body1" align="center" sx={{ py: 4 }}>
                                    No notices available. Add a new notice to get started.
                                </Typography>
                            )}
                            
                            <SpeedDialTemplate actions={actions} />
                        </StyledPaper>
                    )}
                </>
            )}
        </StyledContainer>
    );
};

export default ShowNotices;