import React from 'react';
import { createShallowRenderer, type } from './shallowHelpers';
import { CustomerSearchRoute } from '../src/CustomerSearchRoute';
import { CustomerSearch } from '../src/CustomerSearch/CustomerSearch';

describe('CustomerSearchRoute', () => {
    let render, elementMatching;

    beforeEach(() => {
        ({ render, elementMatching } = createShallowRenderer());
    });
    
    it('parses searchTerm from query string', () => {
        const location = { search: '?searchTerm=abc' };
        render(<CustomerSearchRoute location={location} />);
        expect(
            elementMatching(type(CustomerSearch)).props.searchTerm
        ).toEqual('abc');
    }); 
});