import React from 'react';
import ReactDOM from 'react-dom';
import { signup, login, logout } from './actions/session_actions';
import configureStore from './store/store';
import Root from './components/root';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  let store;
  if (window.currentUser) {
    const preloadedState = {session: { currentUser: window.CurrentUser } };
    store = configureStore(preloadedState);
    delete window.currentUser;
  } else {
    store = configureStore();
  }
  //TESTING
  window.store = store;
  window.signup = signup;
  window.login = login;
  window.logout = logout;
  window.dispatch = store.dispatch;
  // END TESTING
  ReactDOM.render(<Root store={ store }/>, root);
});
