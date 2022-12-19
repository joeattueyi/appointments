import React from 'react';
import { createContainerWithStore, withEvent } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, fetchRequestBodyOf  } from './spyHelpers';
import 'whatwg-fetch';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { expectRedux } from 'expect-redux';



const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
};

const validCustomer = {
    firstName: 'first',
    lastName: 'last',
    phoneNumber: '123456789'
};

describe('CustomerForm', () => {
    let renderWithStore,
    store,
    container, 
    form, 
    field, 
    labelFor, 
    element,
    change,
    blur,
    submit;

    beforeEach(() => {
        ({ renderWithStore, 
            store,
            container,
            form,
            field,
            labelFor,
            element,
            change,
            submit,
            blur
         } = createContainerWithStore());
        // window.fetch = jest.fn(() => fetchResponseOk( { })); 
        jest
            .spyOn(window, 'fetch')
            .mockReturnValue(fetchResponseOk({}));
    });


    afterEach(() => {
        window.fetch.mockRestore();
    });



    const itRendersAsATextBox = (fieldName) => 
        it('renders as a text box', () => {
            renderWithStore(<CustomerForm/>);
            expectToBeInputFieldOfTypeText(field('customer', fieldName));
        });

    const itIncludesTheExistingValue = (fieldName) =>
        it('include the existing value', () => {
            renderWithStore(<CustomerForm {...{[fieldName]: 'value' } } />);
            expect(field('customer',fieldName).value).toEqual('value');    
        });

    const itSubmitsNewValue = (fieldName, value) =>
        it('saves new value when submitted', async () => {

            renderWithStore(
                <CustomerForm
                    {...validCustomer}
                    { ...{[fieldName]: 'existingValue'} } 
                    fetch={window.fetch.fn}
                />);
            await change(field('customer',fieldName), withEvent(fieldName, value));
            await submit(form('customer'));

            expect(fetchRequestBodyOf(window.fetch)).toMatchObject({
                [fieldName]: value
            });
        });
    
    const itRendersALabel = (fieldName, value) => {
        it('renders a label for the first name field', () => {
            renderWithStore(<CustomerForm />);
            expect(labelFor(fieldName)).not.toBeNull();
            expect(labelFor(fieldName).textContent).toEqual(value);
        });
    }

    const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
        it('assigns an id that matches the label id to the first name field', () => {
            renderWithStore(<CustomerForm />);
            expect(field('customer',fieldName).id).toEqual(fieldName);
        });
    }

    const itSubmitsExistingValue = (fieldName, value) => {
        it('saves existing first name when submitted', async () => {

            renderWithStore(
                <CustomerForm
                  {...validCustomer}
                  { ...{[fieldName]: value}}
                  fetch={window.fetch.fn}
           /> );
           await submit(form('customer'));
           expect(fetchRequestBodyOf(window.fetch)).toMatchObject({
            [fieldName]: value
            });
       });
    }
    it('renders a form', () => {
        renderWithStore(<CustomerForm />);
        expect(
          form('customer')
        ).not.toBeNull();
    });

    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName');
        itRendersALabel('firstName', 'First name');
        itAssignsAnIdThatMatchesTheLabelId('firstName');
        itSubmitsExistingValue('firstName', 'firstName');
        itSubmitsNewValue('firstName', 'firstName');

    });

    describe('last name field', () => {
        itRendersAsATextBox('lastName');
        itIncludesTheExistingValue('lastName');
        itRendersALabel('lastName', 'Last name');
        itAssignsAnIdThatMatchesTheLabelId('lastName');
        itSubmitsExistingValue('lastName', 'lastName');
        itSubmitsNewValue('lastName', 'lastName');
    })


    describe('phone number field', () => {
        itRendersAsATextBox('phoneNumber');
        itIncludesTheExistingValue('phoneNumber');
        itRendersALabel('phoneNumber', 'Phone number');
        itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
        itSubmitsExistingValue('phoneNumber', '123456789');
        itSubmitsNewValue('phoneNumber', '123456789');

    })

    it('has a submit button', () => {
        renderWithStore(<CustomerForm />);
        const submitButton = element(
            'input[type="submit"]'
        );
        expect(submitButton).not.toBeNull();
    })

    it('dispatches ADD_CUSTOMER_REQUEST when submitting data', async () => {
        renderWithStore(<CustomerForm {...validCustomer} />);
        await submit(form('customer'));
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({
                type: 'ADD_CUSTOMER_REQUEST',
                customer: validCustomer
            });
    });

    it('prevents the default action when submitting the form', async () =>{
        const preventDefaultSpy = jest.fn();

        renderWithStore(<CustomerForm {...validCustomer} />);
        
        await submit(form('customer'), {
            preventDefault: preventDefaultSpy
        });
        

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('renders error message when error prop is true', () => {
        renderWithStore(<CustomerForm {...validCustomer} />);
        store.dispatch({ type: 'ADD_CUSTOMER_FAILED' });
        expect(element('.error').textContent).toMatch('error occurred');
    });

    it('displays error after blur when first name field is blank', () => {
        renderWithStore(<CustomerForm />);
       blur(
         field('customer', 'firstName'),
         withEvent('firstName', ' ')
       );
       expect(element('.error')).not.toBeNull();
       expect(element('.error').textContent).toMatch(
         'First name is required'
       );
    });

    const itInvalidatesFieldWithValue = (
        fieldName,
        value,
        description
    ) => {
        it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
            renderWithStore(<CustomerForm />);
            blur(
                field('customer', fieldName),
                withEvent(fieldName, value)
            );
            expect(element('.error')).not.toBeNull();
            expect(element('.error').textContent).toMatch(
                description
            );
        }); 
    }

    itInvalidatesFieldWithValue(
        'firstName',
        ' ',
        'First name is required'
    );
    itInvalidatesFieldWithValue(
        'lastName',
        ' ',
        'Last name is required'
    );

    itInvalidatesFieldWithValue(
        'phoneNumber',
        ' ',
        'Phone number is required'
    );

    it('accepts standard phone number characters when validating', () => {
        renderWithStore(<CustomerForm />);
        blur(
            element("[name='phoneNumber']"),
            withEvent('phoneNumber', '0123456789+()- ')
        );
        expect(element('.error')).toBeNull();
    });

    it('does not submit the form when there are validation errors', async () => {
        renderWithStore(<CustomerForm />);
        await submit(form('customer'));
        return expectRedux(store)
            .toNotDispatchAnAction(100)
            .ofType('ADD_CUSTOMER_REQUEST');
    });
    
    it('renders validation errors after submission fails', async () => {
        renderWithStore(<CustomerForm />);
        await submit(form('customer'));
        expect(window.fetch).not.toHaveBeenCalled();
        expect(element('.error')).not.toBeNull();
    });

    it('renders field validation errors from server', () => {
        const errors = {
            phoneNumber: 'Phone number already exists in the system'
        };
        renderWithStore(<CustomerForm {...validCustomer} />);
        store.dispatch({
            type: 'ADD_CUSTOMER_VALIDATION_FAILED',
            validationErrors: errors
        });
        expect(element('.error').textContent).toMatch(
            errors.phoneNumber
        );
    });

    it('displays indicator when form is submitting', () => {
        renderWithStore(<CustomerForm {...validCustomer} />);
        store.dispatch({
            type: 'ADD_CUSTOMER_SUBMITTING'
        })
        expect(element('span.submittingIndicator')).not.toBeNull();

    });

    it('initially does not display the submitting indicator', () => {
        renderWithStore(<CustomerForm {...validCustomer} />);
        expect(element('.submittingIndicator')).toBeNull();
    });

    it('hides indicator when form has submitted',  () => {
        renderWithStore(<CustomerForm {...validCustomer} />);
        store.dispatch({ type: 'ADD_CUSTOMER_SUCCESSFUL' })
        expect(element('.submittingIndicator')).toBeNull();
    });
});