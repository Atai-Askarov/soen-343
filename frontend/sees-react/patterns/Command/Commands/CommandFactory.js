import CreateEventCommand from './CreateEventCommand.js';
import EventRegistry from '../../Singleton/EventRegistry.js';

/**
 * CommandFactory - Factory for creating command objects
 */
class CommandFactory {
    constructor() {
        this.eventRegistry = EventRegistry.getInstance(); // Factory has visibility over the registry
    }

    /**
     * Create a command to create an event
     * @param {Object} eventParams - Parameters for creating the event
     * @returns {CreateEventCommand} A new CreateEventCommand instance
     */
    createEventCommand(eventParams) {
        // Inject handlers for interacting with the registry
        const registryHandler = {
            add: (event) => this.eventRegistry.addEvent(event),
            remove: (eventId) => this.eventRegistry.deleteEvent(eventId),
        };

        return new CreateEventCommand(eventParams, registryHandler);
    }
}

export default CommandFactory;