import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, TextField, Button, Typography, Paper, Container } from '@mui/material';
import Popup from '../../../components/Popup';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '500px',
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  marginTop: theme.spacing(2),
}));

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const adminID = currentUser._id;

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "Notice";

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/notices');
      dispatch(underControl());
    } else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);
  const handleBack = () => {
    navigate(-1); // Go back to previous page
};
  return (
    <>
    <Button onClick={handleBack}>Go Back</Button>
      <StyledContainer>
        <StyledPaper elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Add New Notice
          </Typography>
          
          <StyledForm onSubmit={submitHandler}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              size="medium"
            />
            
            <TextField
              label="Details"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              required
            />
            
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
            
            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loader}
              fullWidth
              size="large"
            >
              {loader ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Add Notice'
              )}
            </StyledButton>
          </StyledForm>
        </StyledPaper>
      </StyledContainer>
      
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddNotice;