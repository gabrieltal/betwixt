import React from 'react';
import NavContainer from './nav/nav_container';
import { Route } from 'react-router-dom';

const App = () => (
  <div>
    <header>
      <h1>Betwixt</h1>
      <NavContainer />
    </header>
  </div>
);

export default App;
