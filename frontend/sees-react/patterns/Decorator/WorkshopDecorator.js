import EventDecorator from "./EventDecorator.js";

/**
 * WorkshopDecorator class
 */
class WorkshopDecorator extends EventDecorator {
  constructor(event) {
    super(event);
    this.resources = []; // List of workshop-specific resources
  }
  /**
   * Get the decorated event details
   * @returns {string} The event details with workshop-specific information
   */
  getDescription() {
    return `${this.base.getDescription()} - This is a workshop event.`;
  }

  /**
   * Add a resource to the workshop
   * @param {string} resource - The resource to add
   */
  addResource(resource) {
    this.resources.push(resource);
  }
}

export default WorkshopDecorator;
