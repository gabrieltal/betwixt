import React from 'react';
import { Link } from 'react-router-dom';

const welcomeUser = (currentUser, logout) => (
  <div>
    <p>currentUser.username</p>
  </div>
);

const navLinks = () => (
  <div>
    <button>Get started</button>
    <button>Sign in</button>
  </div>
);

const Nav = (props) => {
  return props.currentUser ?
      welcomeUser(props.currentUser, props.logout) : navLinks()
};

export default Nav;
