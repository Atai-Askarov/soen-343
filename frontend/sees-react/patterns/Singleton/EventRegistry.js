/**
 * EventRegistry - Singleton pattern implementation for event management
 */
class EventRegistry {
    constructor() {
      this.events = {};
    }
    
    /**
     * Get the singleton instance
     * @returns {EventRegistry} The singleton instance
     */
    static getInstance() {
      if (!EventRegistry.instance) {
        EventRegistry.instance = new EventRegistry();
      }
      return EventRegistry.instance;
    }
    
    /**
     * Add an event
     * @param {Event} Event - The Event object
     */
    addEvent(Event) {
      const eventName = Event.constructor.name;
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(Event);
    }
    
    /**
     * Delete an event or all events if no event name is passed
     * @param {string} [eventName] - The event type to delete 
     */
    deleteEvent(eventName) {
      if (!eventName) {
        // Delete all events
        this.events = {};
        return;
      }
      
      // Delete specific event type
      if (this.events[eventName]) {
        delete this.events[eventName];
      }
    }
 
}
  
export default EventRegistry;