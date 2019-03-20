import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/CustomNavbar';
import PageNotFound from './components/PageNotFound';
import Home from './components/Home';
import Search from './components/Search';
import AddEmp from './components/Employee/AddEmp'
import EditEmp from './components/Employee/EditEmp'
import Analytics from './components/Analytics/Analytics'
import ImportData from './components/ImportData'
import NewSemester from './components/NewSemester'
import About from './components/About'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />

          <Switch> {/* connects the the corretly matching paths if nothing then goes to 404 */}
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/AddEmp" component={AddEmp} />
            <Route exact path="/EditEmp" component={EditEmp} />
            <Route exact path="/Analytics" component={Analytics} />
            <Route exact path="/Import" component={ImportData} />
            <Route exact path="/NewSemester" component={NewSemester} />
            <Route exact path="/About" component={About} />
            <Route component={PageNotFound}/>
          </Switch>
          
        </div>
      </Router>
    );
  }
}


export default App;
