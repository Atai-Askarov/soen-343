import Observer from './Observer/Observer.js';
import Account from './Account.js';

/**
 * Stakeholder - Abstract class that implements the Observer interface
 * Represents individuals or organizations with interest in events
 */
class Stakeholder extends Observer {
    /**
     * Create a new Stakeholder
     * @param {string|number} stakeholderID - Unique identifier for the stakeholder
     * @param {Account} account - The associated account
     * @param {string} name - Stakeholder's name
     * @param {string} organization - Organization stakeholder represents
     * @param {string} role - Role within the organization
     * @param {string} contactInfo - Additional contact information
     */
    constructor(stakeholderID, account, name, organization = "", role = "", contactInfo = "") {
        super(); // Call Observer constructor
        
        if (new.target === Stakeholder) {
            throw new Error("Cannot instantiate abstract class Stakeholder directly.");
        }
        
        if (!(account instanceof Account)) {
            throw new Error("Stakeholder requires a valid Account object");
        }

        this.stakeholderID = stakeholderID;
        this.account = account;
        this.name = name;
        this.organization = organization;
        this.role = role;
        this.contactInfo = contactInfo;
    }

    /**
     * Get the stakeholder ID
     * @returns {string|number} The stakeholder's unique ID
     */
    getStakeholderID() {
        return this.stakeholderID;
    }

    /**
     * Update method from Observer interface - must be implemented by subclasses
     * @param {EventState} eventState - The updated event state
     */
    update(eventState) {
        //TODO : implemetn this with the notification feature
        throw new Error("Stakeholder.update() must be implemented by subclasses.");
    }
    
    /**
     * Get the associated account
     * @returns {Account} The stakeholder's account
     */
    getAccount() {
        return this.account;
    }

    
    /**
     * Update stakeholder information
     * @param {Object} info - Updated information
     */
    updateInfo(info) {
        if (info.name) this.name = info.name;
        if (info.organization) this.organization = info.organization;
        if (info.role) this.role = info.role;
        if (info.contactInfo) this.contactInfo = info.contactInfo;
        
        console.log(`Stakeholder ${this.name}'s information has been updated.`);
    }
}

export default Stakeholder;