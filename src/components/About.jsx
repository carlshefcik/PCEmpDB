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
            <h2>About Page</h2>

            <h3>Instructions:</h3>
            <p>1. Use it</p>

            <h3>Known bugs:</h3>
            <p>1. None!</p>

            <h3>Dev Info:</h3>
            <p>Github: </p>
            <p>Created by Carl Shefcik</p>

            <h4>Version</h4>
            <p><strong>0.1:</strong> Initialized pages and created navigation components </p>


            <Link to="/">
              <Button color="primary"> Go to Home </Button>
            </Link>
        </Jumbotron>
      </Container>
    )
  }
};
