import EventState from "./EventState.js";

/**
 * Event - Base class for all events in the system
 */
class Event {
  /**
   * Create a new Event
   * @param {string|number} params.id - Unique identifier for the event
   * @param {EventState} params.state - The state of the event
   * @param {string} params.status - Status of the event (e.g., "Waiting Approval" or "Approved")
   * @param {DesignatedExecutive} params.executive - The executive responsible for the event
   */
  constructor({ id, state, executive }) {
    this.id = id;
    this.state = state;
    this.status = "Waiting Approval"; // By default, an event is created and waits for approval
    this.executive = executive;
    this.observers = []; // List of observers
  }

  /**
   * Subscribe an observer to this event
   * @param {Observer} observer - The observer to subscribe
   */
  subscribe(observer) {
    this.observers.push(observer);
  }

  /**
   * Unsubscribe an observer from this event
   * @param {Observer} observer - The observer to unsubscribe
   */
  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  /**
   * Notify all observers of a state change
   */
  notifyObservers() {
    this.observers.forEach((observer) => observer.update(this.state));
  }

  /**
   * Update the event state and notify observers
   * @param {EventState} newState - The new state of the event
   */
  updateState(newState) {
    this.state = newState;
    this.notifyObservers();
  }

  /**
   * Get the event state
   * @returns {EventState} The current state of the event
   */
  getState() {
    return this.state;
  }

  /**
   * Get a nicely formatted description of the event
   * @returns {string} A formatted string describing the event
   */
  getDescription() {
    return `
            Event ID: ${this.id}
            Name: ${this.state.getName()}
            Date: ${this.state.getDate().toLocaleDateString()}
            Location: ${this.state.getLocation()}
            Description: ${this.state.getDescription()}
            Status: ${this.status}
            Executive: ${this.executive.name} (${this.executive.role})
            `;
  }
}

export default Event;
