import Account from './Account.js';
import Observer from './Observer/Observer.js';

/**
 * Attendee - Abstract class for event attendees
 * Uses composition to encapsulate an Account object
 */
class Attendee extends Observer{
    /**
     * Create a new Attendee
     * @param {Account} account - The associated account
     * @param {Array} interests - List of topics/areas of interest
     * @param {string} bio - Short biography or description
     */
    constructor(account, interests = [], bio = "") {
        if (new.target === Attendee) {
            throw new Error("Cannot instantiate abstract class Attendee directly.");
        }
        
        this.account = account;
        this.interests = interests;
        this.bio = bio;
    }

    /**
     * Get the associated account
     * @returns {Account} The associated account
     */
    getAccount() {
        return this.account;
    }

    /**
     * Update attendee information
     * @param {Object} info - Updated information
     */
    updateInfo(info) {
        if (info.interests) this.interests = info.interests;
        if (info.bio) this.bio = info.bio;
        
        // Any other attendee-specific fields can be updated here
        console.log("Attendee information updated");
    }
    
    /**
     * Abstract method to get attendee type
     * @returns {string} Type of attendee
     */
    getType() {
        throw new Error("Attendee.getType() must be implemented by subclasses.");
    }
}




export default Attendee;