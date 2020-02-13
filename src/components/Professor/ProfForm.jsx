import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Input, Row, Col, FormGroup, Label, Table, Form, CustomInput } from 'reactstrap';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;
// import './Home.css';


export default class ProfForm extends Component {
  //this.state will be internaly and can see when things are changed
  constructor(props) {
    super(props);

    // console.log(this.props);
    this.state = {
        professor_id: '',
        last_name:'',
        first_name:'',
        pronoun_id:1,
        email:'',
        phone_number:'',
        subject_id:'',

        pronouns:[]
    };
  }

  //this.props are passes in by parameter names
  componentDidMount() {
    this.loadData();
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('strengths-list-reply')
  }
  
  submitForm = () =>{
    this.props.formSubmit(this.state);
  }

  loadData = () => {
    ipcRenderer.send('pronouns-get', null)
    ipcRenderer.once('pronouns-reply', (event, arg) => {
      this.setState({pronouns: arg})
    })
  }

  //TODO make sure new data is the full data req
  fillForm = (newData) => {
    console.log(newData);
    this.setState({
      professor_id:       newData['professor_id'],
      first_name:         newData['first_name'],
      last_name:          newData['last_name'],
      pronoun_id:         newData['pronoun_id'],
      email:              newData['email'],
      phone_number:       newData['phone_number'],
      subject_id:         newData['subject_id']
    }, ()=>{ 
      console.log(this.state)
      this.loadData()
    })
  }

  changePronounSel = (event) => { this.setState({pronoun_id: event.target.value}) }
  
  render() {
    let pronounOptions = this.state.pronouns.map(pronoun => {
      return (
        <option value={pronoun['pronoun_id']}>{pronoun['pronoun']}</option>
      )
    })
    return (
      <div>
        <Form>
          <Row>
            <Col>
              <h4>Personal Info:</h4>
              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="first_name">First Name</Label>
                    <Input id="first_name" value={this.state.first_name} onChange={e => this.setState({first_name: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="last_name">Last Name</Label>
                    <Input id="last_name" value={this.state.last_name} onChange={e => this.setState({last_name: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <Label for="pronouns">Pronouns</Label>
                  <FormGroup>
                    <Input id="pronouns" type="select" value={this.state.pronoun_id} onChange={e => this.changePronounSel(e) }>
                      {pronounOptions}
                    </Input>
                  </FormGroup>
                </Col>                
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" id="email" value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input id="preffered_name" value={this.state.phone_number} onChange={e => this.setState({phone_number: e.target.value})} />
                  </FormGroup>
                </Col>
                
              </Row>

            </Col>
          </Row>
          <hr/>

        </Form>

        <Button color="primary" onClick={e => this.submitForm()}>Submit Form</Button>
        <br/>
      </div>  
    )
  }
};
