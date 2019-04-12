import React, { Component } from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button, Input, Row, Col } from 'reactstrap';

// import './Home.css';


export default class EmployeeForm extends Component {
  //this.state will be internaly and can see when things are changed
  constructor(props) {
    super(props);

    console.log(this.props);
    this.state = {
      name:'',
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

  fillForm = (newData) => {
    this.setState({data: newData})
    console.log(this.state)
    console.log("heyooo")
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <h1>Edit Employee:</h1>
          </Col>
          <Col md={4}>
            <h3>Semester: </h3>
            <Input type="select" bsSize="sm">
              <option>Large Select</option>
            </Input>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col>
            <h4>Personal Info:</h4>
            <Row>
              <Col>
                
              </Col>
            </Row>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col>
            <h4>College Info:</h4>
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
        
      </div>
    )
  }
};
