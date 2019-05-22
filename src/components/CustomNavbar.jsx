import React, { Component } from 'react';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, } from 'reactstrap';
import { Link } from 'react-router-dom';
import './CustomNavbar.css';

import logo from './brand.png'

export default class CustomNavbar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand><Link to="/"><img src={logo} width="200" height="50" alt="" /></Link></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink ><Link to="/search">Search</Link></NavLink>
              </NavItem>
              <NavItem>
                <NavLink><Link to="/About">About</Link></NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink href="https://github.com/reactstrap/reactstrap">Reactstrap GitHub</NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink href="https://reactstrap.github.io/components/alerts">Reactstrap GitHub Components</NavLink>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    v 0.1
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
};
