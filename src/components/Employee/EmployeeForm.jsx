import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Input, Row, Col, FormGroup, Label, Table, Form, CustomInput } from 'reactstrap';

const electron = window.require('electron');
//const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;
// import './Home.css';


export default class EmployeeForm extends Component {
  //this.state will be internaly and can see when things are changed
  constructor(props) {
    super(props);

    // console.log(this.props);
    this.state = {
      id: 0,
      semester_id: 0,
      semester: '',
      year: 0,

      first_name: '',
      last_name: '',
      preferred_name: '',
      pronoun_id: '',
      sid: '',
      email: '',
      phone_number: '',
      shirt_size: 0,

      grad_date: '',
      major: '',
      college: '',
      degree: '',
      international: '',
      
      role: 0,
      semester_start: '',
      hire_status: '',
      schedule_sent: '',
      evc_date: '',
      pay_rate: '',
      leave_date: '',
      leave_reason: '',
      training_levels: '',
      // certifications: '',
      avg_hours_wk: '',

      trainingLevels: [],
      trainingLevelSel: '',
      trainingLevelList: [],
      certifications: [],
      certificationSel: '',
      certificationList: [],

      languages: [],
      languageList: [],
      languageSel: '',
      strengths:[],
      strengthList:[],
      strengthSel: '',
      // specialInterests: [],
      specialInterestList: [],
      specialInterestVal: '',

      pronouns: [],
      prounounSel: '',
      semesters:[],
      // semesterSel: ''

      //* redo
      // employed: 1,
    };
  }

  //this.props are passes in by parameter names
  componentDidMount() {
    
  }
  componentWillUnmount() {
    //this.props.onRef(null)
    ipcRenderer.removeAllListeners('specInt-reply')
    ipcRenderer.removeAllListeners('strengths-list-reply')
    ipcRenderer.removeAllListeners('language-list-reply')
    ipcRenderer.removeAllListeners('certification-list-reply')
    ipcRenderer.removeAllListeners('training-level-list-reply')
  }
  
  submitForm = () =>{
    this.props.formSubmit(this.state);
  }

  loadData = () => {
    //These get the parameters for the select options
    ipcRenderer.send('semesters-get', null)
    ipcRenderer.once('semesters-reply', (event, arg) => {
      this.setState({semesters: arg})
    })
    ipcRenderer.send('training-levels-get', null)
    ipcRenderer.once('training-levels-reply', (event, arg) => {
      this.setState({trainingLevels: arg, trainingLevelSel: arg[0]['training_level_id']})
    })
    ipcRenderer.send('training-level-list-get', this.state.sid)
    ipcRenderer.on('training-level-list-reply', (event, arg) => {
      this.setState({trainingLevelList: arg})
    })

    ipcRenderer.send('certifications-get', null)
    ipcRenderer.once('certifications-reply', (event, arg) => {
      this.setState({certifications: arg, certificationSel: arg[0]['certification_id']})
    })
    ipcRenderer.send('certification-list-get', this.state.sid)
    ipcRenderer.on('certification-list-reply', (event, arg) => {
      this.setState({certificationList: arg})
    })

    ipcRenderer.send('languages-get', null)
    ipcRenderer.once('languages-reply', (event, arg) => {
      this.setState({languages: arg, languageSel: arg[0]['language_id']})
    })
    ipcRenderer.send('language-list-get', this.state.sid)
    ipcRenderer.on('language-list-reply', (event, arg) => {
      this.setState({languageList: arg})
    })

    ipcRenderer.send('pronouns-get', null)
    ipcRenderer.once('pronouns-reply', (event, arg) => {
      this.setState({pronouns: arg})
    })

    ipcRenderer.send('strengths-get', null)
    ipcRenderer.once('strengths-reply', (event, arg) => {
      this.setState({strengths: arg, strengthSel: arg[0]['strength_id']})
    })
    ipcRenderer.send('strengths-list-get', this.state.sid)
    ipcRenderer.on('strengths-list-reply', (event, arg) => {
      this.setState({strengthList: arg})
    })

    // * Gets the special interests for the employee
    ipcRenderer.send('specInt-get', this.state.sid)
    ipcRenderer.on('specInt-reply', (event, arg) => {
      console.log(arg)
      if(arg)
        this.setState({specialInterestList: arg})
    })
    this.setState({disabled: this.props.disabled})
  }

  //TODO make sure new data is the full data req
  fillForm = (newData) => {
    this.setState({
      id:                 newData['id'],
      first_name:         newData['first_name'],
      last_name:          newData['last_name'],
      preferred_name:     newData['preferred_name'],
      pronoun_id:         newData['pronoun_id'],
      sid:                newData['sid'],
      email:              newData['email'],
      phone_number:       newData['phone_number'],
      shirt_size:         newData['shirt_size'],

      grad_date:          newData['grad_date'],
      major:              newData['major'],
      college:            newData['college'],
      degree:             newData['degree'],
      transfer:           newData['transfer'],
      international:      newData['international'],

      role:               newData['role'],
      semester_start:     newData['semester_start'],
      hire_status:        newData['hire_status'],
      schedule_sent:      newData['schedule_sent'],
      evc_date:           newData['evc_date'],
      pay_rate:           newData['pay_rate'],
      leave_date:         newData['leave_date'],
      leave_reason:       newData['leave_reason'],
      semester_id:        newData['semester_id'],

      //* redo these as seperate queries that will have seperate calls when fill form is called
      // training_levels:    newData['training_levels'],
      // certifications:     newData['certifications'],
      
      avg_hours_wk:       newData['avg_hours_wk'],

      //*  redo these as seperate queries that will have seperate calls when fill form is called
      // courses:            newData['courses'],
      // languages:          newData['languages'],
      // strengths:          newData['strengths'],
      // special_interests:  newData['special_interests'],
      
    }, ()=>{ 
      console.log(this.state)
      this.loadData()
    })
  }

  changePronounSel = (event) => { this.setState({pronounSel: event.target.value}) }
  changeSemesterSel = (event) => { this.setState({semester_start: event.target.value}) }

  changeTrainingLevelSel = (event) => { this.setState({trainingLevelSel: event.target.value}) }
  addTrainingLevel = () => {
    let data = [this.state.trainingLevelSel, this.state.semester_id, this.state.sid]
    console.log(data)
    ipcRenderer.send('training-level-assign-post', data)
    ipcRenderer.once('training-level-assign-confirm', (event, arg) => {
      ipcRenderer.send('training-level-list-get', this.state.sid)
    })
  }
  removeTrainingLevel = (training_id) => {
    console.log(training_id)
    ipcRenderer.send('training-level-assign-remove-post', training_id)
    ipcRenderer.once('training-level-assign-remove-confirm', (event, arg) => {
      ipcRenderer.send('training-level-list-get', this.state.sid)
    })
  }

  changeCertificationSel = (event) => { this.setState({certificationSel: event.target.value}) }
  addCertification = () => {
    let data = [this.state.certificationSel, this.state.semester_id, this.state.sid]
    ipcRenderer.send('certification-assign-post', data)
    ipcRenderer.once('certification-assign-confirm', (event, arg) => {
      ipcRenderer.send('certification-list-get', this.state.sid)
    })
  }
  removeCertification = (assigned_cert_id) => {
    ipcRenderer.send('certification-assign-remove-post', assigned_cert_id)
    ipcRenderer.once('certification-assign-remove-confirm', (event, arg) => {
      ipcRenderer.send('certification-list-get', this.state.sid)
    })
  }

  changeLanguageSel = (event) => { this.setState({languageSel: event.target.value}) }
  addLanguage = () => {
    let data = [this.state.languageSel, this.state.semester_id, this.state.sid]
    ipcRenderer.send('language-assign-post', data)
    ipcRenderer.once('language-assign-confirm', (event, arg) => {
      ipcRenderer.send('language-list-get', this.state.sid)
    })
  }
  removeLanguage = (assigned_language_id) => {
    ipcRenderer.send('language-assign-remove-post', assigned_language_id)
    ipcRenderer.once('language-assign-remove-confirm', (event, arg) => {
      ipcRenderer.send('language-list-get', this.state.sid)
    })
  }
  
  changeStrengthSel = (event) => { this.setState({strengthSel: event.target.value}) }
  addStrength = () => {
    let data = [this.state.strengthSel, this.state.semester_id, this.state.sid]
    ipcRenderer.send('strengths-assign-post', data)
    ipcRenderer.once('strengths-assign-confirm', (event, arg) => {
      ipcRenderer.send('strengths-list-get', this.state.sid)
    })
  }
  removeStrength = (assigned_strength_id) => {
    ipcRenderer.send('strengths-assign-remove-post', assigned_strength_id)
    ipcRenderer.once('strengths-assign-remove-confirm', (event, arg) => {
      ipcRenderer.send('strengths-list-get', this.state.sid)
    })
  }

  addSpecInt = () => {
    let data = [this.state.specialInterestVal, this.state.semester_id, this.state.sid]
    ipcRenderer.send('specInt-assign-post', data)
    ipcRenderer.once('specInt-assign-confirm', (event, arg) => {
      ipcRenderer.send('specInt-get', this.state.sid)
    })
  }
  removeSpecInt = (special_interest_id) => {
    ipcRenderer.send('specInt-assign-remove-post', special_interest_id)
    ipcRenderer.once('specInt-assign-remove-confirm', (event, arg) => {
      ipcRenderer.send('specInt-get', this.state.sid)
    })
  }
  
  render() {
    let semesterOptions = this.state.semesters.map(semester => {
      return (
        <option value={semester['semester_id']}>{semester['semester']+' '+semester['year']}</option>
      )
    })
    let pronounOptions = this.state.pronouns.map(pronoun => {
      return (
        <option value={pronoun['pronoun_id']}>{pronoun['pronoun']}</option>
      )
    })
    let trainingLevelOptions = this.state.trainingLevels.map(level => {
      return (
        <option value={level['training_level_id']}>{level['training_level']}</option>
      )
    })
    let trainingLevelList = this.state.trainingLevelList.length !== 0 ? this.state.trainingLevelList.map(level => {
      return (
        <tr>
          <td>{level['training_level']}</td>
          <td><Button onClick={(e) => this.removeTrainingLevel(level['training_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    }) : 'No training for employee'

    let certificationOptions = this.state.certifications.map(cert => {
      return (
        <option value={cert['certification_id']}>{cert['certification']}</option>
      )
    })
    let certificationList = this.state.certificationList.length !== 0 ? this.state.certificationList.map(cert => {
      return (
        <tr>
          <td>{cert['certification']}</td>
          <td><Button onClick={(e) => this.removeCertification(cert['assigned_cert_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    }) : 'No certifications for employee'

    let languageOptions = this.state.languages.map(language => {
      return (
        <option value={language['language_id']}>{language['language']}</option>
      )
    })
    let languageList = this.state.languageList.length !== 0 ? this.state.languageList.map(language => {
      return (
        <tr>
          <td>{language['language']}</td>
          <td><Button onClick={(e) => this.removeLanguage(language['assigned_language_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    }) : 'No languages for employee'

    let strengthOptions = this.state.strengths.map(strength => {
      return (
        <option value={strength['strength_id']}>{strength['strength']}</option>
      )
    })
    let strengthList = this.state.strengthList.length !== 0 ? this.state.strengthList.map(strength => {
      return (
        <tr>
          <td>{strength['strength']}</td>
          <td><Button onClick={(e) => this.removeStrength(strength['assigned_strength_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    }) : 'No Strengths for employee'
    
    let specIntList = this.state.specialInterestList.length !== 0 ? this.state.specialInterestList.map(specInt => {
      return (
        <tr>
          <td>{specInt['special_interest']}</td>
          <td><Button onClick={(e) => this.removeSpecInt(specInt['special_interest_id'])} size="sm" color="danger">X</Button></td>
        </tr>
      )
    }) : 'No Special Interests for employee'

    
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
                  <FormGroup>
                    <Label for="preffered_name">Preferred Name</Label>
                    <Input id="preffered_name" value={this.state.preferred_name} onChange={e => this.setState({preferred_name: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <Label for="pronouns">Pronouns</Label>
                  <FormGroup>
                    <Input id="pronouns" type="select" value={this.state.pronounSel} onChange={e => this.changePronounSel(e) }>
                      {pronounOptions}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="sid">SID</Label>
                    <Input id="sid" disabled={this.state.disabled} value={this.state.sid} onChange={e => this.setState({sid: e.target.value})} />
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
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="shirt_size">Shirt Size</Label>
                    <Input type="select" id="shirt_size" value={this.state.shirt_size} onChange={e => this.setState({shirt_size: parseInt(e.target.value)})}>
                      <option value='0'>XS</option>
                      <option value='1'>S</option>
                      <option value='2'>M</option>
                      <option value='3'>L</option>
                      <option value='4'>XL</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

            </Col>
          </Row>

          <hr/>
          <Row>
            <Col>
              <h4>College Info:</h4>
              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="grad_date">Graduation Date</Label>
                    <Input id="grad_date" value={this.state.grad_date} onChange={e => this.setState({grad_date: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={6} sm={6}>
                  <FormGroup>
                    <Label for="major">Major</Label>
                    <Input id="major" value={this.state.major} onChange={e => this.setState({major: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="college">College</Label>
                    <Input id="college" value={this.state.college} onChange={e => this.setState({college: e.target.value})} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="degree">Degree Type</Label>
                    {/* <Input id="grad_date" value={this.state.grad_date} onChange={e => this.setState({grad_date: e.target.value})} /> */}
                    <div>
                      <CustomInput  type="radio" id="degree1" label="Undergrad" value={1} checked={this.state.degree === 1} onChange={e => this.setState({degree: 1})} />
                      <CustomInput  type="radio" id="degree2" label="Graduate" value={0} checked={this.state.degree === 0} onChange={e => this.setState({degree: 0})} />
                    </div>
                    
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="transfer">Transfer Student</Label>
                    {/* <Input id="grad_date" value={this.state.grad_date} onChange={e => this.setState({grad_date: e.target.value})} /> */}
                    <div>
                      <CustomInput  type="radio" id="transfer1" label="Yes" value={1} checked={this.state.transfer === 1} onChange={e => this.setState({transfer: 1})} />
                      <CustomInput  type="radio" id="transfer2" label="No" value={0} checked={this.state.transfer === 0} onChange={e => this.setState({transfer: 0})} />
                    </div>
                    
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="international">International Student</Label>
                    {/* <Input id="college" value={this.state.college} onChange={e => this.setState({college: e.target.value})} /> */}
                    <div>
                      <CustomInput type="radio" id="international1" label="Yes" value={1} checked={this.state.international === 1} onClick={e => this.setState({international: 1})}/>
                      <CustomInput type="radio" id="international2" label="No" value={0} checked={this.state.international === 0} onClick={e => this.setState({international: 0})}/>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
              <h4>Job Info:</h4>
              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="role">Role</Label>
                    {/* <Input id="role" value={this.state.role} onChange={e => this.setState({role: e.target.value})} /> */}
                    <Input id='role' type="select" value={this.state.role} onChange={e => this.setState({role: parseInt(e.target.value)})}>
                      <option value={0}>Tutor</option>
                      <option value={1}>Mentor</option>
                      <option value={2}>SI Leader</option>
                      <option value={3}>WDS</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="sem_start">Semester Start</Label>
                    <FormGroup>
                    <Input id="sem_start" type="select" value={this.state.semester_start} onChange={e => this.changeSemesterSel(e) }>
                      {semesterOptions}
                    </Input>
                  </FormGroup>
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="hire_status">Hire Status</Label>
                    <Input id="hire_status" value={this.state.hire_status} onChange={e => this.setState({hire_status: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="schedule_sent">Schedule Sent</Label>
                    <div>
                      <CustomInput  type="radio" id="schedule_sent1" label="Yes" value={1} checked={this.state.schedule_sent === 1} onChange={e => this.setState({schedule_sent: 1})} />
                      <CustomInput  type="radio" id="schedule_sent2" label="No" value={0} checked={this.state.schedule_sent === 0} onChange={e => this.setState({schedule_sent: 0})} />
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="evc_date">EVC Date</Label>
                    <Input id="evc_date" value={this.state.evc_date} onChange={e => this.setState({evc_date: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="pay_rate">Pay Rate</Label>
                    <Input id="pay_rate" value={this.state.pay_rate} onChange={e => this.setState({pay_rate: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="leave_date">Leave Date</Label>
                    <Input id="leave_date" value={this.state.leave_date} onChange={e => this.setState({leave_date: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="leave_reason">Leave Reason</Label>
                    <Input id="leave_reason" value={this.state.leave_reason} onChange={e => this.setState({leave_reason: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="avg_hours">Avg Hours/Wk</Label>
                    <Input id="avg_hours" value={this.state.avg_hours_wk} onChange={e => this.setState({avg_hours_wk: e.target.value})} />
                  </FormGroup>
                </Col>
              </Row>
              
              { this.state.disabled ? 
                <Row>
                  <Col md={6} sm={6}>
                    <Label for="training_levels">Training Levels</Label>
                    <Row>
                      <Col l md={10} sm={8}>
                        <FormGroup>
                          {/* <Input id="training_levels" value={this.state.training_levels} onChange={e => this.setState({training_levels: e.target.value})} /> */}
                          <Input type="select" value={this.state.trainingLevelSel} onChange={e => this.changeTrainingLevelSel(e) }>
                            {trainingLevelOptions}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2} sm={4}>
                        <FormGroup>
                          {/* textright doesnt work */}
                          <Button onClick={this.addTrainingLevel} className="text-center" color="primary" block>+</Button>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Table borderless hover size='sm'>
                          <tbody>
                            {trainingLevelList}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6} sm={6}>
                    <Label for="certifications">Certifications</Label>
                    <Row>
                      <Col l md={10} sm={8}>
                        <FormGroup>
                          {/* <Input id="certifications" value={this.state.certifications} onChange={e => this.setState({certifications: e.target.value})} /> */}
                          <Input type="select" value={this.state.certificationSel} onChange={e => this.changeCertificationSel(e) }>
                            {certificationOptions}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={2} sm={4}>
                        <FormGroup>
                          {/* textright doesnt work */}
                          <Button onClick={this.addCertification} className="text-center" color="primary" block>+</Button>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Table borderless hover size='sm'>
                          <tbody>
                            {certificationList}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                : null }
              
            </Col>
          </Row>
          
          <hr/>

          { this.state.disabled ? 
            <div>
              <Row>
                <Col>
                  <h4>Talent Info:</h4>
                  <Row>
                    <Col md={6} sm={6}>
                      <Label for="languages">Languages</Label>
                      <Row>
                        <Col l md={10} sm={8}>
                          <FormGroup>
                            <Input type="select" value={this.state.languageSel} onChange={e => this.changeLanguageSel(e) }>
                              {languageOptions}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={4}>
                          <FormGroup>
                            <Button onClick={this.addLanguage} className="text-center" color="primary" block>+</Button>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Table borderless hover size='sm'>
                            <tbody>
                              {languageList}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Col>
                
                    <Col md={6} sm={6}>
                      <Label for="strengths">Strengths</Label>
                      <Row>
                        <Col l md={10} sm={8}>
                          <FormGroup>
                            <Input type="select" value={this.state.strengthSel} onChange={e => this.changeStrengthSel(e) }>
                              {strengthOptions}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={4}>
                          <FormGroup>
                            <Button onClick={this.addStrength} className="text-center" color="primary" block>+</Button>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Table borderless hover size='sm'>
                            <tbody>
                              {strengthList}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} sm={6}>
                      <Label for="specialInterestVal">Special interests</Label>
                      <Row>
                        <Col md={10} sm={8}>
                          <FormGroup>
                            <Input id="specialInterestVal" value={this.state.specialInterestVal} onChange={e => this.setState({specialInterestVal: e.target.value})} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={4}>
                          <FormGroup>
                            <Button onClick={this.addSpecInt} className="text-center" color="primary" block>+</Button>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Table borderless hover size='sm'>
                            <tbody>
                              {specIntList}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Col>
                    
                  </Row>

                </Col>
              </Row>
              <hr/>
            </div>
            : null }
        </Form>

        {/* <FormGroup>
          <Label for="currentlyEmployed">Currently Employed</Label>
          <div>
            <CustomInput type="radio" id="currentlyEmployed1" label="Yes" value={1} checked={this.state.employed === 1} onClick={e => this.setState({employed: 1})}/>
            <CustomInput type="radio" id="currentlyEmployed2" label="No" value={0} checked={this.state.employed === 0} onClick={e => this.setState({employed: 0})}/>
          </div>
        </FormGroup> */}
        <Button color="primary" onClick={e => this.submitForm()}>Submit Form</Button>
        <br/>
      </div>  
    )
  }
};
