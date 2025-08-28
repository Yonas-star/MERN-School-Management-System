import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Avatar, 
  Container, 
  Paper,
  Divider,
  Skeleton,
  Alert,
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

const StudentProfile = () => {
  const theme = useTheme();
  const { currentUser, loading, response, error } = useSelector((state) => state.user);

  if (response) console.log(response);
  if (error) console.error(error);

  const renderField = (icon, label, value, loading) => (
    <Grid item xs={12} sm={6}>
      <Box display="flex" alignItems="center" gap={2}>
        {loading ? (
          <Skeleton variant="circular" width={24} height={24} />
        ) : (
          <Box sx={{ color: theme.palette.primary.main }}>{icon}</Box>
        )}
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            {label}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            <Typography variant="body1">{value || 'N/A'}</Typography>
          )}
        </Box>
      </Box>
    </Grid>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading profile data: {error.message}
        </Alert>
      )}

      <ProfileCard elevation={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            {loading ? (
              <Skeleton variant="circular" width={150} height={150} />
            ) : (
              <Avatar 
                alt={currentUser?.name} 
                sx={{ 
                  width: 150, 
                  height: 150,
                  fontSize: '3rem',
                  bgcolor: theme.palette.primary.main
                }}
              >
                {currentUser?.name?.charAt(0) || 'S'}
              </Avatar>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="center">
              {loading ? (
                <>
                  <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto' }} />
                  <Skeleton variant="text" width={150} height={30} sx={{ mx: 'auto' }} />
                </>
              ) : (
                <>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {currentUser?.name}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="textSecondary"
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                  >
                    <PersonIcon fontSize="small" />
                    Roll No: {currentUser?.rollNum}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            {loading ? (
              <Skeleton variant="text" width="80%" />
            ) : (
              <Typography variant="body1">
                <strong>Class:</strong> {currentUser?.sclassName?.sclassName || 'N/A'}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {loading ? (
              <Skeleton variant="text" width="80%" />
            ) : (
              <Typography variant="body1">
                <strong>School:</strong> {currentUser?.school?.schoolName || 'N/A'}
              </Typography>
            )}
          </Grid>
        </Grid>
      </ProfileCard>

      <InfoCard sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            {renderField(<CakeIcon />, "Date of Birth", "January 1, 2000", loading)}
            {renderField(<PersonIcon />, "Gender", "Male", loading)}
            {renderField(<EmailIcon />, "Email", "john.doe@example.com", loading)}
            {renderField(<PhoneIcon />, "Phone", "(123) 456-7890", loading)}
            {renderField(<HomeIcon />, "Address", "123 Main Street, City, Country", loading)}
            {renderField(<ContactEmergencyIcon />, "Emergency Contact", "(987) 654-3210", loading)}
          </Grid>
        </CardContent>
      </InfoCard>
    </Container>
  );
};

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export default StudentProfile;