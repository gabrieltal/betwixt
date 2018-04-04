import React from 'react';
import NavContainer from './nav/nav_container';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import { Route } from 'react-router-dom';
const App = () => (
  <div>
    <header>
      <h1>Betwixt</h1>
      <NavContainer />
    </header>
    <Route path="/login" component={LoginFormContainer} />
    <Route path="/signup" component={SignupFormContainer}/>
  </div>
);

export default App;
