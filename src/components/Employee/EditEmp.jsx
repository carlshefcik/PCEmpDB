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
      this.refs.data_table.fillForm(arg);
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
          <h2>Employee Form</h2>

          <h3>To do list: </h3>
          <p>
            1. Create form <br/>
            2. Create this.state values to use this.props values when given that pass into it to load the form<br/>
            3. Figure out how to access the form data from the AddEmp and EditEmp pages
          </p>
          <hr/>
          <EmployeeForm ref="data_table" onRef={ref => (this.dataTable = ref)} test={"tesing"} formSubmit={this.formSubmission.bind(this)}/>
          <Link to="/">
            <Button color="primary"> Go to Home </Button>
          </Link>
        </Jumbotron>
      </Container>
    )
  }
};
