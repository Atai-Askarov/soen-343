import Command from './Command.js';
import Event from '../../Observer/Event.js';

/**
 * CreateEventCommand - A concrete implementation of the Command interface
 */
class CreateEventCommand extends Command {
    /**
     * Create a new CreateEventCommand
     * @param {Object} eventParams - Parameters for creating the event
     * @param {Function} registryHandler - A function to handle adding/removing events in the registry
     */
    constructor(eventParams, registryHandler) {
        super();
        this.eventParams = eventParams;
        this.registryHandler = registryHandler; // Dependency injected from CommandFactory. It is the EventRegistry that has visibility over the registry and passes it to this command
        this.createdEvent = null; // Store the created event for undo
    }

    /**
     * Execute the command to create an event
     */
    execute() {
        const event = new Event(this.eventParams);
        this.registryHandler.add(event); // Use the injected handler to add the event
        this.createdEvent = event;
        console.log(`Event created: ${event.getDescription()}`);
    }

    /**
     * Undo the command by removing the created event
     */
    undo() {
        if (this.createdEvent) {
            this.registryHandler.remove(this.createdEvent.id); // Use the injected handler to remove the event
            console.log(`Event with ID ${this.createdEvent.id} has been removed.`);
            this.createdEvent = null;
        } else {
            console.log("No event to undo.");
        }
    }
}

export default CreateEventCommand;