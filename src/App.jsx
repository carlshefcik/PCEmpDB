import React, { Component } from 'react';
import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/CustomNavbar';
import PageNotFound from './components/PageNotFound';
import Home from './components/Home';
import Search from './components/Search';
import AddEmp from './components/Employee/AddEmp'
import EditEmp from './components/Employee/EditEmp'
import AddProf from './components/Professor/AddProf'
import EditProf from './components/Professor/EditProf'

import Analytics from './components/Analytics/Analytics'
import ImportData from './components/ImportData'
import NewSemester from './components/NewSemester'
import About from './components/About'
import Classes from './components/Classes'
import Talent from './components/Talent'
import CourseAssignments from './components/CourseAssignments'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />

          <Switch> {/* connects the the corretly matching paths if nothing then goes to 404, which should never happen*/}
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/AddEmp" component={AddEmp} />
            <Route exact path="/EditEmp" component={EditEmp} />
            <Route exact path="/AddProf" component={AddProf} />
            <Route exact path="/EditProf" component={EditProf} />
            <Route exact path="/Analytics" component={Analytics} />
            <Route exact path="/Import" component={ImportData} />
            <Route exact path="/NewSemester" component={NewSemester} />
            <Route exact path="/Classes" component={Classes} />
            <Route exact path="/Talent" component={Talent} />
            <Route exact path="/CourseAssignments" component={CourseAssignments} />
            <Route exact path="/About" component={About} />
            <Route component={PageNotFound}/>
          </Switch>
          
        </div>
      </Router>
    );
  }
}


export default App;
