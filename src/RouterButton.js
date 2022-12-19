import React from 'react'
import { Link } from 'react-router-dom';
import { objectToQueryString } from './objectToQueryString';


export const RouterButton = ({
    queryParams,
    pathname,
    children,
    disabled
}) => {
    let className = 'button';
    if (disabled) {
       className += ' disabled';
    }
    return (
       <Link
         className={className}
         to={{
           pathname: pathname,
           search: objectToQueryString(queryParams)
         }}>
         {children}
       </Link>
    ); 
};