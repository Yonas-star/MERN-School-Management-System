import * as React from 'react';
import { 
    Divider, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    ListSubheader,
    useTheme,
    styled
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Home as HomeIcon,
    ExitToApp as ExitToAppIcon,
    AccountCircle as AccountCircleIcon,
    Announcement as AnnouncementIcon,
    Class as ClassIcon
} from '@mui/icons-material';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        '&:hover': {
            backgroundColor: theme.palette.action.selected,
        }
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1),
}));

const TeacherSideBar = () => {
    const theme = useTheme();
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const sclassName = currentUser?.teachSclass?.sclassName || 'Class';

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/' || location.pathname === '/Teacher/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
        { text: `Class ${sclassName}`, icon: <ClassIcon />, path: '/Teacher/class' },
        { text: 'Complaints', icon: <AnnouncementIcon />, path: '/Teacher/complain' }
    ];

    const userItems = [
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/Teacher/profile' },
        { text: 'Logout', icon: <ExitToAppIcon />, path: '/logout' }
    ];

    return (
        <>
            {/* Main Navigation */}
            {menuItems.map((item) => (
                <StyledListItemButton 
                    key={item.path}
                    component={Link}
                    to={item.path}
                    selected={isActive(item.path)}
                >
                    <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.primary.main : 'inherit' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{
                            fontWeight: isActive(item.path) ? '600' : 'normal'
                        }}
                    />
                </StyledListItemButton>
            ))}

            <Divider sx={{ my: 1, mx: 2 }} />

            {/* User Section */}
            <ListSubheader component="div" inset sx={{ lineHeight: '36px' }}>
                User
            </ListSubheader>
            {userItems.map((item) => (
                <StyledListItemButton 
                    key={item.path}
                    component={Link}
                    to={item.path}
                    selected={isActive(item.path)}
                >
                    <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.primary.main : 'inherit' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{
                            fontWeight: isActive(item.path) ? '600' : 'normal'
                        }}
                    />
                </StyledListItemButton>
            ))}
        </>
    );
};

export default TeacherSideBar;