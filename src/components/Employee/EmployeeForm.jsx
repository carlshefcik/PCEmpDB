import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Jumbotron, Container, Button } from 'reactstrap';
// import './Home.css';


export default class EmployeeForm extends Component {
  

  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        <h2>Employee Form</h2>

        <h3>To do list: </h3>
        <p>
          1. Create form <br/>
          2. Create parameters that pass into it to load the form<br/>
        </p>

        <h4>Sample data retrieval:</h4>
        <p id="dbtest"> </p>

        <Link to="/">
          <Button color="primary"> Go to Home </Button>
        </Link>
      </div>
    )
  }
};
