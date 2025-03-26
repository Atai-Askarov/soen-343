import EventDecorator from './EventDecorator.js';

/**
 * ConferenceDecorator class
 */
class ConferenceDecorator extends EventDecorator {
    /**
     * Get the decorated event details
     * @returns {string} The event details with conference-specific information
     */
    getDescription() {
        return `${this.base.getDescription()} - This is a conference event.`;
    }
}

export default ConferenceDecorator;