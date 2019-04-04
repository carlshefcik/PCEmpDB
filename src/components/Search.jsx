import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'reactstrap';
import './Home.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class Search extends Component {
  componentDidMount() {
    //TODO Load all the current employees to the list on page open
    //create data table to be used
    loadPage();

    function loadPage(){
      ipcRenderer.send('search-get', 'ping')
    }
    ipcRenderer.once('search-reply', (event, arg) => {
      //this will have to insert it into the datatable and generate a url that goes to /EditEmp?id=id
      //I should have one array of current employees and one of all employees and when the data changes in the search parameter, I just load the correct data to the table
      document.getElementById('dbtest').innerHTML = arg
      console.log(arg)
    })
  }

  render() {
    return (
      <Container>
        <Jumbotron>
            <h2>SEARCH PAGE</h2>

            <h3>To do list: </h3>
            <p>
              1. Create page layout <br/>
              2. Create db queries <br/>
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
