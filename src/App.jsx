import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/CustomNavbar';
import PageNotFound from './components/PageNotFound';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />

          <Switch> {/* connects the the corretly matching paths if nothing then goes to 404 */}
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound}/>
          </Switch>
          
        </div>
      </Router>
    );
  }
}


export default App;
