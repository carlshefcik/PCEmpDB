import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button, Row, Col, Input } from 'reactstrap';
import './Home.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class NewSemester extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      semesters: [],
      yearSel: '',
      termSel: '',
    };
  }

  componentDidMount() {
    loadPage();

    function loadPage(){
      // This will give a list of semesters used
      ipcRenderer.send('semesters-get', 'ping')
      // should have a table in the databse that is just full of 100 years worth of semesters
      // select from semester_tables where not equal to any used semester in the semseter list
    }
    ipcRenderer.once('semesters-reply', (event, arg) => {
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

  addSem = () => {
    // adds semester to the database page
    // opens up a panel below 
    // Panel populates with employees from previous semester and the selected new semester (fi you've already started this process/its an old semester
    // Select employees to move over or move back
      // Every selection will be its own individual query
    // Back to main menu button on bottom
  }

  changeYear = (event) => {
    this.setState({yearSel: event.target.value})
  }
  changeTerm = (event) => {
    this.setState({termSel: event.target.value})
  }

  render() {
    let yearSelOptions = this.state.semesters.map(semester => {
      let values = semester.split('_')
      let option = values[2]
      return (
        <option value={option}>{option}</option>
      )
    })
    let termSelOptions = this.state.semesters.map(semester => {
      let values = semester.split('_')
      let option = values[1]
      return (
        <option value={option}>{option}</option>
      )
    })
    return (
      <Container>
        <Jumbotron>

          <Row>
            <Col md={4} sm={6}>
              <h4>Year: </h4>
              <Input type="select" bsSize="sm" value={this.state.yearSel} onChange={e => this.yearSem(e) }>
                {yearSelOptions}
              </Input>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={6}>
              <h4>Term: </h4>
              <Input type="select" bsSize="sm" value={this.state.termSel} onChange={e => this.termSem(e) }>
                {termSelOptions}
              </Input>
            </Col>
          </Row>

          


          <h2>New Semester</h2>

          <h3>To do list: </h3>
          <p>
            1. Create page layout <br/>
            2. Create db queries <br/>
          </p>

          
          <Link to="/">
            <Button color="primary"> Go to Home </Button>
          </Link>
        </Jumbotron>
      </Container>
    )
  }
};
