import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

const rootElement = document.getElementById('root')!;
ReactDOM.unmountComponentAtNode(rootElement);

ReactDOM.render(<App />, rootElement);