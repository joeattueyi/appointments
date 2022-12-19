
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import 'whatwg-fetch';
import { Router, Route } from 'react-router-dom';
import { appHistory } from './history';
import { ConnectedApp } from './App';


ReactDOM.render(
    <Provider store={configureStore()} >
        <Router history={appHistory}>
            <Route path="/" component={ConnectedApp} />
        </Router>
    </Provider>,
    document.getElementById('root')
);