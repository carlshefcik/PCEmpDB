import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'reactstrap';

// eslint-disable-next-line
import bootstrap from "bootstrap"
import $ from "jquery";// eslint-disable-next-line
// import "datatables.net"// eslint-disable-next-line
import "datatables.net-bs4"// eslint-disable-next-line

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';

import "datatables.net-bs4/css/dataTables.bootstrap4.css"
import './Home.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;

// const $ = require("jquery");
// $.DataTable = require("datatables.net-bs4");


export default class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      employed: [],
      allStaff: [],
      emptoggle: true,
      test: []
    }
  }
  componentDidMount() {
    //TODO Load all the current employees to the list on page open
    loadPage();

    function loadPage(){
      ipcRenderer.send('search-get', 'ping')
    }
    ipcRenderer.once('search-reply', (event, arg) => {
      //this will have to insert it into the datatable and generate a url that goes to /EditEmp?id=id
      //I should have one array of current employees and one of all employees and when the data changes in the search parameter, I just load the correct data to the table
      this.setState(state => ({test: arg}));
      console.log(arg)
    })
    //for some reason the first call of this function doesnt toggle it
    this.empToggle()
  }

  empToggle = () =>{
    this.setState(state => { return { emptoggle: !state.emptoggle }});
    console.log(this.state)
    if(this.state.emptoggle){
      this.dataTable.setEmployed()
    } else {
      this.dataTable.setAllStaff()
    }
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
            <Button color="danger" onClick={this.empToggle}> Search </Button>

            <DataTable onRef={ref => (this.dataTable = ref)} employed={this.state.employed} allStaff={this.state.allStaff}/>


            <h4>Sample data retrieval:</h4>
            <p>{this.state.test}</p>
            
            <Link to="/">
              <Button color="primary"> Go to Home </Button>
            </Link>
        </Jumbotron>
      </Container>
    )
  }
};

class DataTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    this.props.onRef(this)
    // const columns = [
    //   {
    //       title: 'Name',
    //       width: 120,
    //       data: 'name'
    //   },
    //   {
    //       title: 'Nickname',
    //       width: 180,
    //       data: 'nickname'
    //   },
    // ];
    //call datatable on it
    $(this.refs.table_id).DataTable({
      paging: false,
      info: false
    })
  }
  componentWillUnmount() {
    this.props.onRef(null)
  }
  setEmployed = () =>{
    console.log("emp")
    this.setState({data: this.props.employed})
  }
  setAllStaff = () => {
    console.log("allstaff")
    this.setState({data: this.props.allStaff})
  }
  
  //create data table to be used
  method = () =>{
    //this might not be needed as state changes re render components. 
    //we can have the datatable render be apart of this
    console.log("got call")
  }
  render() {
    
    return (
      <div>
        <h1>Datatable</h1>
        <table ref="table_id" class="table table-striped table-hover table-sm">
          <thead class="thead-dark">
            <tr>
              <th>SID</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    )
  }
};
