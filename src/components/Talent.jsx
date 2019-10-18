import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Jumbotron, Container, Button, Form, FormGroup, Input, Row, Col, CustomInput, Table } from 'reactstrap';
import classnames from 'classnames';
import './Home.css';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;


export default class Talent extends Component {
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
              <h4>Training Levels</h4>

            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <h4>Certifications</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              <h4>Languages</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggle('4'); }}
            >
              <h4>Pronouns</h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '5' })}
              onClick={() => { this.toggle('5'); }}
            >
              <h4>Strengths</h4>
            </NavLink>
          </NavItem>
        </Nav>

        <br/>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <AddTrainingLevel/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col>
                <AddCertification/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col>
                <AddLanguages/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col>
                <AddPronouns/>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="5">
            <Row>
              <Col>
                <Strengths/>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        <br/>
        
      </Container>
    )
  }
};

class AddTrainingLevel extends Component {
  constructor(props){
    super(props);
    this.state = {
      trainingLevels: [],
      newTrainingLevelVal: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('training-levels-get', null)
    ipcRenderer.on('training-levels-reply', (event, arg) => {
      this.setState({trainingLevels: arg})
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('training-levels-reply')
  }

  formSubmission = () => {
    console.log(this.state.newTrainingLevelVal)
    ipcRenderer.send('training-level-create-post', this.state.newTrainingLevelVal)
    ipcRenderer.once('training-level-create-confirm', (event, arg) => {
      ipcRenderer.send('training-levels-get', null)
    })
  }
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }

  removeTrainingLevel = (training_level_id) => {
    console.log(training_level_id)
    ipcRenderer.send('training-level-remove-post', training_level_id)
    ipcRenderer.once('training-level-remove-confirm', (event, arg) => {
      ipcRenderer.send('training-levels-get', null)
    })
  }

  render() {
    let trainingLevelList = this.state.trainingLevels.map(training => {
      return (
        <tr>
          <td>{training['training_level']}</td>
          <td><Button onClick={(e) => this.removeTrainingLevel(training['training_level_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    })
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={11} sm={9}>
              <FormGroup>
                <Input bsSize="lg" type="text" placeholder="New Training Level..." value={this.state.newTrainingLevelVal} onChange={e => this.setState({newTrainingLevelVal: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={1} sm={3}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="danger" size="lg" block>+</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col md={8} sm={12}>
            <Table borderless hover size='sm'>
              <thead>
                <th>Training Level</th>
                <th></th>
              </thead>
              <tbody>
                {trainingLevelList}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
      
    )
  }
};

class AddCertification extends Component {
  constructor(props){
    super(props);
    this.state = {
      certifications: [],
      newCertificationVal: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('certifications-get', null)
    ipcRenderer.on('certifications-reply', (event, arg) => {
      this.setState({certifications: arg})
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('certifications-reply')
  }

  formSubmission = () => {
    console.log(this.state.newCertificationVal)
    ipcRenderer.send('certification-create-post', this.state.newCertificationVal)
    ipcRenderer.once('certification-create-confirm', (event, arg) => {
      ipcRenderer.send('certifications-get', null)
    })
  }
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }


  removeCertification = (certification_id) => {
    console.log(certification_id)
    ipcRenderer.send('certification-remove-post', certification_id)
    ipcRenderer.once('certification-remove-confirm', (event, arg) => {
      ipcRenderer.send('certifications-get', null)
    })
  }

  render() {
    let certificationList = this.state.certifications.map(cert => {
      return (
        <tr>
          <td>{cert['certification']}</td>
          <td><Button onClick={(e) => this.removeCertification(cert['certification_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    })
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={11} sm={9}>
              <FormGroup>
                <Input bsSize="lg" type="text" placeholder="New Certification Level..." value={this.state.newCertificationVal} onChange={e => this.setState({newCertificationVal: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={1} sm={3}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="danger" size="lg" block>+</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col md={8} sm={12}>
            <Table borderless hover size='sm'>
              <thead>
                <th>Certifications</th>
                <th></th>
              </thead>
              <tbody>
                {certificationList}                
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
      
    )
  }
};

class AddLanguages extends Component {
  constructor(props){
    super(props);
    this.state = {
      languages: [],
      newLanguageVal: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('languages-get', null)
    ipcRenderer.on('languages-reply', (event, arg) => {
      this.setState({languages: arg})
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('languages-reply')
  }

  formSubmission = () => {
    console.log(this.state.newLanguageVal)
    ipcRenderer.send('language-create-post', this.state.newLanguageVal)
    ipcRenderer.once('language-create-confirm', (event, arg) => {
      ipcRenderer.send('languages-get', null)
    })
  }
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }


  removeLanguage = (language_id) => {
    console.log(language_id)
    ipcRenderer.send('language-remove-post', language_id)
    ipcRenderer.once('language-remove-confirm', (event, arg) => {
      ipcRenderer.send('languages-get', null)
    })
  }

  render() {
    let languageList = this.state.languages.map(language => {
      return (
        <tr>
          <td>{language['language']}</td>
          <td><Button onClick={(e) => this.removeLanguage(language['language_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    })
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={11} sm={9}>
              <FormGroup>
                <Input bsSize="lg" type="text" placeholder="New Language..." value={this.state.newLanguageVal} onChange={e => this.setState({newLanguageVal: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={1} sm={3}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="danger" size="lg" block>+</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col md={8} sm={12}>
            <Table borderless hover size='sm'>
              <thead>
                <th>Languages</th>
                <th></th>
              </thead>
              <tbody>
                {languageList}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
      
    )
  }
};

class AddPronouns extends Component {
  constructor(props){
    super(props);
    this.state = {
      pronouns: [],
      newPronounVal: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('pronouns-get', null)
    ipcRenderer.on('pronouns-reply', (event, arg) => {
      this.setState({pronouns: arg})
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('pronouns-reply')
  }

  formSubmission = () => {
    console.log(this.state.newPronounVal)
    ipcRenderer.send('pronoun-create-post', this.state.newPronounVal)
    ipcRenderer.once('pronoun-create-confirm', (event, arg) => {
      ipcRenderer.send('pronouns-get', null)
    })
  }
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }


  removePronoun = (pronoun_id) => {
    console.log(pronoun_id)
    ipcRenderer.send('pronoun-remove-post', pronoun_id)
    ipcRenderer.once('pronoun-remove-confirm', (event, arg) => {
      ipcRenderer.send('pronouns-get', null)
    })
  }

  render() {
    let pronounList = this.state.pronouns.map(pronoun => {
      return (
        <tr>
          <td>{pronoun['pronoun']}</td>
          <td><Button onClick={(e) => this.removePronoun(pronoun['pronoun_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    })
    return (
      <div>
        <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={11} sm={9}>
              <FormGroup>
                <Input bsSize="lg" type="text" placeholder="New Pronoun..." value={this.state.newPronounVal} onChange={e => this.setState({newPronounVal: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={1} sm={3}>
              <FormGroup>
                {/* textright doesnt work */}
                <Button type="submit" className="text-center" color="danger" size="lg" block>+</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col md={8} sm={12}>
            <Table borderless hover size='sm'>
              <thead>
                <th>Pronouns</th>
                <th></th>
              </thead>
              <tbody>
                {pronounList}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
      
    )
  }
};

class Strengths extends Component {
  constructor(props){
    super(props);
    this.state = {
      strengths: [],
      // newStrengthVal: ''
    }
  }

  componentDidMount() {
    ipcRenderer.send('strengths-get', null)
    ipcRenderer.once('strengths-reply', (event, arg) => {
      this.setState({strengths: arg})
    })
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    // ipcRenderer.removeAllListeners('strengths-reply')
  }

  formSubmission = () => {
    // console.log(this.state.newstrengthVal)
    // ipcRenderer.send('strength-create-post', this.state.newstrengthVal)
    // ipcRenderer.once('strength-create-confirm', (event, arg) => {
    //   ipcRenderer.send('strengths-get', null)
    // })
  }
  onFormSubmit = (e) => {
    e.preventDefault()
    this.formSubmission();
  }


  // removeStrength = (strength_id) => {
  //   console.log(strength_id)
  //   ipcRenderer.send('strength-remove-post', strength_id)
  //   ipcRenderer.once('strength-remove-confirm', (event, arg) => {
  //     ipcRenderer.send('strengths-get', null)
  //   })
  // }

  render() {
    let strengthList = this.state.strengths.map(strength => {
      return (
        <tr>
          <td>{strength['strength']}</td>
          {/* <td><Button onClick={(e) => this.removeStrength(strength['strength_id'])} size="sm" color="danger">X</Button></td> */}
        </tr>
      )
    })
    return (
      <div>
        {/* <Form onSubmit={this.onFormSubmit}>
          <Row form>
            <Col md={11} sm={9}>
              <FormGroup>
                <Input bsSize="lg" type="text" placeholder="New strength..." value={this.state.newStrengthVal} onChange={e => this.setState({newStrengthVal: e.target.value})}/>
              </FormGroup>
            </Col>
            <Col md={1} sm={3}>
              <FormGroup>
                <Button type="submit" className="text-center" color="danger" size="lg" block>+</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form> */}
        <Row>
          <Col md={8} sm={12}>
            <Table borderless hover size='sm'>
              <thead>
                <th>Strengths</th>
              </thead>
              <tbody>
                {strengthList}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
      
    )
  }
};