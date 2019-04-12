import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Input, Row, Col, FormGroup, Label, Form } from 'reactstrap';

// import './Home.css';


export default class EmployeeForm extends Component {
  //this.state will be internaly and can see when things are changed
  constructor(props) {
    super(props);

    console.log(this.props);
    this.state = {
      first_name: '',
      last_name: '',
      preffered_name: '',
      pronouns: '',
      sid: '',
      email: '',
      phone: '',
      shirt_size: 'XS',

      grad_date: '',
      major: '',
      college: '',

      data: []
    };
  }

  //this.props are passes in by parameter names
  componentDidMount() {
    console.log(this.props);
    console.log("Hello!!!!")
    //this.setState({name: this.props.data[3]+' '+this.props.data[2]})
  }
  
  submitForm = () =>{
    let employeeInfo = "From the EmployeeForm.jsx!!!!";
    this.props.formSubmit(employeeInfo);
  }

  //TODO make sure new data is the full data req
  fillForm = (newData) => {
    console.log(newData)
    this.setState({
      data: newData,
      first_name: newData[0][3],
      last_name: newData[0][2],
      sid: newData[0][1]
    })

    //console.log(this.state)
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
                    <Label for="preffered_name">Preffered Name</Label>
                    <Input id="preffered_name" value={this.state.preffered_name} onChange={e => this.setState({preffered_name: e.target.value})} />
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
                    <Input id="sid" value={this.state.sid} onChange={e => this.setState({sid: e.target.value})} />
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
                    <Input id="preffered_name" value={this.state.phone} onChange={e => this.setState({phone: e.target.value})} />
                  </FormGroup>
                </Col>
                <Col md={3} sm={6}>
                  <FormGroup>
                    <Label for="shirt_size">Shirt Size</Label>
                    <Input type="select" id="shirt_size" value={this.state.shirt_size} onChange={e => this.setState({shirt_size: e.target.value})}>
                      <option>XS</option> <option>S</option> <option>M</option> <option>L</option> <option>XL</option>
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

            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
              <h4>Job Info:</h4>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
              <h4>Talent Info:</h4>
            </Col>
          </Row>
          <hr/>
        </Form>
        <Button onClick={e => console.log(this.state)}>log state</Button>
      </div>
    )
  }
};
