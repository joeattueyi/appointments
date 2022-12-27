
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import 'whatwg-fetch';
import { Router, Route } from 'react-router-dom';
import { appHistory } from './history';
import { ConnectedApp } from './App';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={configureStore()} >
        <Router history={appHistory}>
            <Route path="/" component={ConnectedApp} />
        </Router>
    </Provider>);