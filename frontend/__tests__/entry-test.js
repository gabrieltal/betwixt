import ReactDOM from 'react-dom';
import configureStore from '../store/store';

jest.mock('../store/store', () => jest.fn(() => ({ storeKey: 'storeValue' }) ));

describe('entry', () => {
  let Entry,
      ReactDOM,
      Root,
      renderedRoot;

  beforeAll(() => {
    document.addEventListener = jest.fn();
    document.getElementById = jest.fn(id => id);

    ReactDOM = require('react-dom');
    ReactDOM.render = jest.fn();

    Root = require('../components/root');
    Entry = require('../entry');
    // invoke the callback passed to document.addEventListener
    document.addEventListener.mock.calls[0][1]();
  });

  it('sets a listener for the DOMContentLoaded event', () => {
    const eventListenerCalls = document.addEventListener.mock.calls;

    expect(document.addEventListener).toBeCalled();
    expect(eventListenerCalls[0][0]).toEqual('DOMContentLoaded');
  });
});
