import EventDecorator from './EventDecorator.js';

/**
 * WorkshopDecorator class
 */
class WorkshopDecorator extends EventDecorator {
    /**
     * Get the decorated event details
     * @returns {string} The event details with workshop-specific information
     */
    getDescription() {
        return `${this.base.getDescription()} - This is a workshop event.`;
    }
}

export default WorkshopDecorator;