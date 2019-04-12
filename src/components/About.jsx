import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'reactstrap';
import './Home.css';

// const electron = window.require('electron');
//const fs = electron.remote.require('fs');
// const ipcRenderer  = electron.ipcRenderer;


export default class About extends Component {
  

//   componentDidMount() {
//     loadPage();

//     function loadPage(){
//       ipcRenderer.send('employee-get', 'ping')
//     }
//     ipcRenderer.on('employee-reply', (event, arg) => {
//       document.getElementById('dbtest').innerHTML = arg
//       console.log(arg)
//     })
//   }

  render() {
    return (
      <Container>
        <Jumbotron>
            <h2>About Page:</h2>
            <hr/>
            <h3>Instructions:</h3>
            <p>1. Use it</p>
            <hr/>
            <h3>Known bugs:</h3>
            <p>1. None!</p>
            <hr/>
            <h3>Dev Info:</h3>
            <p>
                Github: https://github.com/carlshefcik/PCEmpDB<br/>
                Created by Carl Shefcik
            </p>

            <h4>Version</h4>
            <p>
              <strong>0.3:</strong> Using sid on search results to get to the edit page that queries the DB for the info<br/>
              <strong>0.2:</strong> Completed initial DB ERD and created search page functionality <br/>
              <strong>0.1:</strong> Initialized pages and created navigation components
            </p>


            <Link to="/">
              <Button color="primary"> Go to Home </Button>
            </Link>
        </Jumbotron>
      </Container>
    )
  }
};
