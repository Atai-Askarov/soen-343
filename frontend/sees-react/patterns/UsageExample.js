// Importing necessary classes
import Event from './Observer/Event.js';
import EventState from './Observer/EventState.js';
import Observer from './Observer/Observer.js';
import SeminarDecorator from './Decorator/SeminarDecorator.js';
import EventRegistry from './Singleton/EventRegistry.js';

//? **********************
//? THIS FILE IS JUST TO SHOW TO EVERYTHING WORKS. ITS NOT ACTUAL PRODUCTION CODE
//? **********************

/**
 * ExampleObserver - A concrete implementation of the Observer interface. This will be changed to be stakeholder , organizer
 * This observer listens for changes in the state of an event.
 */
class ExampleObserver extends Observer {
    /**
     * Update method to handle state changes
     * @param {EventState} eventState - The updated event state
     */
    update(eventState) {
        console.log(`Observer notified! Event "${eventState.getName()}" updated.`);
        console.log(`New Details: ${eventState.getDescription()}`);
    }
}

// Main function to demonstrate the usage of the patterns
function main() {
    // Step 1: Create an EventState object
    const initialState = new EventState({
        name: 'Tech Conference',
        date: new Date('2025-05-15'),
        location: 'New York City',
        description: 'A conference about the latest in tech.'
    });

    // Step 2: Create an Event object
    const event = new Event({
        id: 1,
        state: initialState,
        status: 'Waiting Approval',
        executive: 'John Doe'
    });

    // Step 3: Create and subscribe an observer
    const observer = new ExampleObserver();
    event.subscribe(observer);

    // Step 4: Update the event state and notify observers
    const updatedState = new EventState({
        name: 'Tech Conference',
        date: new Date('2025-05-16'),
        location: 'San Francisco',
        description: 'The conference has been moved to San Francisco.'
    });
    event.updateState(updatedState);

    // Step 5: Decorate the event with additional details
    const seminarEvent = new SeminarDecorator(event);
    console.log(`Decorated Event Details: ${seminarEvent.getDescription()}`);

    // Step 6: Use the Singleton EventRegistry to manage events
    const registry = EventRegistry.getInstance();
    registry.addEvent(event);
    console.log('Event added to the registry.');

    // Step 7: Display all events in the registry
    console.log('Current events in the registry:', registry.events);
}

// Run the main function
main();