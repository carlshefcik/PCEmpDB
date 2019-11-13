import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Jumbotron, Container, Button, Form, FormGroup, Input, Row, Col, CustomInput, Modal, ModalBody, ModalFooter, Label, Table } from 'reactstrap';
import classnames from 'classnames';
import './Home.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class CourseAssignments extends Component {
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
              <h4>Create Class Sections</h4>

            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <h4>Add Professors</h4>
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              <h4>Edit Professors</h4>
            </NavLink>
          </NavItem> */}
        </Nav>

        <br/>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <AssignClassSection />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col>
                <AddProfessors/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col>
                <EditProfessors/>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        <br/>
        <h2>Course Assignments</h2>

        <h3>To do list: </h3>
        <p>
        1. Assign course for the semester to a proffessor and employee<br/>
        2. Add a proffessor to the DB (data is not semeser based)<br/>
        3. Edit a proffessor that is already in the db (would we ever need to do this?)<br/>
        4. During semester migration the data for the semester would need to be copied over in a seperate process from the employee data migration
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

class AssignClassSection extends Component {
  constructor(props){
    super(props);
    this.state = {
      classes: [],
      classSel: '',

      catalogNumber: '',
      newSectionVal: '',

      tempSecID: '',
      tempCatologNum: '',
      tempSection: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('classes-get', null)
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
    ipcRenderer.send('class-section-get', null)
    ipcRenderer.on('class-section-reply', (event, arg) => {
      if(arg){
        this.setState({classSectionList: arg})
      } else { 
        console.log('no class sections!!!?!?!')
      }
    })
  }

  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('class-section-reply')
  }

  changeSem = (event) => {
    //TODO this should change the table of class sections being displayed below 
    //?? ^^ what??
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

    let data = [this.state.catalogNumber, this.state.classSel, this.state.newSectionVal]
    console.log(data)

    ipcRenderer.send('class-section-add-post', data)
    ipcRenderer.once('class-section-add-confirm', (event, arg) => {
      console.log(arg)
      //trigger an alert on the screen
      if(arg){
        console.log("Data successfully saved!")
      } else {
        console.log("Something went wrong, your data might not have been saved!")
      }

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

  editClassSection = (class_section_id) => {
    //loads info
    this.state.classSectionList.forEach(e => {
      if(e['class_section_id'] === class_section_id)
        this.setState({tempCatologNum: e['catalog_number'], tempSecID: class_section_id, tempSection: e['section_number']})
    });
    this.toggleModal()
  }

  submidEditClassSection = () => {
    let data = [this.state.tempSecID, this.state.tempCatologNum, this.state.tempSection]

    ipcRenderer.send('class-section-edit-post', data)
    ipcRenderer.once('class-section-edit-confirm', (event, arg) => {
      ipcRenderer.send('class-section-get', null)
    })
    this.toggleModal()
  }

  render() {
    let classSelOptions = this.state.classes.map(tempClass => {
      return (
        <option value={tempClass['class_id']}>{tempClass['name']}</option>
      )
    })
    let classSectionList = this.state.classSectionList ? this.state.classSectionList.map(classSection => {
      return (
        <tr>
          <td>{classSection['subject']+' '+classSection['number']+' - '+classSection['section_number']}</td>
          <td><Button onClick={(e) => this.editClassSection(classSection['class_section_id'])} size="sm" color="danger">edit</Button></td>
        </tr>
      )
    }) : 'No class sections in db'
    return (
      <div>
        <Row>
          <Col md={3} sm={6}>
            <h5>Class: </h5>
            <Input type="select" bsSize="sm" value={this.state.classSel} onChange={e => this.changeClass(e) }>
              {classSelOptions}
            </Input>
          </Col>
          <Col md={4} sm={6}>
            <h5>Catalog Number: </h5>
            <FormGroup>
              <Input bsSize="sm" type="text" placeholder="Catalog Number..." value={this.state.catalogNumber} onChange={e => this.setState({catalogNumber: e.target.value})}/>
            </FormGroup>
          </Col>
          <Col md={5} sm={12}>
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
        <hr/>
        <Row>
          <Col md={6} sm={12}>
            <Table borderless hover size='sm'>
              <thead>
                <th>Class Section</th>
                <th></th>
              </thead>
              <tbody>
                {classSectionList}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          <ModalBody>
            {
              //TODO create form here that load the data and will submit the data
            }
            <Row>
              <Col md={12} sm={12}>
                <h5>Catalog Number: </h5>
                <FormGroup>
                  <Input bsSize="sm" type="text" placeholder="Catalog Number..." value={this.state.tempCatologNum} onChange={e => this.setState({tempCatologNum: e.target.value})}/>
                </FormGroup>
              </Col>
              <Col md={12} sm={12}>
                <h5>Section Number: </h5>
                <FormGroup>
                  <Input bsSize="sm" type="text" placeholder="Section Number..." value={this.state.tempSection} onChange={e => this.setState({tempSection: e.target.value})}/>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.submidEditClassSection}>Submit Changes</Button>{' '}
            <Button color="primary" onClick={this.toggleModal}>Close</Button>{' '}
          </ModalFooter>
        </Modal>

      </div>
      
    )
  }
};

class AddProfessors extends Component {
  constructor(props){
    super(props);
    this.state = {
      last_name: '',
      first_name: '',
      email: '',
      phone_number: '',
      department: '',

      professorList: [],

      pronouns: [],
      prounounSel: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('pronouns-get', null)
    ipcRenderer.once('pronouns-reply', (event, arg) => {
      this.setState({pronouns: arg, pronounSel: arg[0]['pronoun_id']})
    })

    ipcRenderer.send('prof-get', null)
    ipcRenderer.on('prof-reply', (event, arg) => {
      console.log(arg)
      if(arg){
        this.setState({profList: arg})
        // this.setState({subjectSel: arg[0]['subject_id']})
      } else { 
        console.log('no professors!!!?!?!')
      }
    })

  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('prof-reply')
  }

  formSubmission = () => {
    let data = [this.state.last_name, this.state.first_name, this.state.pronounSel, this.state.email, this.state.phone_number, this.state.department]
    console.log(data)

    ipcRenderer.send('prof-add-post', data)
    ipcRenderer.once('prof-add-confirm', (event, arg) => {
      ipcRenderer.send('prof-get', null)
      //trigger an alert on the screen
      console.log(arg)
      if(arg){
        this.setState({dbResultInfo: "Professor successfully saved!"})
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

  changePronounSel = (event) => { this.setState({pronounSel: event.target.value}) }

  toggleModal = () =>{
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    let pronounOptions = this.state.pronouns.map(pronoun => {
      return (
        <option value={pronoun['pronoun_id']}>{pronoun['pronoun']}</option>
      )
    })
    let profList = this.state.profList ? this.state.profList.map(prof => {
      return (
        <tr>
          <td>{prof['last_name'] +', '+ prof['first_name']}</td>
          <td>{prof['professor_id']}</td>
        </tr>
      )
    }) : 'No professors in db'
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col>
              <Row>
                <Col md={4} sm={6}>
                  <FormGroup>
                    <Input type="text" placeholder="First name..." value={this.state.first_name} onChange={e => this.setState({first_name: e.target.value})}/>
                  </FormGroup>
                </Col>
                <Col md={4} sm={6}>
                  <FormGroup>
                    <Input type="text" placeholder="Last name..." value={this.state.last_name} onChange={e => this.setState({last_name: e.target.value})}/>
                  </FormGroup>
                </Col>
                <Col md={4} sm={6}>
                  <FormGroup>
                    <Input id="pronouns" type="select" value={this.state.pronounSel} onChange={e => this.changePronounSel(e) }>
                      {pronounOptions}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4} sm={6}>
                  <FormGroup>
                    <Input type="text" placeholder="Department..." value={this.state.department} onChange={e => this.setState({department: e.target.value})}/>
                  </FormGroup>
                </Col>
                <Col md={4} sm={6}>
                  <FormGroup>
                    <Input type="text" placeholder="Email..." value={this.state.email} onChange={e => this.setState({email: e.target.value})}/>
                  </FormGroup>
                </Col>
                <Col md={4} sm={6}>
                  <FormGroup>
                    <Input type="text" placeholder="Phone number..." value={this.state.phone_number} onChange={e => this.setState({phone_number: e.target.value})}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    {/* textright doesnt work */}
                    <Button type="submit" className="text-center" color="primary" block>Add Professor</Button>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <hr/>
        <Row>
          <Col md={6} sm={12}>
            <Table borderless hover size='sm'>
              <thead>
                <th>Professor</th>
                <th></th>
              </thead>
              <tbody>
                {profList}
              </tbody>
            </Table>
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

class EditProfessors extends Component {
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