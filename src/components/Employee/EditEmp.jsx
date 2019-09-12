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
    };
  }
  
  //will query db and then do this.setState() to set the values inside the employee form
  componentDidMount() {
    let {search} = this.props.location
    let sid = search.substring(5)
    this.setState({sid: sid})
    console.log(sid)


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
                <h1>Edit Employee:</h1>
              </Col>
              <Col md={4} sm={6}>
                <h4>Semester: </h4>
                <Input type="select" bsSize="sm" value={this.state.semSel} onChange={e => this.changeSem(e) }>
                  {semSelOptions}
                </Input>
              </Col>
            </Row>
            <hr/>
            <EmployeeForm ref="emp_form" disabled={true} onRef={ref => (this.emp_form = ref)} formSubmit={this.formSubmission.bind(this)}/>
            <br/><br/>
            <h3>To do list: </h3>
            <p>
              1. Create and load more verbose datatypes into the parameters
            </p>

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
      </div>
    )
  }
};
