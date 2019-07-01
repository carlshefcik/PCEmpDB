import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { 
  Jumbotron, 
  Container, 
  // Button, 
  Row,
  Col,
  Card, 
  // CardImg, 
  CardText, 
  CardBody 
} from 'reactstrap';
import './Home.css';

import searchpic from './home-icons/search.png'
import addpic from './home-icons/add.png'
import graphpic from './home-icons/graph.png'
import newsempic from './home-icons/newsem.png'
import importpic from './home-icons/import.png'


export default class Home extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <Container>
        <Jumbotron>
          <Row>
            <Col md={3} sm={6}>
              <Link to="/search">
                <Card>
                  <CardBody>
                    <img top width="100%"  src={searchpic} alt="Card search"/>
                    <CardText>Search for employees in the database</CardText>
                  </CardBody>
                </Card>
              </Link>
            </Col>
            <Col md={3} sm={6}>
              <Link to="/AddEmp">
                <Card>
                  <CardBody>
                    <img top width="100%"  src={addpic} alt="Card add"/>
                    <CardText>Add new employees into the database</CardText>
                  </CardBody>
                </Card>
              </Link>
            </Col>
            <Col md={3} sm={6}>
              <Link to="/Analytics">
                <Card>
                  <CardBody>
                    <img top width="100%"  src={graphpic} alt="Card graph"/>
                    <CardText>View data visuals for the semseter</CardText>
                  </CardBody>
                </Card>
              </Link>
            </Col>
            
            <Col md={3} sm={6}>
              <Link to="/NewSemester">
                <Card>
                  <CardBody>
                    <img top width="100%"  src={newsempic} alt="Card newsem"/>
                    <CardText>Create a new semester in the database</CardText>
                  </CardBody>
                </Card>
              </Link>
            </Col>

            <Col md={3} sm={6}>
              <Link to="/Import">
                <Card>
                  <CardBody>
                    <img top width="100%"  src={importpic} alt="Card import"/>
                    <CardText>Import old data to the database</CardText>
                  </CardBody>
                </Card>
              </Link>
            </Col>
          </Row>
          <hr/>
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
            7. Add currently employed checkbox next to submit button in employee forms
          </p>

          <h3>Optional: </h3>
          <p>
          1. Make pretty graphics
          </p>

          <h4>Notes</h4>
          <p>using the <code>&lt;link&gt;</code> tags is like using the <code>&lt;a&gt;</code> tag in react-router-dom</p>
          
        </Jumbotron>
      </Container>
    )
  }
};
