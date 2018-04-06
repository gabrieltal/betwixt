import React from 'react';
import NavContainer from './nav/nav_container';
import { Route, Link, Switch } from 'react-router-dom';
import Modal from './modal/modal';
import UserShowContainer from './user/user_show_container';
const App = () => (
  <div>
    <Modal />
    <header>
      <Link to="/" className="header-Link">
        <h1>Betwixt</h1>
      </Link>
      <NavContainer />
    </header>
    <Switch>
      <Route exact path="/user/:userId" component={UserShowContainer} />
    </Switch>
  </div>
);

export default App;
