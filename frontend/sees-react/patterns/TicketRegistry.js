import Ticket from "./Ticket";

class TicketRegistry {
    constructor() {
        if (TicketRegistry.instance) {
            return TicketRegistry.instance;
        }
        this.tickets = []; // Array to store all tickets
        TicketRegistry.instance = this;
    }

    /**
     * Add a ticket to the registry
     * @param {Ticket} ticket - The ticket to add
     */
    addTicket(ticket) {
        if (!(ticket instanceof Ticket)) {
            throw new Error("Only Ticket instances can be added to the registry.");
        }
        this.tickets.push(ticket);
    }

    /**
     * Get all tickets
     * @returns {Ticket[]} List of all tickets
     */
    getAllTickets() {
        return this.tickets;
    }

    /**
     * Find tickets by learner
     * @param {Learner} learner - The learner to search for
     * @returns {Ticket[]} List of tickets for the learner
     */
    findTicketsByLearner(learner) {
        return this.tickets.filter(ticket => ticket.learner === learner);
    }

    /**
     * Find tickets by event
     * @param {Event} event - The event to search for
     * @returns {Ticket[]} List of tickets for the event
     */
    findTicketsByEvent(event) {
        return this.tickets.filter(ticket => ticket.event === event);
    }
}

export default TicketRegistry;