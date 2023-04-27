import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { BiSearch, BiUserCircle } from 'react-icons/bi';

import './nav-style.css';


function NavigationBar({ isLoggedIn }) {
  const [query, setQuery] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    window.location.href="/Search?query="+ query + "&page=1";
};

  function logoutUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    window.location.href = '/';
  }

  function myRecipes() {
    if (isLoggedIn){
      window.location.href = '/UserRecipes/' + localStorage.getItem('user');
    }
    else {
      window.location.href = '/Login';
    }
  }

  function viewProfile() {
    if (isLoggedIn) {
      window.location.href = '/Profile/' + localStorage.getItem('user');
    }
    else {
      window.location.href = '/Login';
    }
  }

  return (
    <Navbar bg="dark" variant="dark" sticky="top" expand="md">
      <Navbar.Brand href="/">easy chef</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarToggleExternalContent" />
      <Navbar.Collapse id="navbarToggleExternalContent">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link onClick={myRecipes}>My Recipes</Nav.Link>
            <Nav.Link href="/Create">Create</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Form className="d-flex me-2" onSubmit={handleFormSubmit}>
              <Form.Group controlId="formBasicContent">
                <Form.Control
                    type="text"
                    placeholder="Search recipes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
              </Form.Group>
              <Button variant="outline-secondary" type="submit"><BiSearch /></Button>
            </Form>
            <Dropdown align="end">
              <Dropdown.Toggle variant="none" as={Button}>
                <BiUserCircle size={25} style={{ color: 'white' }}/>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={viewProfile}>My Profile</Dropdown.Item>
                <Dropdown.Item href="/Profile/Edit">Edit Profile</Dropdown.Item>
                <Dropdown.Item href="/Cart">Shopping List</Dropdown.Item>
                {isLoggedIn ? (
                  <Dropdown.Item onClick={logoutUser}>Logout</Dropdown.Item>
                ) : (
                  <Dropdown.Item href="/Login">Login</Dropdown.Item>
                )}
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
