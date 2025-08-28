import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AnnouncementsIcon from '@mui/icons-material/Announcement';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import ReportIcon from '@mui/icons-material/Report';
import SubjectIcon from '@mui/icons-material/Subject';

const SideBar = () => {
    const location = useLocation();
    
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/' || location.pathname === '/Admin/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <React.Fragment>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon>
                        <HomeIcon color={isActive('/') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                
                <ListItemButton component={Link} to="/Admin/classes">
                    <ListItemIcon>
                        <ClassIcon color={isActive('/Admin/classes') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Classes" />
                </ListItemButton>
                
                <ListItemButton component={Link} to="/Admin/subjects">
                    <ListItemIcon>
                        <SubjectIcon color={isActive('/Admin/subjects') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Subjects" />
                </ListItemButton>
                
                <ListItemButton component={Link} to="/Admin/teachers">
                    <ListItemIcon>
                        <SchoolIcon color={isActive('/Admin/teachers') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Teachers" />
                </ListItemButton>
                
                <ListItemButton component={Link} to="/Admin/students">
                    <ListItemIcon>
                        <PeopleIcon color={isActive('/Admin/students') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Students" />
                </ListItemButton>
                
                <ListItemButton component={Link} to="/Admin/notices">
                    <ListItemIcon>
                        <AnnouncementsIcon color={isActive('/Admin/notices') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Announcements" />
                </ListItemButton>
                
                <ListItemButton component={Link} to="/Admin/complains">
                    <ListItemIcon>
                        <ReportIcon color={isActive('/Admin/complains') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItemButton>
            </React.Fragment>
            
            <Divider sx={{ my: 1 }} />
            
            <React.Fragment>
                <ListSubheader component="div" inset>
                    User
                </ListSubheader>
                <ListItemButton component={Link} to="/Admin/profile">
                    <ListItemIcon>
                        <AccountCircleIcon color={isActive('/Admin/profile') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton component={Link} to="/logout">
                    <ListItemIcon>
                        <ExitToAppIcon color={isActive('/logout') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </React.Fragment>
        </>
    )
}

export default SideBar