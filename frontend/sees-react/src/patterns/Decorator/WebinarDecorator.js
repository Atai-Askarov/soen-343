import EventDecorator from './EventDecorator.js';

/**
 * WebinarDecorator class
 */
class WebinarDecorator extends EventDecorator {
    /**
     * Get the decorated event details
     * @returns {string} The event details with webinar-specific information
     */
    getDescription() {
        return `${this.base.getDescription()} - This is a webinar event.`;
    }
}

export default WebinarDecorator;