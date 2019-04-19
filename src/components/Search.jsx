import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button, Form, FormGroup, Input, Row, Col, CustomInput } from 'reactstrap';

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
      oldStaff: [],
    }
  }
  componentDidMount() {
  }

  render() {
    return (
      <Container>
        <Jumbotron>
          <DataTable onRef={ref => (this.dataTable = ref)} employed={this.state.employed} oldStaff={this.state.oldStaff}/>            
        </Jumbotron>
      </Container>
    )
  }
};

class DataTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      search_val: '',
      search_tutor: false,
      search_mentor: false,
      search_si : false,
      search_employed: true,
      search_option: 1,
      // employed: [],
      // oldStaff: [],
      dataTable: null,
      data: [[1,2,3],[1,2,3]] // needs temp for some reason
    }
  }

  componentDidMount() {
    //this.props.onRef(this)

    //initialize datatable
    // let table = 
    $(this.refs.table_id).DataTable({
      paging: false,
      info: false,
      searching: false
    })

    //this didnt work, need to wait for promise for immediate use on load
    // this.setState({dataTable: table})
    //console.log(this.state.dataTable)

    //TODO Load all the current employees to the list on page open
    this.searchDB()

    //can i set these up to get replies indefinitely here, I think so right?
    ipcRenderer.on('search-reply', (event, arg) => {
      //this.setState({employed: arg})
      this.setState({data: arg})
      // console.log('Search Success! Loading Results...')
    })

  }

  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('search-reply')
  }

  searchDB = () =>{
    //get the the search param state
    let searchParams = []
    searchParams.push(this.state.search_val)
    searchParams.push(this.state.search_tutor)
    searchParams.push(this.state.search_mentor)
    searchParams.push(this.state.search_si)
    searchParams.push(this.state.search_employed)
    searchParams.push(this.state.search_option)
    //look in the db, the reply will be pased by the icpRenderer
    ipcRenderer.send('search-get', searchParams)
  }
  
  onFormSubmit = (e) => {
    e.preventDefault()
    // console.log("Searching...")
    // console.log(this.state)
    //search the db with the params
    this.searchDB();
  }


  render() {

    //this creates the info inside the datatable
    let items = this.state.data.map(rowData => {
      let role = ''
      if(rowData[5] === 0) {role = 'Tutor'} else if (rowData[5] === 1) { role = 'Mentor'} else if (rowData[5] === 2) { role = 'SI'} else if (rowData[5] === 3) { role = 'WDSK'}
      return (
        <tr>
          <td>{rowData[3]}</td>
          <td>{rowData[2]}</td>
          <td>{rowData[1]}</td>
          <td>{role}</td>
          <td><Link to={"./EditEmp?sid="+rowData[1]}><Button color='primary' size='sm'>Info</Button></Link></td>
        </tr>
      )
    })

    //let element = React.createElement('Button', { children:"test"});
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={10} sm={9}>
              <FormGroup>
                <Input bsSize="lg" type="text" name="serach_input" id="search_input_id" placeholder="Search Employees..." value={this.state.search_val} onChange={e => this.setState({search_val: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={2} sm={3}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="primary" size="lg" block>Search</Button>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6} sm={12}>
              <FormGroup>
                <div>
                  <CustomInput inline type="radio" id="customRadio" name="customRadio" label="First Name" value={1} checked={this.state.search_option === 1} onChange={e => this.setState({search_option: 1})} />
                  <CustomInput inline type="radio" id="customRadio2" name="customRadio" label="Last Name" value={2} checked={this.state.search_option === 2} onChange={e => this.setState({search_option: 2})} />
                  <CustomInput inline type="radio" id="customRadio3" name="customRadio" label="SID" value={3} checked={this.state.search_option === 3} onChange={e => this.setState({search_option: 3})} />
                </div>
              </FormGroup>
            </Col>
            <Col md={6} sm={12}>
              <FormGroup>
                <div>
                  <CustomInput type="checkbox" id="tutor_check_id" label="Tutor" inline checked={this.state.search_tutor} onChange={e => this.setState({search_tutor: !this.state.search_tutor})}/>
                  <CustomInput type="checkbox" id="mentor_check_id" label="Mentor" inline checked={this.state.search_mentor} onChange={e => this.setState({search_mentor: !this.state.search_mentor})}/>
                  <CustomInput type="checkbox" id="si_check_id" label="SI" inline checked={this.state.search_si} onChange={e => this.setState({search_si: !this.state.search_si})}/>
                  <CustomInput type="checkbox" id="employed_check_id" label="Currently Employed" inline checked={this.state.search_employed} onChange={e => this.setState({search_employed: !this.state.search_employed})}/>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <hr/>
        <table ref='table_id' class="table table-striped table-hover table-sm">
          <thead class="thead-dark">
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>SID</th>
              <th>Role</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {items}
            {/* I think I will have to have it map a state object here from the results 
            and that is changed with the state and 
            I will delete the table and re initialize it and it will put what was here there allowing react elements */}
          </tbody>
        </table>
        <hr/>
        <Button onClick={e => console.log(this.state)}>log state</Button>
      </div>
      
    )
  }
};
