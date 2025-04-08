import Event from "../Observer/Event.js";

/**
 * Abstract EventDecorator class
 */
class EventDecorator {
  /**
   * Base decorator constructor
   * @param {Event} event - The base event to decorate
   */
  constructor(event) {
    if (new.target === EventDecorator) {
      throw new Error(
        "Cannot instantiate abstract class EventDecorator directly.",
      );
    }
    this.base = event;
  }

  /**
   * Get the decorated event details
   * @returns {Object} The event details
   */
  getDescription() {
    return this.base.getDescription();
  }
}

export default EventDecorator;
