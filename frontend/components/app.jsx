import React from 'react';
import NavContainer from './nav/nav_container';
import { Route, Link } from 'react-router-dom';
import Modal from './modal/modal';
const App = () => (
  <div>
    <Modal />
    <header>
      <Link to="/" className="header-Link">
        <h1>Betwixt</h1>
      </Link>
      <NavContainer />
    </header>
  </div>
);

export default App;
