import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Container, Button, Row, Col } from 'reactstrap';
import './Home.css';


export default class Home extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <Container>
        <Jumbotron>
            <h2>Peer connections Database Project</h2>
            <h1>REDO <code>icpRenderer</code> FOR ALL PAGES</h1>
            <h3>To do list: </h3>
            <p>
              1. (DONE) Create pages and navigation <br/>
              2. Create deployable react build using <code>npm run build</code> and electron-builder<br/>
              3. Create db structure<br/>
              4. Implement functionality on data entry and retrieval<br/>
              5. Implemet search<br/>
              6. Implement queries page<br/>
            </p>

            <h3>Optional: </h3>
            <p>
            1. Make pretty graphics
            </p>

            <h4>Notes</h4>
            <p>using the <code>&lt;link&gt;</code> tags is like using the <code>&lt;a&gt;</code> tag in react-router-dom</p>
            
            <hr/>

            <Row>
              <Col>
                <Link to="/search">
                  <Button color="primary">[Temp] Go to Search </Button>
                </Link>
              </Col>
              <Col>
                <Link to="/AddEmp">
                  <Button color="primary">[Temp] Add Employee </Button>
                </Link>
              </Col>
              <Col>
                <Link to="/EditEmp">
                  <Button color="primary">[Temp] Edit Employee </Button>
                </Link>
              </Col>
            </Row>
            <br/>

            <Row>
              <Col>
                <Link to="/Analytics">
                  <Button color="primary">[Temp] Analytics </Button>
                </Link>
              </Col>
              <Col>
                <Link to="/Import">
                  <Button color="primary">[Temp] Import Data </Button>
                </Link>
              </Col>
              <Col>
                <Link to="/NewSemester">
                  <Button color="primary">[Temp] New Semester </Button>
                </Link>
              </Col>
            </Row>
            

        </Jumbotron>
      </Container>
    )
  }
};
