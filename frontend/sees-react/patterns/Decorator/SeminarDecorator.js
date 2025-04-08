import EventDecorator from './EventDecorator.js';

/**
 * SeminarDecorator class
 */
class SeminarDecorator extends EventDecorator {
    constructor(event) {
        super(event);
        this.qaSessions = []; // List of Q&A sessions
        this.discussionPanels = []; // List of discussion panels
    }

    /**
     * Add a Q&A session to the seminar
     * @param {string} session - The Q&A session details
     */
    addQASession(session) {
        this.qaSessions.push(session);
    }

    /**
     * Add a discussion panel to the seminar
     * @param {string} panel - The discussion panel details
     */
    addDiscussionPanel(panel) {
        this.discussionPanels.push(panel);
    }

    /**
     * Get the decorated event details
     * @returns {string} The event details with seminar-specific information
     */
    getDescription() {
        return `${this.base.getDescription()} - This is a seminar event. Q&A Sessions: ${this.qaSessions.join(', ')}. Discussion Panels: ${this.discussionPanels.join(', ')}.`;
    }
}

export default SeminarDecorator;