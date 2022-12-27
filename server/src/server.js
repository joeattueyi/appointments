const {buildApp} = require('./app');
const {generateFakeCustomers} = require('./customers');
const { generateFakeAppointments, buildTimeSlots} = require('./appointments')

let port = process.env.PORT || 3000;
let customers = generateFakeCustomers();
let timeSlots = buildTimeSlots();
let appointments = generateFakeAppointments(customers, timeSlots);
buildApp(customers, appointments, timeSlots).listen(port);
console.log(`Server listening on port ${port}.`);