import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'reactstrap';
import './Home.css';

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
              1. Create pages and navigation <br/>
              2. Create deployable react build using <code>npm run build</code> and electron-builder<br/>
              3. Create db structure<br/>
              4. Implement functionality on data entry and retrieval<br/>
              5. Implemet search<br/>
              6. Implement queries page<br/>
            </p>

            <h3>Optional: </h3>
            <p>
            1. Make pretty graphics
            </p>

            <h4>Notes</h4>
            <p>using the <code>&lt;link&gt;</code> tags is like using the <code>&lt;a&gt;</code> tag in react-router-dom</p>

            <hr/>


            <h4>Sample data retrieval:</h4>
            <p id="dbtest"> </p>


            
            <Link to="/">
              <Button color="primary"> Go to next page </Button>
            </Link>
        </Jumbotron>
      </Container>
    )
  }
};
