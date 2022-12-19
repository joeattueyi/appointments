import React, { useEffect, useState, useCallback } from 'react';
import { SearchButtons } from './SearchButtons';
import { objectToQueryString } from '../objectToQueryString';

const CustomerRow = ({ customer, renderCustomerActions }) => {
    return (
        <tr>
            <td>{customer.firstName}</td>
            <td>{customer.lastName}</td>
            <td>{customer.phoneNumber}</td>
            <td>{renderCustomerActions(customer)}</td>
        </tr>
    )
}

export const CustomerSearch = ({ 
    renderCustomerActions,
    lastRowIds,
    searchTerm,
    limit,
    history,
    location,
    customers,
    searchCustomers
}) => {

    const handleSearchTextChanged = ({ target: { value } }) => {
        const params = { limit, searchTerm: value };
        history.push(
          location.pathname + objectToQueryString(params)
        );
    };
  

    useEffect(() => {
        searchCustomers(lastRowIds, searchTerm, limit);
    }, [lastRowIds, searchTerm, limit]);
  
    return (
        <React.Fragment>
            <input 
                value={searchTerm} 
                onChange={handleSearchTextChanged} 
                placeholder="Enter filter text" />
            <SearchButtons 
                customers={customers}
                searchTerm={searchTerm}
                limit={limit}
                lastRowIds={lastRowIds}
                pathname={location.pathname}
            />
            <table>
                <thead> 
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Phone number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c => (
                        <CustomerRow 
                            customer={c} 
                            key={c.id} 
                            renderCustomerActions={renderCustomerActions} />
                    ))}
                </tbody>
            </table> 
        </React.Fragment>
    );
};

CustomerSearch.defaultProps = {
    renderCustomerActions: () => {},
    customers: [],
    searchCustomers: () => {}
};