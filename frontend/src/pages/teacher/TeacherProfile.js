import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Avatar, 
    Divider, 
    useTheme,
    Skeleton,
    Alert,
    Container
} from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Class as ClassIcon,
    Subject as SubjectIcon,
    School as SchoolIcon
} from '@mui/icons-material';

const ProfileItem = ({ icon, label, value, loading }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
        <Box sx={{ 
            mr: 2,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center'
        }}>
            {loading ? <Skeleton variant="circular" width={24} height={24} /> : icon}
        </Box>
        {loading ? (
            <Skeleton variant="text" width={200} height={30} />
        ) : (
            <Typography variant="body1">
                <strong>{label}:</strong> {value || 'N/A'}
            </Typography>
        )}
    </Box>
);

const TeacherProfile = () => {
    const theme = useTheme();
    const { currentUser, loading, response, error } = useSelector((state) => state.user);

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading profile: {error.message || 'Unknown error'}
                </Alert>
            )}
            {response && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    {response.message}
                </Alert>
            )}

            <Card sx={{ 
                borderRadius: 4,
                boxShadow: 3,
                overflow: 'visible'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: 4,
                    px: 4
                }}>
                    {loading ? (
                        <Skeleton variant="circular" width={120} height={120} />
                    ) : (
                        <Avatar sx={{ 
                            width: 120, 
                            height: 120,
                            fontSize: '3rem',
                            bgcolor: theme.palette.primary.main,
                            mb: 2
                        }}>
                            {currentUser?.name?.charAt(0) || 'T'}
                        </Avatar>
                    )}
                    
                    {loading ? (
                        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
                    ) : (
                        <Typography variant="h4" component="h1" gutterBottom>
                            {currentUser?.name}
                        </Typography>
                    )}
                    
                    {loading ? (
                        <Skeleton variant="text" width={150} height={30} sx={{ mb: 3 }} />
                    ) : (
                        <Typography variant="subtitle1" color="text.secondary">
                            Teacher Profile
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <CardContent sx={{ p: 4 }}>
                    <ProfileItem
                        icon={<PersonIcon />}
                        label="Name"
                        value={currentUser?.name}
                        loading={loading}
                    />
                    <ProfileItem
                        icon={<EmailIcon />}
                        label="Email"
                        value={currentUser?.email}
                        loading={loading}
                    />
                    <ProfileItem
                        icon={<ClassIcon />}
                        label="Class"
                        value={currentUser?.teachSclass?.sclassName}
                        loading={loading}
                    />
                    <ProfileItem
                        icon={<SubjectIcon />}
                        label="Subject"
                        value={currentUser?.teachSubject?.subName}
                        loading={loading}
                    />
                    <ProfileItem
                        icon={<SchoolIcon />}
                        label="School"
                        value={currentUser?.school?.schoolName}
                        loading={loading}
                    />
                </CardContent>
            </Card>
        </Container>
    );
};

export default TeacherProfile;