import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button } from 'reactstrap';
// import './Home.css';

import EmployeeForm from "./EmployeeForm"

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class AddEmp extends Component {
  
  componentDidMount() {
    //loadPage();
    // function loadPage(){
    //   ipcRenderer.send('employee-get', 'ping')
    // }
    ipcRenderer.once('employee-reply', (event, arg) => {
      document.getElementById('dbtest').innerHTML = arg
      console.log(arg)
    })
  }

  myCallback = (dataFromChild) => {
    console.log(dataFromChild);
  }

  render() {
    return (
      <Container>
        <Jumbotron>
          <h2>Add Employee</h2>
          <hr/>
          <EmployeeForm cb={this.myCallback}/>
        </Jumbotron>
      </Container>
    )
  }
};
