import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { TabContent, TabPane, Nav, NavItem, NavLink, Jumbotron, Container, Button, Form, FormGroup, Row, Col, Input, Modal, ModalBody, ModalFooter, Table } from 'reactstrap';
import classnames from 'classnames';
// import './Home.css';

import ProfForm from "./ProfForm"
import $ from "jquery";// eslint-disable-next-line



const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class EditProf extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      professor_id:'',
      dbResultInfo:'',
      modal: false,
      activeTab: '1'
    };
  }
  
  //will query db and then do this.setState() to set the values inside the employee form
  componentDidMount() {
    console.log(this.props.location)
    let {search} = this.props.location
    let professor_id = search.substring(14)
    this.setState({professor_id: professor_id})
    console.log(professor_id)

    //this.refs.addClass.setSID(professor_id)

    loadPage();

    function loadPage(){
      ipcRenderer.send('prof-edit-get', professor_id)
    }

    ipcRenderer.once('prof-edit-reply', (event, arg) => {
      this.setState({data: arg})
      console.log(arg)
      //load into the form
      this.fillProfForm();
      
    })
  }

  formSubmission = (dataFromChild) => {
    // console.log(dataFromChild);
    // 1. take the data from the child
    // 2. make multiple request the the electron main for the data for the employee

    // console.log(dataFromChild)
    //* add objects of the other elemets (stringths languages etc) to this array.
    let data = [dataFromChild]
    ipcRenderer.send('prof-edit-post', data)
    ipcRenderer.once('prof-edit-confirm', (event, arg) => {
      //trigger an alert on the screen
      if(arg){
        this.setState({dbResultInfo: "Data successfully saved!"})
        //reload data object to match data passed to database
        // ipcRenderer.send('prof-edit-get', this.state.sid)
        // ipcRenderer.once('prof-edit-reply', (event, arg) => {
        //   this.setState({data: arg})
        // })
      } else {
        this.setState({dbResultInfo: "Something went wrong, your data might not have been saved!"})
      }
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      
    })
  }

  fillProfForm = () => {
    this.refs.prof_form.fillForm(this.state.data[0]) 
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
              <h4>Edit Professor</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
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
                    <ProfForm ref="prof_form" disabled={true} onRef={ref => (this.prof_form = ref)} formSubmit={this.formSubmission.bind(this)}/>
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
    // this.props.onRef(null)
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