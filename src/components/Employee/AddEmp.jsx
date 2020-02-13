import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Row, Col, Input, Modal, ModalBody, ModalFooter } from 'reactstrap';
// import './Home.css';

import EmployeeForm from "./EmployeeForm"

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class AddEmp extends Component {
  constructor(props){
    super(props);
    this.state = {
      semesters: [],
      semSel: '',
      dbResultInfo: '',
      modal: false,
      sid: '',
    };
  }
  
  componentDidMount() {
    loadServer();

    function loadServer(){
      ipcRenderer.send('semesters-get', null)
    }

    ipcRenderer.once('semesters-reply', (event, arg) => {
      // This will receive all the info from the employ across all semesters they have been here
      // We need to load the recent semester to the this.state to fill the form and have a selector at the top that lets you select which semester (or it could be individual tabs)
      // Saving will only save for that semester, (if tabs more straightforward since the button will be set on loading)

      //this should be a function that sets the data in the employee form
      console.log(arg)
      
      if(arg.length !== 0){
        for(let i=0; i<arg.length; i++){
          //* This will have to build the semesters for every one and have the values be the id, so make an object for each semester
          let tempSem = {name: ''+arg[i]['semester']+' '+arg[i]['year'], semester_id: arg[i]['semester_id']}
          this.state.semesters.push(tempSem) 
        }
        this.setState({semSel: arg[0]['semester_id']})
      } else { 
        console.log('no semesters!!!?!?!')
      }
    })
  }

  myCallback = (dataFromChild) => {
    console.log(dataFromChild);
  }

  formSubmission = (dataFromChild) => {
    // console.log(dataFromChild);
    // 1. take the data from the child and send it to the electron main
    let data = [this.state.semSel, dataFromChild]
    this.setState({sid: dataFromChild['sid']})
    ipcRenderer.send('add-post', data)
    ipcRenderer.once('add-confirm', (event, arg) => {
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

  changeSem = (event) => {
    this.setState({semSel: event.target.value})
  }

  toggleModal = () =>{
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
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
          <Jumbotron>
            <Row>
              <Col>
                <h2>Add Employee</h2>
              </Col>
              <Col md={6} sm={6}>
                <h4>Semester to add too: </h4>
                <Input type="select" bsSize="sm" value={this.state.semSel} onChange={e => this.changeSem(e) }>
                  {semSelOptions}
                </Input>
              </Col>
            </Row>
            <hr/>
            <EmployeeForm ref="emp_form" disabled={false} onRef={ref => (this.emp_form = ref)} formSubmit={this.formSubmission.bind(this)}/>
          </Jumbotron>
        </Container>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          {/* <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader> */}
          <ModalBody>
            {this.state.dbResultInfo}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.toggleModal}>Return</Button>{' '}
            <Link to={"./"}><Button color="secondary">Home</Button></Link>
            <Link to={"./EditEmp?sid="+this.state.sid}><Button color='primary'>Edit Employee</Button></Link>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
};
