import ReactDOM from 'react-dom';
import ReactTestUtils, { act} from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { storeSpy } from 'expect-redux';
import { configureStore } from '../src/store';
import React from 'react';



export const withEvent = (name, value) => ({
    target: { name, value }
});

export const createContainerWithStore = () => {
    const store = configureStore([storeSpy]);
    const container = createContainer();
    return {
        ...container,
        store,
        renderWithStore: component => {
            act(() => {
                ReactDOM.render(
                    <Provider store={store}>{component}</Provider>,
                    container.container
                );
            }); 
        }
    }; 
};

export const createContainer = () => {

    const container = document.createElement('div');

    const form = id => 
        container.querySelector(`form[id="${id}"]`);

    const field = (formId, name) => form(formId).elements[name];

    const labelFor = formElement =>
                container.querySelector(`label[for="${formElement}"]`);

    const element = selector =>
        container.querySelector(selector)

    const elements = selector =>
        Array.from(container.querySelectorAll(selector));
    const simulateEvent = eventName => (element, eventData) =>
        ReactTestUtils.Simulate[eventName](element, eventData)

    const simulateEventAndWait = eventName => async (
        element,
        eventData
    ) => 
        await act(async () =>
            ReactTestUtils.Simulate[eventName](element, eventData)
        );
    
    const children = element => Array.from(element.childNodes);

    return {
        blur: simulateEvent('blur'),
        render : component =>
        act(() => {
            ReactDOM.render(component, container);
        }),
        container,
        form,
        field,
        labelFor,
        element,
        elements,
        children,
        click: simulateEvent('click'),
        change: simulateEvent('change'),
        submit: simulateEventAndWait('submit'),
        clickAndWait: simulateEventAndWait('click'),
        changeAndWait: simulateEventAndWait('change'),
        renderAndWait: async component =>
            await act(async () => ReactDOM.render(component, container)),
    };
};