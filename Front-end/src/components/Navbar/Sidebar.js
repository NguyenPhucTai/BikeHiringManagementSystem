
import React, { useState, Fragment } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { styled, useTheme } from '@mui/material/styles';
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
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Sidebar = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const toggleSlider = () => {
        setOpen(!open);
    };

    return (
        <Fragment>
            <Navbar key="lg" expand="lg" className="navbar-light px-3 sidebar" sticky="top" bg="light" role="navigation" collapseOnSelect>
                <div>
                    <IconButton
                        color="default"
                        aria-label="open drawer"
                        onClick={toggleSlider}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Navbar.Brand href="/">Rent Motorcycles</Navbar.Brand>
                </div>
                <div>
                    <a href="/manage/order/create" className="btn btn-primary">Create order</a>
                </div>
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
                    <List>
                        <ListItem key={'dashoard'} disableGutters={true}>
                            <ListItemButton className="item-button" component="a" href="/dashoard">
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'category'} disableGutters={true}>
                            <ListItemButton className="item-button" component="a" href="/manage/category">
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Manage Bike Category" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'color'} disableGutters={true}>
                            <ListItemButton className="item-button" component="a" href="/manage/color">
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Manage Bike Color" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'manufacturer'} disableGutters={true}>
                            <ListItemButton className="item-button" component="a" href="/manage/manufacturer">
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Manage Bike Manufacturer" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={'bike'} disableGutters={true}>
                            <ListItemButton className="item-button" component="a" href="/manage/bike">
                                <ListItemIcon>
                                    <EditIcon className="item-icon" />
                                </ListItemIcon>
                                <ListItemText primary="Manage Bike" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Nav>
            </Drawer>
        </Fragment>
    );
};

export default Sidebar;