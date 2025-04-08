import EventDecorator from './EventDecorator.js';

/**
 * WebinarDecorator class
 */
class WebinarDecorator extends EventDecorator {
    constructor(event) {
        super(event);
        this.link = ''; // Link 
    }
    /**
     * Get the decorated event details
     * @returns {string} The event details with webinar-specific information
     */
    getDescription() {
        return `${this.base.getDescription()} - This is a webinar event.`;
    }
    /**
     * Set the webinar link
     * @param {string} link - The webinar link
     */
       setLink(link) {
        this.link = link;
    }
}

export default WebinarDecorator;