import Stakeholder from './Stakeholder.js';

/**
 * Sponsor - Concrete implementation of Stakeholder
 * Represents individuals or organizations that provide funding for events
 */
class Sponsor extends Stakeholder {
    /**
     * Create a new Sponsor
     * @param {string|number} stakeholderID - Unique identifier for the stakeholder
     * @param {Account} account - The associated account
     * @param {string} name - Sponsor's name
     * @param {string} organization - Organization sponsor represents
     * @param {string} role - Role within the organization
     * @param {string} contactInfo - Additional contact information
     * @param {number} contributionAmount - Default contribution amount
     */
    constructor(stakeholderID, account, name, organization = "", role = "", contactInfo = "", contributionAmount = 0) {
        super(stakeholderID, account, name, organization, role, contactInfo);
        this.contributionAmount = contributionAmount;
        this.sponsoredEvents = [];
        this.totalFundingProvided = 0;
    }

    /**
     * Update method from Observer interface
     * @param {EventState} eventState - The updated event state
     */
    update(eventState) {
        console.log(`Sponsor ${this.name} received an update for event: ${eventState.getName()}`);
        console.log(`Event details: ${eventState.getDescription()}`);
        
        // Check if this is an event sponsored by this sponsor
        const sponsoredEvent = this.sponsoredEvents.find(event => 
            event.event.getState().getName() === eventState.getName()
        );
        
        if (sponsoredEvent) {
            console.log(`This is an event you're sponsoring with $${sponsoredEvent.amount}.`);
        }
    }
    
    /**
     * Sponsor an event
     * @param {Event} event - The event to sponsor
     * @param {number} amount - Sponsorship amount (optional, uses default if not provided)
     * @returns {boolean} Whether sponsorship was successful
     */
    sponsorEvent(event, amount = null) {
        // Use provided amount or default contribution amount
        const sponsorshipAmount = amount !== null ? amount : this.contributionAmount;
        
        if (sponsorshipAmount <= 0) {
            console.log("Sponsorship amount must be greater than zero.");
            return false;
        }
        
        // Check if already sponsoring this event
        const existingSponsorhip = this.sponsoredEvents.find(s => s.event === event);
        if (existingSponsorhip) {
            console.log(`Already sponsoring this event with $${existingSponsorhip.amount}.`);
            return false;
        }
        
        // Add to sponsored events
        this.sponsoredEvents.push({
            event: event,
            amount: sponsorshipAmount,
            date: new Date()
        });
        
        // Subscribe to updates
        event.subscribe(this);
        
        console.log(`${this.name} is now sponsoring ${event.getState().getName()} with $${sponsorshipAmount}.`);
        return true;
    }
    
    /**
     * Provide funding for an event
     * @param {Event} event - The event to fund
     * @param {number} amount - Amount to provide
     * @returns {boolean} Whether funding was provided successfully
     */
    provideFunding(event, amount) {
        // Validate amount
        if (amount <= 0) {
            console.log("Funding amount must be greater than zero.");
            return false;
        }
        
        // Check if sponsoring this event
        const sponsorship = this.sponsoredEvents.find(s => s.event === event);
        if (!sponsorship) {
            console.log("You must sponsor an event before providing funding.");
            return false;
        }
        
        // Update total funding provided
        this.totalFundingProvided += amount;
        
        console.log(`${this.name} has provided $${amount} funding for ${event.getState().getName()}.`);
        console.log(`Total funding provided to date: $${this.totalFundingProvided}`);
        
        return true;
    }
    
    /**
     * Get sponsored events
     * @returns {Array} List of sponsored events with amounts
     */
    getSponsoredEvents() {
        return [...this.sponsoredEvents];
    }
    
    /**
     * Get total funding provided
     * @returns {number} Total amount of funding provided
     */
    getTotalFundingProvided() {
        return this.totalFundingProvided;
    }
    
    /**
     * Update default contribution amount
     * @param {number} amount - New contribution amount
     */
    updateContributionAmount(amount) {
        if (amount > 0) {
            this.contributionAmount = amount;
            console.log(`Default contribution amount updated to $${amount}.`);
        } else {
            console.log("Contribution amount must be greater than zero.");
        }
    }
}

export default Sponsor;