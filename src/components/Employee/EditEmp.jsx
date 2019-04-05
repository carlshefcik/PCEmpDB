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


export default class EditEmp extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    };
  }
  
  //will query db and then do this.setState() to set the values inside the employee form
  componentDidMount() {
    loadPage();

    function loadPage(){
      ipcRenderer.send('edit-get', 'edit-ping')
    }
    ipcRenderer.once('edit-reply', (event, arg) => {
      document.getElementById('dbtest').innerHTML = arg
      console.log(arg)
    })
  }

  formSubmission = (dataFromChild) => {
    console.log(dataFromChild);
  }

  render() {
    return (
      <Container>
        <Jumbotron>
          <h2>Edit Employee</h2>
          <hr/>
          <EmployeeForm test={"tesing"} formSubmit={this.formSubmission.bind(this)}/>
        </Jumbotron>
      </Container>
    )
  }
};
