import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { store } from './store';
import { Provider } from 'react-redux';

const rootElement = document.getElementById('root')!;
ReactDOM.unmountComponentAtNode(rootElement);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
