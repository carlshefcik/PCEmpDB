import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Row, Col, Input } from 'reactstrap';
// import './Home.css';

import EmployeeForm from "./EmployeeForm"

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class AddEmp extends Component {
  constructor(props){
    super(props);
    this.state = {
      semesters: [],
      semSel: '',
    };
  }
  
  componentDidMount() {
    loadServer();

    function loadServer(){
      ipcRenderer.send('add-get', null)
    }

    ipcRenderer.once('add-reply', (event, arg) => {
      // This will receive all the info from the employ across all semesters they have been here
      // We need to load the recent semester to the this.state to fill the form and have a selector at the top that lets you select which semester (or it could be individual tabs)
      // Saving will only save for that semester, (if tabs more straightforward since the button will be set on loading)

      //this should be a function that sets the data in the employee form
      console.log(arg)
      
      if(arg.length !== 0){
        for(let i=0; i<arg.length; i++){
          this.state.semesters.push(arg[i])
        }
        this.setState({semSel: arg[0]})
      } else { 
        console.log('no semesters!!!?!?!')
      }
    })
  }

  myCallback = (dataFromChild) => {
    console.log(dataFromChild);
  }

  formSubmission = (dataFromChild) => {
    // console.log(dataFromChild);
    // 1. take the data from the child and send it to the electron main
    let data = [this.state.semSel, dataFromChild]
    ipcRenderer.send('add-post', data)
    ipcRenderer.once('add-confirm', (event, arg) => {
      //trigger an alert on the screen
      if(arg){
        alert("Data successfully saved!")
      } else {
        alert("Something went wrong, your data might not have been saved!")
      }
    })
  }

  changeSem = (event) => {
    this.setState({semSel: event.target.value})
  }

  render() {
    let semSelOptions = this.state.semesters.map(semester => {
      let values = semester.split('_')
      let option = values[1]+" "+values[2]
      return (
        <option value={semester}>{option}</option>
      )
    })
    return (
      <Container>
        <Jumbotron>
          <Row>
            <Col>
              <h2>Add Employee</h2>
            </Col>
            <Col md={6} sm={6}>
              <h4>Semester to add too: </h4>
              <Input type="select" bsSize="sm" value={this.state.semSel} onChange={e => this.changeSem(e) }>
                {semSelOptions}
              </Input>
            </Col>
          </Row>
          <hr/>
          <EmployeeForm ref="emp_form" disabled={false} onRef={ref => (this.emp_form = ref)} formSubmit={this.formSubmission.bind(this)}/>
        </Jumbotron>
      </Container>
    )
  }
};
