import EventDecorator from './EventDecorator.js';

/**
 * SeminarDecorator class
 */
class SeminarDecorator extends EventDecorator {
    /**
     * Get the decorated event details
     * @returns {string} The event details with seminar-specific information
     */
    getDescription() {
        return `${this.base.getDescription()} - This is a seminar event.`;
    }
}

export default SeminarDecorator;