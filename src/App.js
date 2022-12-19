import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { AppointmentFormLoader } from './AppointmentFormLoader';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { CustomerSearch } from './CustomerSearch/CustomerSearch';
import {  Route, Link, Switch } from 'react-router-dom';
import { CustomerSearchRoute } from './CustomerSearchRoute';
import { connect } from 'react-redux';
import { CustomerHistory } from './CustomerHistory';

export const MainScreen = () => (
    <React.Fragment>
        <div className="button-bar" >
            <Link to="/addCustomer" className="button">
                Add customer and appointment
            </Link>
            <Link to="/searchCustomers" className="button">
                Search customers
            </Link>
        </div>
        <AppointmentsDayViewLoader />
    </React.Fragment>
);


export const App = ({ history, setCustomerForAppointment }) => {
    const [view, setView] = useState('dayView');

    //const [customer, setCustomer] = useState();
    
    const transitionToAddCustomer = useCallback(() => 
        setView('addCustomer'),
    []);

    const transitionToAddAppointment = customer => {
        setCustomerForAppointment(customer);
        history.push('/addAppointment');
      };

    const transitionToDayView = useCallback(
        () => setView('dayView'),
        []
    );

    const transitionToCustomerHistory = customer =>
        history.push(`/customer/${customer.id}`);

    const searchActions = customer => (
        <React.Fragment>
            <button 
                role="button"
                onClick={() => setCustomerForAppointment(customer)}>
                Create appointment
            </button>
            <button
                role="button"
                onClick={() => transitionToCustomerHistory(customer)}>
                View history
            </button>
        </React.Fragment>
    )


    return (
        <Switch>
            <Route path="/addCustomer" component={CustomerForm}/>
            <Route 
                path="/addAppointment"  
                render={() => 
                    <AppointmentFormLoader onSave={transitionToDayView}/>}
            />
            <Route 
                path="/searchCustomers"
                render={props => (
                    <CustomerSearchRoute
                        {...props}
                        renderCustomerActions={searchActions}
                    />
                )}
            />
            <Route component={MainScreen} />
            <Route 
                path="/customer/:id" 
                render={({ match }) => <CustomerHistory id={match.params.id} />}
            />
        </Switch>
    );
};


const mapDispatchToProps = {
    setCustomerForAppointment: customer => ({
        type: 'SET_CUSTOMER_FOR_APPOINTMENT',
        customer 
    })
};

export const ConnectedApp = connect(
    null,
    mapDispatchToProps
)(App);