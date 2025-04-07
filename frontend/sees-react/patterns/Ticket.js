class Ticket {
    constructor(event, learner, seatNumber = null) {
        if (!event || !learner) {
            throw new Error("Ticket must be associated with an Event and a Learner.");
        }
        this.event = event; // Reference to the Event object
        this.learner = learner; // Reference to the Learner object
        this.seatNumber = seatNumber; // Optional seat number
        this.issueDate = new Date(); // Date when the ticket was issued
    }

    /**
     * Get ticket details
     * @returns {string} Ticket details
     */
    getDetails() {
        return `Ticket for ${this.learner.name} to attend ${this.event.name} on ${this.event.date}. Seat: ${this.seatNumber || "General Admission"}`;
    }
}

export default Ticket; 