import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
        setOpen(false);
    };

    const handleCancel = () => {
        navigate(-1);
        setOpen(false);
    };

    return (
        <>
            {/* Material-UI Dialog Version */}
            <Dialog
                open={open}
                onClose={handleCancel}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '20px',
                        minWidth: '350px'
                    }
                }}
            >
                <DialogTitle id="logout-dialog-title" style={{ textAlign: 'center' }}>
                    Logout Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {currentUser?.name ? `Hi ${currentUser.name}, are you sure you want to log out?` : 'Are you sure you want to log out?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
                    <Button 
                        onClick={handleCancel}
                        variant="contained"
                        style={{
                            backgroundColor: '#6a1b9a',
                            color: 'white',
                            padding: '8px 20px',
                            marginRight: '10px'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleLogout}
                        variant="contained"
                        style={{
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            padding: '8px 20px'
                        }}
                        autoFocus
                    >
                        Log Out
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Styled Components Version (fallback) */}
            {!open && (
                <LogoutContainer>
                    <h1>{currentUser?.name || 'User'}</h1>
                    <LogoutMessage>
                        {currentUser?.name ? `Hi ${currentUser.name}, are you sure you want to log out?` : 'Are you sure you want to log out?'}
                    </LogoutMessage>
                    <ButtonGroup>
                        <LogoutButtonLogout onClick={handleLogout}>Log Out</LogoutButtonLogout>
                        <LogoutButtonCancel onClick={handleCancel}>Cancel</LogoutButtonCancel>
                    </ButtonGroup>
                </LogoutContainer>
            )}
        </>
    );
};

export default Logout;

// Styled Components
const LogoutContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
`;

const LogoutMessage = styled.p`
  margin: 20px 0;
  font-size: 16px;
  color: #555;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const LogoutButton = styled.button`
  padding: 10px 25px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LogoutButtonLogout = styled(LogoutButton)`
  background-color: #d32f2f;
  color: white;

  &:hover {
    background-color: #b71c1c;
  }
`;

const LogoutButtonCancel = styled(LogoutButton)`
  background-color: #6a1b9a;
  color: white;

  &:hover {
    background-color: #4a148c;
  }
`;