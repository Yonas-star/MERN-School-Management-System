import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Box,
  Checkbox,
  CircularProgress,
  Typography,
  Container,
  styled
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  overflowX: 'auto',
}));

const LoadingBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '300px',
});

const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  backgroundColor: theme.palette.grey[100],
  borderRadius: '8px',
  marginTop: theme.spacing(2),
}));

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 200 },
    { id: 'date', label: 'Date', minWidth: 120, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
  ];

  const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" 
      ? date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }) 
      : "Invalid Date";
      
    return {
      user: complain.user.name,
      complaint: complain.complaint,
      date: dateString,
      status: complain.status || 'Pending',
      id: complain._id,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    const [checked, setChecked] = React.useState(false);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      // Add your status update logic here
    };

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'Mark as resolved' }}
          color="primary"
        />
      </Box>
    );
  };

  return (
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Complaints Management
      </Typography>
      
      {loading ? (
        <LoadingBox>
          <CircularProgress size={60} />
        </LoadingBox>
      ) : (
        <>
          {response || (Array.isArray(complainsList) && complainsList.length === 0 ? (
            <EmptyStateBox>
              <Typography variant="h6" color="textSecondary">
                No complaints have been submitted yet
              </Typography>
            </EmptyStateBox>
          ) : (
            <StyledPaper elevation={3}>
              {Array.isArray(complainsList) && complainsList.length > 0 && (
                <TableTemplate 
                  buttonHaver={ComplainButtonHaver} 
                  columns={complainColumns} 
                  rows={complainRows} 
                  rowsPerPage={100} 
                />
              )}
            </StyledPaper>
          ))}
        </>
      )}
    </StyledContainer>
  );
};

export default SeeComplains;