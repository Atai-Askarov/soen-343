import EventDecorator from './EventDecorator.js';

/**
 * ConferenceDecorator class
 */
class ConferenceDecorator extends EventDecorator {
    constructor(event) {
        super(event);
        this.agenda = []; // Conference agenda
    }
    /**
     * Get the decorated event details
     * @returns {string} The event details with conference-specific information
     */
    getDescription() {
        return `${this.base.getDescription()} - This is a conference event. Agenda: ${this.agenda.join(', ')}`;
    }
       /**
     * Add an agenda item to the conference
     * @param {string} agendaItem - The agenda item
     */
       addAgendaItem(agendaItem) {
        this.agenda.push(agendaItem);
    }

}

export default ConferenceDecorator;