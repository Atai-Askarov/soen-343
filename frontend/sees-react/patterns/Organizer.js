import Stakeholder from './Stakeholder.js';
import Event from './Observer/Event.js';
import EventState from './Observer/EventState.js';
import EventRegistry from './Singleton/EventRegistry.js'
/**
 * Organizer - Concrete implementation of Stakeholder
 * Represents individuals or organizations that organize events
 */
class Organizer extends Stakeholder {
    /**
     * Create a new Organizer
     * @param {string|number} stakeholderID - Unique identifier for the stakeholder
     * @param {Account} account - The associated account
     * @param {string} name - Organizer's name
     * @param {string} organization - Organization organizer represents
     * @param {string} role - Role within the organization
     * @param {string} contactInfo - Additional contact information
     * @param {Array} organizedEvents - List of events organized by this organizer
     */
    constructor(stakeholderID, account, name, organization = "", role = "", contactInfo = "", organizedEvents = []) {
        super(stakeholderID, account, name, organization, role, contactInfo);
        this.organizedEvents = organizedEvents;
        this.commandFactory = new CommandFactory();
        this.EventRegistry = EventRegistry.getInstance();
    }

    /**
     * Update method from Observer interface
     * @param {EventState} eventState - The updated event state
     */
    update(eventState) {
        //TODO : Implement this better in the notification feature
        console.log(`Organizer ${this.name} received an update for event: ${eventState.getName()}`);
        console.log(`Event details: ${eventState.getDescription()}`);
        
        // Check if this is an event organized by this organizer
        const affectedEvent = this.organizedEvents.find(event => 
            event.getState().getName() === eventState.getName()
        );
        
        if (affectedEvent) {
            console.log(`This is one of your organized events. Status: ${affectedEvent.status}`);
        }
    }
    
    /**
     * Create an event proposal
     * @param {Object} eventDetails - Details for the new event
     * @returns {Event} The created event proposal
     */
    createEventProposal(eventDetails) {
        // Create EventState from the provided details
        const eventState = new EventState({
            name: eventDetails.name,
            date: eventDetails.date,
            location: eventDetails.location,
            description: eventDetails.description
        });
        
        // Create a new Event with "Proposal" status
        const eventProposal = new Event({
            id: eventDetails.id || Date.now(), // Use provided ID or generate one
            state: eventState,
            status: "Proposal", // Initial status
            executive: null // No executive assigned yet
        });
        
        console.log(`Event proposal created: ${eventState.getName()}`);
        
        // Add to organized events
        this.organizedEvents.push(eventProposal);
        
        // Subscribe to updates
        eventProposal.subscribe(this);
        
        return eventProposal;
    }
    
    /**
     * Submit an event for approval. It is added to the event registry
     * @param {Event} event - The event to submit for approval
     * @returns {boolean} Whether submission was successful
     */
    submitEventForApproval(event) {
        // Check if this is an event organized by this organizer
        if (!this.organizedEvents.includes(event)) {
            console.log("You can only submit events that you organize.");
            return false;
        }
        
        // Check if event is in proposal state
        if (event.status !== "Proposal") {
            console.log(`Event is already in ${event.status} state.`);
            return false;
        }
        
        // Update event status and assign executive
        event.status = "Waiting Approval";
        
        console.log(`Event "${event.getState().getName()}" submitted for approval`);
        
        this.EventRegistry.addEvent(event);
        
        return true;
    }
    
    /**
     * Get the list of events organized by this organizer
     * @returns {Array} List of organized events
     */
    getOrganizedEvents() {
        return [...this.organizedEvents];
    }
    
    /**
     * Add an event to the list of organized events
     * @param {Event} event - The event to add
     */
    addOrganizedEvent(event) {
        if (!this.organizedEvents.includes(event)) {
            this.organizedEvents.push(event);
            event.subscribe(this); // Subscribe to updates
            console.log(`Event "${event.getState().getName()}" added to organized events.`);
        }
    }
    
    /**
     * Remove an event from the list of organized events
     * @param {Event} event - The event to remove
     * @returns {boolean} Whether removal was successful
     */
    removeOrganizedEvent(event) {
        const index = this.organizedEvents.indexOf(event);
        if (index !== -1) {
            this.organizedEvents.splice(index, 1);
            event.unsubscribe(this); // Unsubscribe from updates
            console.log(`Event "${event.getState().getName()}" removed from organized events.`);
            return true;
        }
        return false;
    }
}

export default Organizer;