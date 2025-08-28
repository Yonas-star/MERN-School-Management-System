import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Divider
} from '@mui/material';
import { PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID);
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID);
        }
    };

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
        { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' }
    ];

    const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    });

    const SclassButtonHaver = ({ row }) => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PurpleButton 
                    variant="contained"
                    onClick={() => navigateHandler(row.id)}
                    sx={{ px: 3 }}
                >
                    Choose
                </PurpleButton>
            </Box>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {situation === "Teacher" ? "Assign Teacher" : "Add Subject"} - Select Class
                    </Typography>
                    {!loading && (
                        <Button 
                            variant="contained" 
                            onClick={() => navigate("/Admin/addclass")}
                            sx={{ px: 3, py: 1 }}
                        >
                            Add New Class
                        </Button>
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <>
                        {getresponse || (Array.isArray(sclassesList) && sclassesList.length === 0 ? (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '200px',
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                p: 3
                            }}>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    No classes available
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate("/Admin/addclass")}
                                    sx={{ mt: 2 }}
                                >
                                    Create Your First Class
                                </Button>
                            </Box>
                        ) : (
                            <TableTemplate 
                                buttonHaver={SclassButtonHaver} 
                                columns={sclassColumns} 
                                rows={sclassRows} 
                                rowsPerPage={100} 
                            />
                        ))}
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ChooseClass;