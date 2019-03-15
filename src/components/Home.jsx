import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'reactstrap';
import './Home.css';
//import {ipcRenderer} from 'electron';
//const { ipcRenderer } = window.require('electron');

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class Home extends Component {
  

  componentDidMount() {
    loadPage();

    function loadPage(){
      ipcRenderer.send('employee-get', 'ping')
    }
    ipcRenderer.on('employee-reply', (event, arg) => {
      document.getElementById('dbtest').innerHTML = arg
      console.log(arg)
    })
  }

  render() {
    return (
      <Container>
        <Jumbotron>
            <h2>Peer connections Database Project</h2>

            <h3>To do list: </h3>
            <p>
            1. 
            </p>

            <h3>Optional: </h3>
            <p>
            1. 
            </p>

            <h4>Notes</h4>
            <p>using the <code>&lt;link&gt;</code> tags is like using the <code>&lt;a&gt;</code> tag in react-router-dom</p>

            <h3 id="dbtest"> </h3>


            
            <Link to="/">
              <Button color="primary"> Go to next page </Button>
            </Link>
        </Jumbotron>
      </Container>
    )
  }
};
