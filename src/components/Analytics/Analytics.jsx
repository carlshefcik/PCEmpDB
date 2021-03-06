import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'reactstrap';
// import './Home.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class Analytics extends Component {
  

  componentDidMount() {
    loadPage();

    function loadPage(){
      ipcRenderer.send('employee-get', 'ping')
    }
    ipcRenderer.once('employee-reply', (event, arg) => {
      document.getElementById('dbtest').innerHTML = arg
      console.log(arg)
    })
  }

  render() {
    return (
      <Container>
        <Jumbotron>
            <h2>Analytics page</h2>

            <h3>To do list: </h3>
            <p>
              1. Create page layout <br/>
              2. Create each compenent (Tutors, Mentors, SI Leaders, Proffessors, Classes) <br/>
              3. Create and implement db queries <br/>
            </p>

            <h4>Notes</h4>
            <p>using the <code>&lt;link&gt;</code> tags is like using the <code>&lt;a&gt;</code> tag in react-router-dom</p>

            <hr/>

            <h4>Sample data retrieval:</h4>
            <p id="dbtest"> </p>
            
            <Link to="/">
              <Button color="primary"> Go to Home </Button>
            </Link>
        </Jumbotron>
      </Container>
    )
  }
};
