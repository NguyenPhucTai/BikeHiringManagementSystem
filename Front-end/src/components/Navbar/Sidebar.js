
import React, { useState, Fragment } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { styled } from '@mui/material/styles';
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Drawer
} from "@material-ui/core";
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [managementCollapse, setManagementCollapse] = useState(false);

    const toggleSlider = () => {
        setOpen(!open);
    };

    const toggleManagement = () => {
        setManagementCollapse(!managementCollapse);
    }

    return (
        <Fragment>
            <Navbar key="lg" expand="lg" className="navbar-light px-3 sidebar" sticky="top" bg="light" role="navigation" collapseOnSelect>
                <IconButton
                    color="default"
                    aria-label="open drawer"
                    onClick={toggleSlider}
                    edge="start"
                    style={{ ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Navbar.Brand href="/">Rent Motorcycles</Navbar.Brand>
            </Navbar>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={toggleSlider}>
                        <CloseIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <Nav>
                    <List
                        style={{ width: '100%', maxWidth: 500, minWidth: 400 }}
                        component="nav"
                        aria-labelledby="nested-list-subheader">
                        <ListItem key={'dashboard'} disableGutters={true}>
                            <ListItemButton className="item-button" component="a" href="/dashboard">
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'managament'} disableGutters={true}>
                            <ListItemButton className="item-button" onClick={toggleManagement}>
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Management" />
                                {managementCollapse ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={managementCollapse} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem key={'category'} disableGutters={true} style={{ paddingLeft: 40 }}>
                                    <ListItemButton className="item-button" component="a" href="/manage/category">
                                        <ListItemIcon>
                                            <EditIcon className="item-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary="Manage Bike Category" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={'color'} disableGutters={true} style={{ paddingLeft: 40 }}>
                                    <ListItemButton className="item-button" component="a" href="/manage/color">
                                        <ListItemIcon>
                                            <EditIcon className="item-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary="Manage Bike Color" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={'manufacturer'} disableGutters={true} style={{ paddingLeft: 40 }}>
                                    <ListItemButton className="item-button" component="a" href="/manage/manufacturer">
                                        <ListItemIcon>
                                            <EditIcon className="item-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary="Manage Bike Manufacturer" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={'bike'} disableGutters={true} style={{ paddingLeft: 40 }}>
                                    <ListItemButton className="item-button" component="a" href="/manage/bike">
                                        <ListItemIcon>
                                            <EditIcon className="item-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary="Manage Bike" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem key={'order'} disableGutters={true} style={{ paddingLeft: 40 }}>
                                    <ListItemButton className="item-button" component="a" href="/manage/order">
                                        <ListItemIcon>
                                            <EditIcon className="item-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary="Manage Order" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem key={'cart'} disableGutters={true}>
                            <ListItemButton className="item-button" component="a" href="/manage/cart/create">
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Go to cart" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Nav>
            </Drawer>
        </Fragment>
    );
};

export default Sidebar;