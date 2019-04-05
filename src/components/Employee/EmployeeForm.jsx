import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button } from 'reactstrap';

// import './Home.css';


export default class EmployeeForm extends Component {
  //this.state will be internaly and can see when things are changed
  constructor(props) {
    super(props);

    console.log(this.props);
    this.state = {
      data: []
    };
  }

  //this.props are passes in by parameter names
  componentDidMount() {
    console.log(this.props);
    console.log("Hello!!!!")
  }
  
  submitForm = () =>{
    let employeeInfo = "From the EmployeeForm.jsx!!!!";
    this.props.formSubmit(employeeInfo);
  }

  render() {
    return (
      <div>
        <h2>Employee Form</h2>

        <h3>To do list: </h3>
        <p>
          1. Create form <br/>
          2. Create this.state values to use this.props values when given that pass into it to load the form<br/>
          3. Figure out how to access the form data from the AddEmp and EditEmp pages
        </p>

        <Button color="secondary" onClick={this.submitForm}> submit test </Button>

        <h4>Sample data retrieval:</h4>
        <p id="dbtest"> </p>

        <Link to="/">
          <Button color="primary"> Go to Home </Button>
        </Link>
      </div>
    )
  }
};
