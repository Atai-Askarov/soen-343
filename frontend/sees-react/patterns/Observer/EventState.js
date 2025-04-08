/**
 * EventState - Holds the state of an event
 */
class EventState {
  /**
   * Create a new EventState
   * @param {string} name - Name of the event
   * @param {Date} date - Date of the event
   * @param {string} location - Location of the event
   * @param {string} description - Description of the event
   */
  constructor({ name, date, location, description }) {
    this.name = name;
    this.date = date;
    this.location = location;
    this.description = description;
  }

  /**
   * Get the event name
   * @returns {string} The event name
   */
  getName() {
    return this.name;
  }

  /**
   * Get the event date
   * @returns {Date} The event date
   */
  getDate() {
    return this.date;
  }

  /**
   * Get the event location
   * @returns {string} The event location
   */
  getLocation() {
    return this.location;
  }

  /**
   * Get the event description
   * @returns {string} The event description
   */
  getDescription() {
    return this.description;
  }
}

export default EventState;
