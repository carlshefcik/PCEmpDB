import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Input, Row, Col, FormGroup, Label, Form, CustomInput } from 'reactstrap';

// import './Home.css';


export default class EmployeeForm extends Component {
  //this.state will be internaly and can see when things are changed
  constructor(props) {
    super(props);

    // console.log(this.props);
    this.state = {
      first_name: '',
      last_name: '',
      preferred_name: '',
      pronouns: '',
      sid: '',
      email: '',
      phone_number: '',
      shirt_size: 0,

      grad_date: '',
      major: '',
      college: '',
      undergrad: '',
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
      certifications: '',
      avg_hours_wk: '',

      employed: 1,
    };
  }

  //this.props are passes in by parameter names
  componentDidMount() {
    // console.log(this.props);
    // console.log("Hello!!!!")
    //this.setState({name: this.props.data[3]+' '+this.props.data[2]})
    this.setState({disabled: this.props.disabled})
  }
  
  submitForm = () =>{
    this.props.formSubmit(this.state);
  }

  //TODO make sure new data is the full data req
  fillForm = (newData) => {
    this.setState({
      first_name: newData[4],
      last_name: newData[3],
      preferred_name: newData[5],
      pronouns: newData[6],
      sid: newData[2],
      email: newData[7],
      phone_number: newData[8],
      shirt_size: newData[9],

      grad_date: newData[10],
      major: newData[11],
      college: newData[12],
      undergrad: newData[13],
      international: newData[14],

      role: newData[15],
      semester_start: newData[16],
      hire_status: newData[17],
      schedule_sent: newData[18],
      evc_date: newData[19],
      pay_rate: newData[20],
      leave_date: newData[21],
      leave_reason: newData[22],
      training_levels: newData[23],
      certifications: newData[24],
      avg_hours_wk: newData[25],

      courses: newData[26],
      languages: newData[27],
      strengths: newData[28],
      special_interests: newData[29],
      
    }, ()=>{ console.log(this.state) })

  }

  tester = () => {
    console.log('hi')
  }

  render() {
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
                  <FormGroup>
                    <Label for="pronouns">Pronouns</Label>
                    <Input id="pronouns" value={this.state.pronouns} onChange={e => this.setState({pronouns: e.target.value})} />
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
                    <Label for="undergrad">Undergrad</Label>
                    {/* <Input id="grad_date" value={this.state.grad_date} onChange={e => this.setState({grad_date: e.target.value})} /> */}
                    <div>
                      <CustomInput  type="radio" id="undergrad1" label="Yes" value={1} checked={this.state.undergrad === 1} onChange={e => this.setState({undergrad: 1})} />
                      <CustomInput  type="radio" id="undergrad2" label="No" value={0} checked={this.state.undergrad === 0} onChange={e => this.setState({undergrad: 0})} />
                    </div>
                    
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="international">International</Label>
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
                    <Input id='role' type="select" bsSize="sm" value={this.state.role} onChange={e => this.setState({role: parseInt(e.target.value)})}>
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
                    <Input id="sem_start" value={this.state.semester_start} onChange={e => this.setState({semester_start: e.target.value})} />
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
                    <Input id="schedule_sent" value={this.state.schedule_sent} onChange={e => this.setState({schedule_sent: e.target.value})} />
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
              </Row>

              <Row>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="training_levels">Training Levels</Label>
                    <Input id="training_levels" value={this.state.training_levels} onChange={e => this.setState({training_levels: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="certifications">Certifications</Label>
                    <Input id="certifications" value={this.state.certifications} onChange={e => this.setState({certifications: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="avg_hours">Avg Hours/Wk</Label>
                    <Input id="avg_hours" value={this.state.avg_hours_wk} onChange={e => this.setState({avg_hours_wk: e.target.value})} />
                  </FormGroup>
                </Col>
              </Row>

            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
              <h4>Talent Info:</h4>
              <Row>
                <Col md={6} sm={6}>
                  <FormGroup>
                    <Label for="courses">Courses</Label>
                    <Input id="courses" value={this.state.courses} onChange={e => this.setState({courses: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={6} sm={6}>
                  <FormGroup>
                    <Label for="languages">Languages</Label>
                    <Input id="languages" value={this.state.languages} onChange={e => this.setState({languages: e.target.value})} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6} sm={6}>
                  <FormGroup>
                    <Label for="strengths">Strengths</Label>
                    <Input id="strengths" value={this.state.strengths} onChange={e => this.setState({strengths: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={6} sm={6}>
                  <FormGroup>
                    <Label for="special_interests">Special interests</Label>
                    <Input id="special_interests" value={this.state.special_interests} onChange={e => this.setState({special_interests: e.target.value})} />
                  </FormGroup>
                </Col>
              </Row>

            </Col>
          </Row>
          <hr/>
        </Form>

        <FormGroup>
          <Label for="currentlyEmployed">Currently Employed</Label>
          {/* <Input id="college" value={this.state.college} onChange={e => this.setState({college: e.target.value})} /> */}
          <div>
            <CustomInput type="radio" id="currentlyEmployed1" label="Yes" value={1} checked={this.state.employed === 1} onClick={e => this.setState({employed: 1})}/>
            <CustomInput type="radio" id="currentlyEmployed2" label="No" value={0} checked={this.state.employed === 0} onClick={e => this.setState({employed: 0})}/>
          </div>
        </FormGroup>
        <Button color="primary" onClick={e => this.submitForm()}>Submit Form</Button>
        <br/>
      </div>  
    )
  }
};
