import React, { Component } from 'react';
import { Jumbotron, Container } from 'reactstrap';

export default class PageNotFound extends Component {
  render() {
    return (
      <div>
        <Container>
          <Jumbotron>  
            <h2>404: Page Not Found</h2>
          </Jumbotron>
        </Container>
      </div>
    )
  }
};
