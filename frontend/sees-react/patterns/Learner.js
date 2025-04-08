/**
 * Learner - Concrete implementation of Attendee
 * Represents an attendee primarily interested in learning
 */
class Learner extends Attendee {
  /**
   * Create a new Learner
   * @param {Account} account - The associated account
   * @param {Array} interests - List of topics/areas of interest
   * @param {string} bio - Short biography or description
   * @param {string} completedEvents - List of Events the learner has attendeed in the past
   */
  constructor(
    account,
    interests = [],
    bio = "",
    educationLevel = "",
    completedEvents = [],
  ) {
    super(account, interests, bio);
    this.educationLevel = educationLevel;
    this.completedEvents = completedEvents; // Store completed events
  }
  /**
   * Get all completed events
   * @returns {Array} List of completed events
   */
  getCompletedEvents() {
    return [...this.completedEvents]; // Return a copy to prevent direct modification
  }
  /**

    /**
     * Add a completed event
     * @param {Event} event - The event that was completed
     * @returns {boolean} Whether the event was added successfully
     */
  addCompletedEvent(event) {
    // Check if the event already exists in the completed events
    if (this.completedEvents.some((e) => e.id === event.id)) {
      console.log(`Event ${event.id} is already in completed events`);
      return false;
    }

    this.completedEvents.push(event);
    console.log(`Added event ${event.id} to completed events`);
    return true;
  }
  /**
   * Get attendee type
   * @returns {string} Type of attendee
   */
  getType() {
    return "Learner";
  }
  /**
   * Get the educational level of this learner
   * @returns {string}
   */
  getEducationalLevel() {
    return this.educationLevel;
  }
}

export default Learner;
