import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { TabContent, TabPane, Nav, NavItem, NavLink, Jumbotron, Container, Button, Form, FormGroup, Row, Col, Input, Modal, ModalBody, ModalFooter, Table } from 'reactstrap';
import classnames from 'classnames';
// import './Home.css';

import EmployeeForm from "./EmployeeForm"
import $ from "jquery";// eslint-disable-next-line



const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class EditEmp extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      semesters: [],
      semSel: '',
      sid:'',
      dbResultInfo:'',
      modal: false,
      activeTab: '1'
    };
  }
  
  //will query db and then do this.setState() to set the values inside the employee form
  componentDidMount() {
    let {search} = this.props.location
    let sid = search.substring(5)
    this.setState({sid: sid})
    console.log(sid)

    this.refs.addClass.setSID(sid)

    loadPage();

    function loadPage(){
      ipcRenderer.send('edit-get', sid)
    }

    ipcRenderer.once('edit-reply', (event, arg) => {
      // This will receive all the info from the employ across all semesters they have been here
      // We need to load the recent semester to the this.state to fill the form and have a selector at the top that lets you select which semester (or it could be individual tabs)
      // Saving will only save for that semester, (if tabs more straightforward since the button will be set on loading)

      //this should be a function that sets the data in the employee form
      // TODO redo
      this.setState({data: arg})
      console.log(arg)
      
      if(arg.length !== 0){
        for(let i=0; i<arg.length; i++){
          let tempSem = {name: ''+arg[i]['semester']+' '+arg[i]['year'], semester_id: arg[i]['semester_id']}
          this.state.semesters.push(tempSem) 
        }
        this.setState({semSel: arg[0]['semester_id']})
        this.fillEmployeeForm(arg[0]['semester_id'])
      } else { 
        console.log('no data for employee')
      }


    })
  }

  formSubmission = (dataFromChild) => {
    // console.log(dataFromChild);
    // 1. take the data from the child
    // 2. make multiple request the the electron main for the data for the employee

    // console.log(dataFromChild)
    // TODO add objects of the other elemets (stringths languages etc) to this array.
    let data = [dataFromChild]
    ipcRenderer.send('edit-post', data)
    ipcRenderer.once('edit-confirm', (event, arg) => {
      //trigger an alert on the screen
      if(arg){
        this.setState({dbResultInfo: "Data successfully saved!"})
        //reload data object to match data passed to database
        ipcRenderer.send('edit-get', this.state.sid)
        ipcRenderer.once('edit-reply', (event, arg) => {
          this.setState({data: arg})
        })
      } else {
        this.setState({dbResultInfo: "Something went wrong, your data might not have been saved!"})
      }
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      
    })
  }

  changeSem = (event) => {
    this.setState({semSel: event.target.value})
    this.fillEmployeeForm(event.target.value)
  }

  fillEmployeeForm = (semester_id) => {
    for(let i=0; i<this.state.data.length; i++){
      // eslint-disable-next-line
      if(this.state.data[i]['semester_id'] == semester_id){ // finds semester 
        this.refs.emp_form.fillForm(this.state.data[i]) //populates semester data into form
      }
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggle = (tab) =>{
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    let semSelOptions = this.state.semesters.map(semester => {
      return (
        <option value={semester['semester_id']}>{semester['name']}</option>
      )
    })
    return (
      <div>
        <Container>
        <br/>   
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              <h4>Edit Employee</h4>

            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <h4>Add/Remove Grades</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              <h4>Semester Assignments</h4>
            </NavLink>
          </NavItem>
        </Nav>

        <br/>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Container>
                  <Jumbotron>
                    <Row>
                      <Col md={4} sm={6}>
                        <h4>Semester: </h4>
                        <Input type="select" bsSize="sm" value={this.state.semSel} onChange={e => this.changeSem(e) }>
                          {semSelOptions}
                        </Input>
                      </Col>
                    </Row>
                    <hr/>
                    <EmployeeForm ref="emp_form" disabled={true} onRef={ref => (this.emp_form = ref)} formSubmit={this.formSubmission.bind(this)}/>
                    <br/>
                  </Jumbotron>
                </Container>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                  {/* <ModalHeader toggle={this.toggle}>Modal title</ModalHeader> */}
                  <ModalBody>
                    {this.state.dbResultInfo}
                  </ModalBody>
                  <ModalFooter>
                    <Link to={"./"}><Button color="secondary" onClick={this.toggle}>Home</Button></Link>
                    <Button color="primary" onClick={this.toggleModal}>Return</Button>{' '}
                  </ModalFooter>
                </Modal>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col>
                <AddClass ref="addClass" onRef={ref => (this.addClass = ref)}/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col>
                <SemesterAssignmnets />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Container>
      
      </div>
    )
  }
};


class AddClass extends Component {
  constructor(props){
    super(props);
    this.state = {
      sid: '',
      semesters: [],
      semSel: '',
      classes: [],
      subjectClasses: [],
      classSel: '',
      subjects: [],
      subjectSel: '',

      gradesList: [],

      classGrade_val: '',
      gradeTypes: [
        {grade: "A+", value: 4.0},
        {grade: "A", value: 3.7},
        {grade: "A-", value: 3.4},
        {grade: "B+", value: 3.3},
        {grade: "B", value: 3.0},
        {grade: "B-", value: 2.7},
        {grade: "C+", value: 2.3},
        {grade: "C", value: 2.0},
        {grade: "C-", value: 1.7},
        {grade: "D+", value: 1.3},
        {grade: "D", value: 1.0},
        {grade: "D-", value: 0.7},
        {grade: "F", value: 0.0},
      ],
      gradeTypeSel: 4.0
    }
  }

  componentDidMount() {
    ipcRenderer.send('classes-get', null)
    ipcRenderer.send('subject-get', null)
    ipcRenderer.send('semesters-get', null)
    // Pass the student ID here

    ipcRenderer.once('semesters-reply', (event, arg) => {
      if(arg.length !== 0){
        let tempSemesters= []
        for(let i=0; i<arg.length; i++){
          let tempSem = {name: ''+arg[i]['semester']+' '+arg[i]['year'], semester_id: arg[i]['semester_id']}
          tempSemesters.push(tempSem) 
        }
        this.setState({semesters: tempSemesters})
        this.setState({semSel: arg[0]['semester_id']})
      } else { 
        console.log('no semesters!!!?!?!')
      }
    })
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

    ipcRenderer.on('grades-list-reply', (event, arg) => {
      if(arg.length !== 0){
        let tempGradesList = []
        for(let i=0; i<arg.length; i++){
          let tempGrade = {
            grade_id: arg[i]['grade_id'],
            grade: this.grade(arg[i]['grade']), 
            value: arg[i]['grade'], 
            class_id: arg[i]['class_id'],
            class: arg[i]['subject']+' '+arg[i]['number'],
            semester: arg[i]['semester']+' '+arg[i]['year'],
          }
          tempGradesList.push(tempGrade) 
        }
        this.setState({gradesList: tempGradesList})
      } else {
        console.log('no grades!!!?!?!')
        this.setState({gradesList: []})
      }
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
    ipcRenderer.removeAllListeners('grades-list-reply')
  }

  addClassGrade = () => {
    let data = {
      semester_id: this.state.semSel,
      class_id: this.state.classSel,
      grade: this.state.gradeTypeSel,
      sid: this.state.sid
    }
    console.log(data)

    ipcRenderer.send('grade-add-post', data)
    ipcRenderer.once('grade-add-confirm', (event, arg) => {
      ipcRenderer.send('grades-list-get', this.state.sid)      
      console.log(arg) // checks to see if its successfull
    })
  }
  
  setSID = (sid) => {
    console.log(sid)
    this.setState({sid: sid})
    ipcRenderer.send('grades-list-get', sid)
  }
  
  onFormSubmit = (e) => {
    e.preventDefault()
    this.addClassGrade();
  }
  changeSem = (event) => {
    this.setState({semSel: event.target.value})
  }
  changeSubject = (event) => {
    this.setState({subjectSel: event.target.value})
    this.updateClasses(event.target.value)
  }
  changeClass = (event) => {
    this.setState({classSel: event.target.value})
  }
  changeGradeType = (event) => {
    this.setState({gradeTypeSel: event.target.value})
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

  removeClass = (grade_id) => {
    console.log(grade_id)
    ipcRenderer.send('grade-remove-post', grade_id)
    ipcRenderer.once('grade-remove-confirm', (event, arg) => {
      ipcRenderer.send('grades-list-get', this.state.sid)      
      console.log(arg) // checks to see if its successfull
    })
  }
  

  render() {
    let semSelOptions = this.state.semesters.map(semester => {
      return (
        <option value={semester['semester_id']}>{semester['name']}</option>
      )
    })
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
    let gradeOptions = this.state.gradeTypes.map(grade => {
      return (
        <option value={grade['value']}>{grade['grade']}</option>
      )
    })
    let classesList = this.state.gradesList.length !== 0 ? this.state.gradesList.map(grade => {
      return (
        <tr>
          <td>{grade['semester']}</td>
          <td>{grade['class']}</td>
          <td>{grade['grade']}</td>
          <td><Button onClick={(e) => this.removeClass(grade['grade_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    }) : 'No grades for employee'

    //let element = React.createElement('Button', { children:"test"});
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={3} sm={6}>
              <Input type="select" bsSize="lg" value={this.state.semSel} onChange={e => this.changeSem(e) }>
                {semSelOptions}
              </Input>
            </Col>
            <Col md={2} sm={6}>
              <FormGroup>
                <Input type="select" bsSize="lg" value={this.state.subjectSel} onChange={e => this.changeSubject(e) }>
                  {subjectOptions}
                </Input>
              </FormGroup>
            </Col>
            <Col md={2} sm={6}>
              <FormGroup>
                <Input type="select" bsSize="lg" value={this.state.classSel} onChange={e => this.changeClass(e) }>
                  {classOptions}
                </Input>
              </FormGroup>
            </Col>
            <Col md={2} sm={6}>
              <FormGroup>
                <Input type="select" bsSize="lg" value={this.state.gradeTypeSel} onChange={e => this.changeGradeType(e) }>
                  {gradeOptions}
                </Input>
              </FormGroup>
            </Col>
            <Col md={3} sm={6}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="primary" size="lg" block>Add Grade</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <hr/>
        <Row>
          <Col md={8}>
            <Table borderless hover>
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Class</th>
                  <th>Grade</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {classesList}
              </tbody>
            </Table>
          </Col>
        </Row>
        <hr/>
        {/* <Button onClick={e => console.log(this.state)}>log state</Button> */}
      </div>
      
    )
  }
};

class SemesterAssignmnets extends Component {
  constructor(props){
    super(props);
    this.state = {
      sid: '',
      semesters: [],
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    //this.props.onRef(null)
    // ipcRenderer.removeAllListeners('grades-list-reply')
  }

  render() {
    

    //let element = React.createElement('Button', { children:"test"});
    return (
      <div>
        <p>This will have the assingments for the semester listed. It will query the db and group the data for each semester onto a row that will be broken down per each semester.</p>
        <h2>Ex.</h2>
        <hr/>
        <h4>Fall 2018:</h4>
        <p>Tutor 
          <ul>
            <li>CS 146</li>
            <li>CS 46A</li>
            <li>CS 46B</li>
            <li>CS 151</li>
            <li>MATH 42</li>
            <li>MATH 31</li>
          </ul>
        </p>
        <hr/>
        <h4>Spring 2019:</h4>
        <p>Mentor | MAS 10B S4 | Professor ____ | Students: 80</p>
        <hr/>
        <h4>Fall 2019:</h4>
        <p>Mentor | MAS 10A S4 | Professor ____ | Students: 80</p>

        
        
        {/* <Button onClick={e => console.log(this.state)}>log state</Button> */}
      </div>
      
    )
  }
};