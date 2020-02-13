import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Row, Col, Input, Modal, ModalBody, ModalFooter } from 'reactstrap';
// import './Home.css';

import ProfForm from "./ProfForm"

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class AddProf extends Component {
  constructor(props){
    super(props);
    this.state = {
      professor_id:'',
      dbResultInfo: '',
      modal: false,
    };
  }
  
  componentDidMount() {

  }

  myCallback = (dataFromChild) => {
    console.log(dataFromChild);
  }

  formSubmission = (dataFromChild) => {
    // console.log(dataFromChild);
    // 1. take the data from the child and send it to the electron main
    let data = [dataFromChild]
    ipcRenderer.send('prof-add-post', data)
    ipcRenderer.once('prof-add-confirm', (event, arg) => {
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
    return (
      <div>
        <Container>
          <Jumbotron>
            <Row>
              <Col>
                <h2>Add Professor</h2>
              </Col>
            </Row>
            <hr/>
            <ProfForm ref="emp_form" disabled={false} onRef={ref => (this.emp_form = ref)} formSubmit={this.formSubmission.bind(this)}/>
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
            <Link to={"./EditProf?professor_id="+this.state.professor_id}><Button color='primary'>Edit Professor</Button></Link>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
};
