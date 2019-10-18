import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Jumbotron, Container, Button, Form, FormGroup, Input, Row, Col, CustomInput, Modal, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';
import './Home.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class Classes extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeTab: '1'
    };
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
        <br/>   
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              <h4>Manage Class Sections</h4>

            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <h4>Add/Edit Classes</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              <h4>Add Subjects</h4>
            </NavLink>
          </NavItem>
        </Nav>

        <br/>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <ManageSections/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col>
                <AddClass/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col>
                <AddSubject/>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        <br/>
        <h2>Classes</h2>

        <h3>To do list: </h3>
        <p>
        1. Create classes <br/>
        2. Edit classes?
        ---SEMESTER SPECIFIC INFO---
        1. Select classes <br/>
        2. Add class sections for the semseter (Professor?) (need to store professors in DB?)<br/>
        3. Another table stores Employees -> class sections<br/>
        </p>



        <Link to="/">
          <Button color="primary"> Go to Home </Button>
        </Link>
        <br/>
        <br/>
      </Container>
    )
  }
};

class ManageSections extends Component {
  constructor(props){
    super(props);
    this.state = {
      semesters: [],
      semSel: '',
      classes: [],
      classSel: '',
      newSectionVal: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('semesters-get', null)
    ipcRenderer.send('classes-get', null)

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
          let tempClass = {name: ''+arg[i]['subject']+' '+arg[i]['number'], class_id: arg[i]['class_id']}
          this.state.classes.push(tempClass) 
        }
        this.setState({classSel: arg[0]['class_id']})
      } else { 
        console.log('no classes!!!?!?!')
      }
    })
  }

  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('class-search-reply')
  }

  changeSem = (event) => {
    //TODO this should change the table of class sections being displayed below
    this.setState({semSel: event.target.value})
  }

  changeClass = (event) => {
    this.setState({classSel: event.target.value})
  }

  formSubmission = () => {
    //1. Get the data it needs
    //2. put it into an array
    //3. Send data
    //4. data is processed determining if it needs to update or insert into table
    //5. responce is sent confirming data stored

    let data = [this.state.semSel, this.state.classSel, this.state.newSectionVal]
    console.log(data)

    ipcRenderer.send('class-manage-post', data)
    ipcRenderer.once('class-manage-confirm', (event, arg) => {
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
  
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }

  render() {
    let semSelOptions = this.state.semesters.map(semester => {
      return (
        <option value={semester['semester_id']}>{semester['name']}</option>
      )
    })
    let classSelOptions = this.state.classes.map(tempClass => {
      return (
        <option value={tempClass['class_id']}>{tempClass['name']}</option>
      )
    })
    return (
      <div>
        <Row>
          <Col md={3} sm={6}>
            <h5>Semester: </h5>
            <Input type="select" bsSize="sm" value={this.state.semSel} onChange={e => this.changeSem(e) }>
              {semSelOptions}
            </Input>
          </Col>
          <Col md={3} sm={6}>
            <h5>Class: </h5>
            <Input type="select" bsSize="sm" value={this.state.classSel} onChange={e => this.changeClass(e) }>
              {classSelOptions}
            </Input>
          </Col>
          <Col md={6} sm={12}>
            <h5>Section Number: </h5>
            <Form onSubmit={this.onFormSubmit}>
              <Row form>
                <Col md={9} sm={10}>
                  <FormGroup>
                    <Input bsSize="sm" type="text" placeholder="Section Number..." value={this.state.newSectionVal} onChange={e => this.setState({newSectionVal: e.target.value})}/>
                  </FormGroup>
                </Col>
                <Col md={3} sm={2}>
                  <FormGroup>
                    {/* textright doesnt work */}
                    <Button type="submit" className="text-center" color="primary" size="sm" block>+</Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <br/>

        
        <hr/>

      </div>
      
    )
  }
};

class AddClass extends Component {
  constructor(props){
    super(props);
    this.state = {
      classes: [],
      // classSel: '',
      subjects: [],
      subjectSel: '',
      classNum_val: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('classes-get', null)
    ipcRenderer.send('subject-get', null)

    ipcRenderer.on('classes-reply', (event, arg) => {
      if(arg.length !== 0){
        let tempClasses = []
        for(let i=0; i<arg.length; i++){
          let tempClass = {name: ''+arg[i]['subject']+' '+arg[i]['number'], class_id: arg[i]['class_id']}
          tempClasses.push(tempClass) 
        }
        this.setState({classes: tempClasses})
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
        this.setState({subjectSel: arg[0]['subject_id']})
      } else { 
        console.log('no subjects!!!?!?!')
      }
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('classes-reply')
  }

  // TODO REDO
  formSubmission = () => {
    //1. Get the data it needs
    //2. put it into an array
    //3. Send data
    //4. data is processed determining if it needs to update or insert into table
    //5. responce is sent confirming data stored

    let data = [this.state.subjectSel, this.state.classNum_val]
    console.log(data)

    ipcRenderer.send('class-add-post', data)
    ipcRenderer.once('class-add-confirm', (event, arg) => {
      ipcRenderer.send('classes-get', null)
      //trigger an alert on the screen
      console.log(arg)
      if(arg){
        this.setState({dbResultInfo: "Class successfully saved!"})
      } else {
        this.setState({dbResultInfo: "Something went wrong, your data might not have been saved!"})
      }
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    })
  }
  
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }

  changeSubject = (event) => {
    this.setState({subjectSel: event.target.value})
  }

  toggleModal = () =>{
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    let classList = this.state.classes.map(tempClass => {
      return (
        <li value={tempClass['class_id']}>{tempClass['name']}</li>
      )
    })
    let subjectOptions = this.state.subjects.map(subject => {
      return (
        <option value={subject['subject_id']}>{subject['subject']}</option>
      )
    })
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={4} sm={6}>
              <FormGroup>
                <Input type="select" bsSize="lg" value={this.state.subjectSel} onChange={e => this.changeSubject(e) }>
                  {subjectOptions}
                </Input>
              </FormGroup>
            </Col>
            <Col md={5} sm={6}>
              <FormGroup>
                <Input bsSize="lg" type="text" name="classNum_input" id="classNum_input_id" placeholder="Class Number..." value={this.state.classNum_val} onChange={e => this.setState({classNum_val: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={3} sm={6}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="danger" size="lg" block>Add Class</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <hr/>
        <Row>
          <Col md={12} sm={12}>
            <h5>Class List: </h5>
            <ul>
              {classList}
            </ul>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          {/* <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader> */}
          <ModalBody>
            {this.state.dbResultInfo}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>Return</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
      
    )
  }
};

class AddSubject extends Component {
  constructor(props){
    super(props);
    this.state = {
      subjects: [],
      newSubjectVal: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('subject-get', null)

    ipcRenderer.on('subject-reply', (event, arg) => {
      if(arg.length !== 0){
        let tempSubjects = []
        for(let i=0; i<arg.length; i++){
          let tempSubject = {subject: arg[i]['subject'], subject_id: arg[i]['subject_id']}
          tempSubjects.push(tempSubject) 
        }
        this.setState({subjects: tempSubjects})
        // this.setState({subjectSel: arg[0]['subject_id']})
      } else { 
        console.log('no subjects!!!?!?!')
      }
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('subject-reply')
  }

  // TODO REDO
  formSubmission = () => {
    // let data = [this.state.semSel, dataFromChild]
    console.log(this.state.newSubjectVal)

    ipcRenderer.send('subject-create-post', this.state.newSubjectVal)
    ipcRenderer.once('subject-create-confirm', (event, arg) => {
      ipcRenderer.send('subject-get', null)
      //trigger an alert on the screen
      // console.log(arg)
      if(arg){
        this.setState({dbResultInfo: "Subject created successfully!"})
      } else {
        this.setState({dbResultInfo: "Something went wrong, your data might not have been saved!"})
      }
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    })
  }
  
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }

  toggleModal = () =>{
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    let subjectList = this.state.subjects.map(subject => {
      return (
        <li value={subject['subject_id']}>{subject['subject']}</li>
      )
    })
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={8} sm={6}>
              <FormGroup>
                <Input bsSize="lg" type="text" name="subject_input" id="subject_input_id" placeholder="New Subject..." value={this.state.newSubjectVal} onChange={e => this.setState({newSubjectVal: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={4} sm={6}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="danger" size="lg" block>Add Subject</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <hr/>
        <Row>
          <Col md={12} sm={12}>
            <h5>Subject List: </h5>
            <ul>
              {subjectList}
            </ul>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          {/* <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader> */}
          <ModalBody>
            {this.state.dbResultInfo}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>Return</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
      
    )
  }
};