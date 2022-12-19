import React from 'react';
import ReactDom from 'react-dom';
import {Appointment, AppointmentsDayView} from '../src/AppointmentsDayView';
import ReactTestUtils from 'react-dom/test-utils';
import {sampleAppointments} from '../src/sampleData';

describe('Appointment', () => {
  let container;
  let customer;

  beforeEach(() => {
    container = document.createElement('div');
  });
  
  const render = component => ReactDom.render(component, container);
  it('renders the customer first name', () => {
    const customer = { firstName: "Ashley" };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch('Ashley');
  });
});

describe('AppointmentsDayView', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
    });

    const render = component =>
        ReactDom.render(component, container);
    
    it('renders a div with the right id', () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(container.querySelector('div#appointmentsDayView')).not.toBeNull();
    });

    it('renders multiple appointments in an ol element', () => {
        render(<AppointmentsDayView appointments={sampleAppointments} />);
        expect(container.querySelector('ol')).not.toBeNull();
        expect(
            container.querySelector('ol').children
        ).toHaveLength(9);
    })

    it('renders each appointment in a li',() => {   
        render(<AppointmentsDayView appointments={sampleAppointments} />);
        expect(container.querySelectorAll('li')).toHaveLength(9);
        expect(
            container.querySelectorAll('li')[0].textContent
        ).toEqual('09:00');
        expect(
            container.querySelectorAll('li')[1].textContent
        ).toEqual('10:00');
    });

    it('initially shows a message saying there are no appointments today', () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(container.textContent).toMatch(
            'There are no appointments scheduled for today.'
        );
    });

    it.skip('selects the first appointment by default', () => {
        render(<AppointmentsDayView appointments={sampleAppointments} />);
        expect(container.textContent).toMatch('Ashley');
    });

    it('has a button element in each li', () => {
        render(<AppointmentsDayView appointments={sampleAppointments} />);
        expect(
            container.querySelectorAll('li > button')
        ).toHaveLength(9);
        expect(
            container.querySelectorAll('li > button')[0].type
        ).toEqual('button');
    });

    it.skip('renders another appointment when selected', () => {
        render(<AppointmentsDayView appointments={sampleAppointments} />);
        const button = container.querySelectorAll(
            'button'
        )[1];
        ReactTestUtils.Simulate.click(button);
        expect(container.textContent).toMatch('Jordan');
    })
});

