import React, { useState, Fragment, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { styled } from '@mui/material/styles';
import {
    Badge,
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Cookies from 'universal-cookie';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Redux
import { useDispatch, useSelector } from "react-redux";
import { reduxAction } from "../../redux-store/redux/redux.slice";
import { reduxAuthenticateAction } from "../../redux-store/redux/reduxAuthenticate.slice";

// Fire base
import { AxiosInstance } from "../../api/AxiosClient";
import { OrderAPI } from "../../api/EndPoint";

const cookies = new Cookies();

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

// const handleBikeNumberInCart = async (setCarNumber, setLoadingPage) => {
//     await AxiosInstance.get(OrderAPI.cartGetBikeNumber, {
//         headers: { Authorization: `Bearer ${cookies.get('accessToken')}` }
//     }).then((res) => {
//         if (res.data.code === 1) {
//             setCarNumber(res.data.data);
//             setLoadingPage(false);
//         }
//     }).catch((error) => {
//         if (error && error.response) {
//             console.log("Error: ", error);
//         }
//     });
// }

const Sidebar = () => {

    const dispatch = useDispatch();
    // let cartNumberRedux = useSelector((state) => state.redux.cartNumber);


    const [open, setOpen] = useState(false);
    const [managementCollapse, setManagementCollapse] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // const [cartNumber, setCarNumber] = useState(-1);
    // const [loadingPage, setLoadingPage] = useState(true);

    // useEffect(() => {
    //     if (loadingPage === true) {
    //         handleBikeNumberInCart(setCarNumber, setLoadingPage);
    //     }
    // }, [loadingPage])

    // useEffect(() => {
    //     dispatch(reduxAction.setCartNumber(cartNumber));
    // }, [cartNumber])


    let userName = cookies.get('userName');

    const toggleSlider = () => {
        setOpen(!open);
    };

    const toggleManagement = () => {
        setManagementCollapse(!managementCollapse);
    }

    const handleLogOut = () => {
        cookies.remove('accessToken');
        cookies.remove('userName');
        dispatch(reduxAuthenticateAction.updateToken(null));
        dispatch(reduxAuthenticateAction.updateIsShowPublicNavBar(true));
        setTimeout(() => {
            window.location.replace('/signin');
        }, 500);
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <Navbar key="lg" expand="lg" className="navbar-light px-3 sidebar"
                sticky="top" bg="light" role="navigation" collapseOnSelect
                style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        color="default"
                        aria-label="open drawer"
                        onClick={toggleSlider}
                        edge="start"
                        style={{ ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Navbar.Brand href="/dashboard">Rent Motorcycles</Navbar.Brand>
                </div>
                <div>
                    {/* <IconButton aria-label="cart">
                        <Badge badgeContent={cartNumberRedux} color="secondary" max={999} showZero>
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton> */}
                    <Button className="btn-user" variant="outlined" onClick={handleMenu} startIcon={<AccountCircle style={{ fontSize: '32px' }} />}>{userName}</Button>
                    <Menu
                        style={{ marginTop: '40px' }}
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {/* <MenuItem className="user-menu" onClick={handleClose}>Profile</MenuItem> */}
                        <MenuItem className="user-menu" onClick={() => handleLogOut()}>Log out</MenuItem>
                    </Menu>
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
                                <ListItem key={'maintain'} disableGutters={true} style={{ paddingLeft: 40 }}>
                                    <ListItemButton className="item-button" component="a" href="/manage/maintain">
                                        <ListItemIcon>
                                            <EditIcon className="item-icon" />
                                        </ListItemIcon>
                                        <ListItemText primary="Manage Maintain" />
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