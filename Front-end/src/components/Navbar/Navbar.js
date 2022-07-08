import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { NavDropdown, Navbar, Nav } from "react-bootstrap";
import { Home } from "@mui/icons-material";

const MenuBar = () => {

    return (
        <Fragment>
            <div className="test">
                <p>test</p>
            </div>
            <Navbar className="navbar-light px-3 px-lg-5" bg="light" expand="lg">
                <Link className="navbar-brand" to="/">Rent Motorcycles</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" variant="pills" defaultActiveKey="link-1">
                        <Nav.Link className="nav-item mx-lg-4" eventKey="link-1">
                            <Link className="nav-link" to="/"><Home /></Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item mx-lg-4" eventKey="link-2">
                            <Link className="nav-link" to="/about-us">About Us</Link>
                        </Nav.Link>
                        <Nav.Link className="nav-item mx-lg-4" eventKey="link-3">
                            <NavDropdown id="navbarDropdownMenuLink"
                                title="List of motorbikes"
                                menuVariant="light"
                                renderMenuOnMount={true}
                                rootCloseEvent={'mousedown'}>
                                <Link className="dropdown-item my-2" to="/list/manual">Manual Transmission Motorcycle</Link>
                                <Link className="dropdown-item my-2" to="/list/automatic">Automatic Transmission Motorcycle</Link>
                                <NavDropdown.Divider />
                                <Link className="dropdown-item my-2" to="/list">See all</Link>
                            </NavDropdown>
                        </Nav.Link>
                        <Nav.Link className="nav-item mx-lg-4" eventKey="link-4">
                            <Link className="nav-link" to="/contact-us">Contact us</Link>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </Fragment>
    )
}

export default MenuBar;