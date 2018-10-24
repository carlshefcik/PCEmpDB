import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'reactstrap';
import './Home.css';

export default class Home extends Component {
  render() {
    return (
      <Container>
        <Jumbotron>
            <h2>Peer connections Database Project</h2>

            <h3>To do list: </h3>
            <p>
            1. 
            </p>

            <h3>Optional: </h3>
            <p>
            1. 
            </p>

            <h4>Notes</h4>
            <p>using the <code>&lt;link&gt;</code> tags is like using the <code>&lt;a&gt;</code> tag in react-router-dom</p>
            <Link to="/">
              <Button bsStyle="primary"> Go to next page </Button>
            </Link>
        </Jumbotron>
      </Container>
    )
  }
};
