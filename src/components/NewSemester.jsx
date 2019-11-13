import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button, Row, Col, Input, Modal, ModalBody, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';
import './Home.css';

import EmployeeForm from "./Employee/EmployeeForm"

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class NewSemester extends Component {
  constructor(props){
    super(props);
    this.state = {
      dbResultInfo: '',
      modal: false,
      data: [],
      semesters: [],
      terms: [ "Fall", "Spring" ],
      years: [],
      prevSemSel: '',
      prevSemEmployeesList: [],
      selectedEmployeeSID: '',

      nextYearSel: '',
      nextTermSel: '',
      newSemEmployeesList: [],
    };
  }

  componentDidMount() {
    ipcRenderer.send('semesters-get', null)
    
    ipcRenderer.once('semesters-reply', (event, arg) => {
      // This will receive all the info from the employ across all semesters they have been here
      // We need to load the recent semester to the this.state to fill the form and have a selector at the top that lets you select which semester (or it could be individual tabs)
      // Saving will only save for that semester, (if tabs more straightforward since the button will be set on loading)

      //this should be a function that sets the data in the employee form
      console.log(arg.length)
      if(arg.length !== 0){
        for(let i=0; i<arg.length; i++){
          let tempSem = {name: ''+arg[i]['semester']+' '+arg[i]['year'], semester_id: arg[i]['semester_id']}
          this.state.semesters.push(tempSem) 
        }
        this.setState({prevSemSel: arg[0]['semester_id']})
      } else { 
        console.log('no semesters!!!?!?!')
      }


      ipcRenderer.send('semEmployees-get', arg[0]['semester_id']); //arg[0] is the prevSemSel
      ipcRenderer.on('semEmployees-reply', (event, arg) => {
        //set the state
        this.setState({prevSemEmployeesList: arg})
      })


      // Sets the year select and populates the years array
      let today = new Date();
      this.setState({nextYearSel: today.getFullYear()})
      let years = [];
      for (let i=-(Math.ceil(arg.length/2) < 7 ? 7 : Math.ceil(arg.length/2)); i <= 2; i++){
        // gets the 7 prevous years and the next 2
        years.push(today.getFullYear() + i);
      }
      this.setState({years: years})
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('semEmployees-reply')
  }

  changeNextYearSel = (event) => {
    this.setState({nextYearSel: event.target.value})
  }
  changeNextTermSel = (event) => {
    this.setState({nextTermSel: event.target.value})
  }

  updateNextSemList = () => {
    //TODO query the database and get the list of employees from that semester but 
      //if the table doesnt exist then create one (will probably have to check before the query?)
  }

  addSem = () => {
    // adds semester to the database page
    // opens up a panel below 
    // Panel populates with employees from previous semester and the selected new semester (fi you've already started this process/its an old semester
    // Select employees to move over or move back
    // Every selection will be its own individual query
    // Back to main menu button on bottom
  }

  changePrevSem = (event) => {
    this.setState({prevSemSel: event.target.value})
    //TODO query the database for the a list of all the employees from that semester getting their (first_name, last_name, sid) and storing it in an array.
    ipcRenderer.send('semEmployees-get', event.target.value);
  }

  nextSemEmployeeAdd = (dataFromChild) => {
    let data = [this.state.nextTermSel, this.state.nextYearSel, dataFromChild]
    ipcRenderer.send('nextSem-post', data)
    ipcRenderer.once('nextSem-confirm', (event, arg) => {
      //trigger an alert on the screen
      if(arg){
        this.setState({dbResultInfo: "Data successfully saved!"})
      } else {
        this.setState({dbResultInfo: "Something went wrong, your data might not have been saved!"})
      }
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    })
  }

  //Called when clicking on the list item
  loadPrevSelectedEmpToForm = (event) => {
    console.log(event.target.value)
  }

  toggleModal = () =>{
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    let prevSemSelOptions = this.state.semesters.map(semester => {
      //TODO maybe make this a table with a button that moves it over
      return (
        <option value={semester['semester_id']}>{semester['name']}</option>
      )
    })
    let yearSelOptions = this.state.years.map(year => {
      return (
        <option value={year}>{year}</option>
      )
    })
    let termSelOptions = this.state.terms.map(terms => {
      return (
        <option value={terms}>{terms}</option>
      )
    })

    let prevSemEmployeesList = this.state.prevSemEmployeesList.map(emp => {
      //TODO add functional
      return (
        <ListGroupItem value={emp['id']}>{emp['first_name']+" "+emp['last_name']}</ListGroupItem>
      )
    })
    
    // let nextSemEmployeesList = this.state.nextSemEmployees.map(emp => {
    //   return (
    //     <li>{emp['first_name']+" "+emp['last_name']}</li>
    //   )
    // })
    
    return (
      <div>
        <Container>
          <Jumbotron>
            <div>
              {/* Ths will load this component and then fill out to columns */}
              <Row>
                <Col md={6}>
                  <Row>
                    <Col md={8}>
                      {/* load people from selected semester */}
                      <h5>Previous Semester to get From: </h5>
                      <Input type="select" bsSize="sm" value={this.state.prevSemSel} onChange={e => this.changePrevSem(e) }>
                        {prevSemSelOptions}
                      </Input>
                      
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                      <h5>Click the employee to move to their info from the previous selected semester to the next selected semester: </h5>
                      <ListGroup onClick={e => this.loadPrevSelectedEmpToForm(e)}>
                        {prevSemEmployeesList}
                      </ListGroup>
                    </Col>
                  </Row>
                  
                </Col>

                <Col md={6}>
                  <Row>
                    <Col md={8} >
                      <h5>Term: </h5>
                      <Input type="select" bsSize="sm" value={this.state.nextTermSel} onChange={e => this.changeNextTermSel(e) }>
                        {termSelOptions}
                      </Input>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                      <h5>Year: </h5>
                      <Input type="select" bsSize="sm" value={this.state.nextYearSel} onChange={e => this.changeNextYearSel(e) }>
                        {yearSelOptions}
                      </Input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ul>
                        {/* {nextSemEmployeesList} */}
                      </ul>
                    </Col>
                  </Row>
                </Col>

              </Row>
            </div>

            <hr/>
            {/* TODO MAKE BUTTON CONFIGURABLE (for this will let you save the data to prev semester) AND ADD BUTTON IN EMPLOYEE FORM THAT CAN BE DISABLED THAT WILL SAY SAY "Confirm and add to new semester" that will submit the data the same way*/}
            <EmployeeForm ref="emp_form" disabled={true} onRef={ref => (this.emp_form = ref)} formSubmit={this.nextSemEmployeeAdd.bind(this)}></EmployeeForm>


            <br/>
            <Button color="success" onClick={this.toggleModal}>Comfirm Changes</Button>{' '}


            <h2>New Semester</h2>

            <h3>To do list: </h3>
            <p>
              1. Create page layout <br/>
              1.1. Create list items generated from the stae and updated on the select change. <br/>
              1.2. Implement employee form to be loaded when selecting an employee from the old semester list and have confim button that will then add the data to the database.<br/>
              1.3. When selecting a 'next' semseter that hasnt been made yet, deploy a modal confirming that it will create the new semester entry.
              2. Create db queries <br/>
            </p>

            
          </Jumbotron>
        </Container>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          {/* <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader> */}
          <ModalBody>
            {this.state.dbResultInfo}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>Return</Button>{' '}
            <Link to={"./"}><Button color="secondary">Home</Button></Link>
            {/* <Link to={"./search"}><Button color='primary'>Edit Employees</Button></Link> */}
          </ModalFooter>
        </Modal>
      </div>
    )
  }
};
