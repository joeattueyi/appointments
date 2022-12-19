
import React from 'react';
import { createContainer } from './domManipulators';
import { AppointmentForm } from '../src/AppointmentForm';
import ReactTestUtils from 'react-dom/test-utils';
import { fetchResponseOk, fetchResponseError, fetchRequestBodyOf  } from './spyHelpers';

describe('AppointmentForm', () => {
    let render, container;

    beforeEach(() => {
        ({ render, container, submit } = createContainer() );
        window.fetch = jest.fn(() => fetchResponseOk( { })); 
        jest
            .spyOn(window, 'fetch')
            .mockReturnValue(fetchResponseOk({}));
    });

    const form = id => 
        container.querySelector(`form[id="${id}"]`);
    
    const field = name =>
        form('appointment').elements[name];

    const selectableServices = [
        'Cut',
        'Blow-dry',
        'Cut & color',
        'Beard trim',
        'Cut & beard trim',
        'Extensions'
    ];

    const customer = { id: 123 };


    it('renders a form', () => {
        render(<AppointmentForm selectableServices={selectableServices}/>);
        expect(form('appointment')).not.toBeNull();
    });

    describe('service field', () => {
        const findOption = (dropdownNode, textContent) => {
            const options = Array.from(dropdownNode.childNodes);
            return options.find(
                option => option.textContent === textContent
            );
        };

        it('renders as a select box', () => {
            render(<AppointmentForm customer={customer} selectableServices={selectableServices}/>);
            expect(field('service')).not.toBeNull();
            expect(field('service').tagName).toEqual('SELECT');
        });

        it('initially has a blank value chosen', () => {
            render(<AppointmentForm customer={customer} selectableServices={selectableServices}/>);
            const firstNode = field('service').childNodes[0];
            expect(firstNode.value).toEqual('');
            expect(firstNode.selected).toBeTruthy();
        });

        it('lists all salon services', () => {
            render(
                <AppointmentForm
                    customer={customer}
                    selectableServices={selectableServices}
                    />
            );

            const optionNodes = Array.from(
                field('service').childNodes
            );

            const renderedServices = optionNodes.map(
                node => node.textContent
            );

            expect(renderedServices).toEqual(
                expect.arrayContaining(selectableServices)
            );
        });

        it('pre-selects the existing value', () => {
            const services = ['Cut', 'Blow-dry'];

            render(
                <AppointmentForm
                    customer={customer}
                    selectableServices={services}
                    service="Blow-dry"
                    />

            );

            const option = findOption(field('service'), 'Blow-dry');
            expect(option.selected).toBeTruthy();
        });
    });

    const timeSlotTable = () =>
            container.querySelector('table#time-slots');

    describe('time slot table', () => {

        const startsAtField = index =>
            container.querySelectorAll(`input[name="startsAt"]`)[index];

        it('renders a table for time slots', () => {
            render(<AppointmentForm />);
            expect(
                container.querySelector('table#time-slots')
            ).not.toBeNull();
        });

        it('renders a time slot for every half an hour between open and close times', () => {
            render(
                <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
            );
            const timesOfDay = timeSlotTable().querySelectorAll(
                'tbody >* th'
            );
            expect(timesOfDay).toHaveLength(4);
            expect(timesOfDay[0].textContent).toEqual('09:00');
            expect(timesOfDay[1].textContent).toEqual('09:30');
            expect(timesOfDay[3].textContent).toEqual('10:30');
        });

        it('renders an empty cell at the start of the header row', () => {
            render(<AppointmentForm />);
            const headRow = timeSlotTable().querySelector(
                'thead > tr'
            );
            expect(headRow.firstChild.textContent).toEqual('');
        });

        it('renders a week of available dates', () => {
            const today = new Date(2018, 11, 1);

            render(<AppointmentForm today={today}/>);
            const dates = timeSlotTable().querySelectorAll(
                'thead >* th:not(:first-child)' 
            );
            expect(dates).toHaveLength(7);
            expect(dates[0].textContent).toEqual('Sat 01 ');
            expect(dates[1].textContent).toEqual('Sun 02 ');
            expect(dates[6].textContent).toEqual('Fri 07 ');
        });

        it.skip('renders a radio button for each time slot', () => {
            const today = new Date();
            const availableTimeSlots = [
                { startsAt: today.setHours(9, 0, 0,0) },
                { startsAt: today.setHours(9, 30, 0, 0) }
            ];

            render(
                <AppointmentForm
                    availableTimeSlots={availableTimeSlots}
                    today={today}
                    />
            );

            const cells = timeSlotTable().querySelectorAll('td');
            console.log("cells", cells)
            expect(
                cells[0].querySelector('input[type="radio"]')
            ).not.toBeNull();
            expect(
                cells[7].querySelector('input[type="radio"]')
            ).not.toBeNull();
        });

        it('does not render radio buttons for unavailable time slots', () => {
              render(<AppointmentForm availableTimeSlots={[]} />);
              const timesOfDay = timeSlotTable()
                    .querySelectorAll('input' );
              expect(timesOfDay).toHaveLength(0);
        });

        it.skip('sets radio button values to the index of the corresponding appointment', () => {
             const today = new Date();
             const availableTimeSlots = [
               { startsAt: today.setHours(9, 0, 0, 0) },
               { startsAt: today.setHours(9, 30, 0, 0) }
             ];
             render(
               <AppointmentForm
                 customer={customer}
                 availableTimeSlots={availableTimeSlots}
                 today={today}
               />);
             expect(startsAtField(0).value).toEqual(
               availableTimeSlots[0].startsAt.toString()
             );
             expect(startsAtField(1).value).toEqual(
               availableTimeSlots[1].startsAt.toString()
             );
        });

        it.skip('saves new value when submitted', () => {
            const today = new Date();
            const availableTimeSlots = [
              { startsAt: today.setHours(9, 0, 0, 0) },
              { startsAt: today.setHours(9, 30, 0, 0) }
            ];
            render(
              <AppointmentForm
                customer={customer}
                availableTimeSlots={availableTimeSlots}
                today={today}
                startsAt={availableTimeSlots[0].startsAt}
                onSubmit={({ startsAt }) =>
                  expect(startsAt).toEqual(availableTimeSlots[1].startsAt)
                }/> 
            );

            ReactTestUtils.Simulate.change(startsAtField(1), {
                target: {
                  value: availableTimeSlots[1].startsAt.toString(),
                  name: 'startsAt'
                }
            });
            ReactTestUtils.Simulate.submit(form('appointment'));
        });
    });

    it('passes the customer id to fetch when submitting', async () => {
        render(<AppointmentForm customer={customer} />);
        await submit(form('appointment'));
        expect(fetchRequestBodyOf(window.fetch)).toMatchObject({
            customer: customer.id
        });
    });
});