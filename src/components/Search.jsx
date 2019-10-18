import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Jumbotron, Container, Button, Form, FormGroup, Input, Table, Row, Col, CustomInput } from 'reactstrap';
import classnames from 'classnames';

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
      activeTab: '1'
    }
  }
  componentDidMount() {
  }

  toggle = (tab) =>{
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <Container>
        <Jumbotron>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggle('1'); }}
              >
                <h4>Employee Search</h4>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => { this.toggle('2'); }}
              >
                <h4>Class Search</h4>
              </NavLink>
            </NavItem>
          </Nav>

          <br/>

          <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <DataTable onRef={ref => (this.dataTable = ref)}/> 
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col>
                <DataTable2 onRef={ref => (this.dataTable2 = ref)}/> 
              </Col>
            </Row>
          </TabPane>
        </TabContent>
                     
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
      data: [0] // needs temp for some reason
    }
  }

  componentDidMount() {
    // Loads all the current employees to the list on page open
    this.searchDB()

    // takes reply and adds it to the data
    ipcRenderer.on('search-reply', (event, arg) => {
      console.log(arg)
      //removes old reference of datatable
      $(this.refs.table_id).DataTable().destroy()

      //sets the data inside the table
      this.setState({data: arg})

      //initializes the datatable
      $(this.refs.table_id).DataTable({
        paging: false,
        info: false,
        searching: false,
        columnDefs: [{
          targets: 4,
          searchable: false,
          orderable: false,
        }],
      })
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
    // TODO redo this employed part
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
      if(rowData['role'] === -1) {role = 'N/A'} else if(rowData['role'] === 0) {role = 'Tutor'} else if (rowData['role'] === 1) { role = 'Mentor'} else if (rowData['role'] === 2) { role = 'SI'} else if (rowData['role'] === 3) { role = 'WDS'}
      return (
        <tr>
          <td>{rowData['first_name']}</td>
          <td>{rowData['last_name']}</td>
          <td>{rowData['sid']}</td>
          <td>{role}</td>
          <td><Link to={"./EditEmp?sid="+rowData['sid']}><Button color='primary' size='sm'>Info</Button></Link></td>
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
            {/* I think I will have to have it map a state object here from the results and that is changed with the state and I will delete the table and re initialize it and it will put what was here there allowing react elements */}
          </tbody>
        </table>
        <hr/>
        {/* <Button onClick={e => console.log(this.state)}>log state</Button> */}
      </div>
      
    )
  }
};

class DataTable2 extends Component {
  constructor(props){
    super(props);
    this.state = {
      classes: [],
      subjectClasses: [],
      classSel: '',
      subjects: [],
      subjectSel: '',

      // search_val: '',
      dataTable: null,
      data: [0] // needs temp for some reason
    }
  }

  componentDidMount() {
    ipcRenderer.send('classes-get', null)
    ipcRenderer.send('subject-get', null)

    ipcRenderer.once('classes-reply', (event, arg) => {
      if(arg.length !== 0){
        for(let i=0; i<arg.length; i++){
          let tempClass = {number: arg[i]['number'], class_id: arg[i]['class_id'], subject_id: arg[i]['subject_id']}
          this.state.classes.push(tempClass) 
        }
        // this.setState({classSel: arg[0]['class_id']})
      } else {
        console.log('no classes!!!?!?!')
      }
    })

    ipcRenderer.once('subject-reply', (event, arg) => {
      if(arg.length !== 0){
        for(let i=0; i<arg.length; i++){
          let tempSubject = {subject: arg[i]['subject'], subject_id: arg[i]['subject_id']}
          this.state.subjects.push(tempSubject) 
        }
        // this.setState({subjectSel: arg[0]['subject_id']}) 
        this.updateClasses(arg[0]['subject_id']) //sets the subject select and the class select options
      } else { 
        console.log('no subjects!!!?!?!')
      }
    })

    // this.searchDB()

    // takes reply and adds it to the data
    ipcRenderer.on('class-search-reply', (event, arg) => {
      console.log(arg)
      //removes old reference of datatable
      $(this.refs.table_id).DataTable().destroy()

      //sets the data inside the table
      this.setState({data: arg})

      //initializes the datatable
      $(this.refs.table_id).DataTable({
        paging: false,
        info: false,
        searching: false,
        columnDefs: [{
          targets: 5,
          searchable: false,
          orderable: false,
        }],
      })
    })
  }

  grade = (gp) => {
    if(gp == 4)
      return 'A+'
    else if (gp == 3.7)
      return 'A'
    else if (gp == 3.4)
      return 'A-'
    else if (gp == 3.3)
      return 'B+'
    else if (gp == 3.0)
      return 'B'
    else if (gp == 2.7)
      return 'B-'
    else if (gp == 2.3)
      return 'C+'
    else if (gp == 2.0)
      return 'C'
    else if (gp == 1.7)
      return 'C-'
    else if (gp == 1.3)
      return 'D+'
    else if (gp == 1.0)
      return 'D'
    else if (gp == 0.7)
      return 'D-'
    else if (gp == 0)
      return 'F'
  }

  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('class-search-reply')
  }

  searchDB = () => {
    console.log(this.state.classSel)
    //get the the search param state
    if(this.state.classSel !== ""){
      // let searchParams = []
      // searchParams.push(this.state.search_val)
      //look in the db, the reply will be pased by the icpRenderer
      ipcRenderer.send('class-search-get', this.state.classSel)
    }
  }
  
  onFormSubmit = (e) => {
    e.preventDefault()
    this.searchDB();
  }
  
  changeSubject = (event) => {
    this.setState({subjectSel: event.target.value})
    this.updateClasses(event.target.value)
  }
  changeClass = (event) => {
    this.setState({classSel: event.target.value})
  }
  updateClasses = (subject_id) => {
    console.log(subject_id)
    let tempData = this.state.classes
    let tempSC = []
    // Changes class number selection here or do it in the render
    for(let i=0; i < tempData.length; i++){
      if(tempData[i]['subject_id'] == subject_id)
        tempSC.push(tempData[i])
    }
    this.setState({subjectClasses: tempSC})
    if(tempSC.length >= 1)
      this.setState({classSel: tempSC[0]['class_id']})
    else
      this.setState({classSel: null})
  }
  

  render() {
    let classOptions = this.state.subjectClasses.map(tempClass => {
      return (
        <option value={tempClass['class_id']}>{tempClass['number']}</option>
      )
    })
    let subjectOptions = this.state.subjects.map(subject => {
      return (
        <option value={subject['subject_id']}>{subject['subject']}</option>
      )
    })

    //this creates the info inside the datatable
    let items = this.state.data.map(rowData => {
      // TODO remove this role part and make it in the database?
      let role = ''
      if(rowData['role'] === -1) {role = 'N/A'} else if(rowData['role'] === 0) {role = 'Tutor'} else if (rowData['role'] === 1) { role = 'Mentor'} else if (rowData['role'] === 2) { role = 'SI'} else if (rowData['role'] === 3) { role = 'WDS'}
      return (
        <tr>
          <td>{this.grade(rowData['grade'])}</td>
          <td>{rowData['first_name']}</td>
          <td>{rowData['last_name']}</td>
          <td>{rowData['sid']}</td>
          <td>{role}</td>
          <td><Link to={"./EditEmp?sid="+rowData['sid']}><Button color='primary' size='sm'>Info</Button></Link></td>
        </tr>
      )
    })

    //let element = React.createElement('Button', { children:"test"});
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={5} sm={6}>
              <FormGroup>
                <Input type="select" bsSize="lg" value={this.state.subjectSel} onChange={e => this.changeSubject(e) }>
                  {subjectOptions}
                </Input>
              </FormGroup>
            </Col>
            <Col md={5} sm={6}>
              <FormGroup>
                <Input type="select" bsSize="lg" value={this.state.classSel} onChange={e => this.changeClass(e) }>
                  {classOptions}
                </Input>
              </FormGroup>
            </Col>
            <Col md={2} sm={4}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="primary" size="lg" block>Search</Button>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            {/* <Col md={6} sm={12}>
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
            </Col> */}
          </Row>
        </Form>
        <hr/>
        <table ref='table_id' class="table table-striped table-hover table-sm">
          <thead class="thead-dark">
            <tr>
              <th>Grade</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>SID</th>
              <th>Role</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {items}
            {/* I think I will have to have it map a state object here from the results and that is changed with the state and I will delete the table and re initialize it and it will put what was here there allowing react elements */}
          </tbody>
        </table>
        <hr/>
        <p>Currently showing grades for currently employed students</p>
        {/* <Button onClick={e => console.log(this.state)}>log state</Button> */}
      </div>
      
    )
  }
};