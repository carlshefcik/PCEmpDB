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


export default class EditEmp extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      semesters: [],
      semSel: ''
    };
  }
  
  //will query db and then do this.setState() to set the values inside the employee form
  componentDidMount() {
    let {search} = this.props.location
    let sid = search.substring(5)
    console.log(sid)


    loadPage();

    function loadPage(){
      ipcRenderer.send('edit-get', sid)
    }
    ipcRenderer.once('edit-reply', (event, arg) => {
      // This will receive all the info from the employ across all semesters they have been here
      // We need to load the recent semester to the this.state to fill the form and have a selector at the top that lets you select which semester (or it could be individual tabs)
      // Saving will only save for that semester, (if tabs more straightforward since the button will be set on loading)

      //this should be a function that sets the data in the employee form
      this.setState({data: arg})
      console.log(arg)
      
      if(arg.length !== 0){
        for(let i=0; i<arg.length; i++){
          this.state.semesters.push(arg[i][0])
        }
        this.setState({semSel: arg[0][0]})
        this.fillEmployeeForm(arg[0][0])
      } else { 
        console.log('no data for employee')
      }
    })
  }

  formSubmission = (dataFromChild) => {
    // console.log(dataFromChild);
    // 1. take the data from the child and send if to the electron main
    let data = [this.state.semSel, dataFromChild]
    ipcRenderer.send('edit-post', data)
    ipcRenderer.once('edit-confirm', (event, arg) => {
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
    this.fillEmployeeForm(event.target.value)
  }

  fillEmployeeForm = (semester) => {
    for(let i=0; i<this.state.data.length; i++){
      if(this.state.data[i][0] === semester){
        this.refs.emp_form.fillForm(this.state.data[i])
      }
    }
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
              <h1>Edit Employee:</h1>
            </Col>
            <Col md={4} sm={6}>
              <h4>Semester: </h4>
              <Input type="select" bsSize="sm" value={this.state.semSel} onChange={e => this.changeSem(e) }>
                {semSelOptions}
              </Input>
            </Col>
          </Row>
          <hr/>
          <EmployeeForm ref="emp_form" onRef={ref => (this.emp_form = ref)} test={"tesing"} formSubmit={this.formSubmission.bind(this)}/>
          <br/>
          <Link to="/">
            <Button color="primary"> Go to Home </Button>
          </Link>
          <br/><br/>
          <h3>To do list: </h3>
          <p>
            1. Create and load more verbose datatypes into the parameters
          </p>

        </Jumbotron>
      </Container>
    )
  }
};
