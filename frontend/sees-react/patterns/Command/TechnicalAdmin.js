import Admin from './Admin.js';

/**
 * TechnicalAdmin - A concrete implementation of the Admin class
 */
class TechnicalAdmin extends Admin {
    /**
     * Create a new TechnicalAdmin
     * @param {string} adminId - The unique ID of the technical admin
     * @param {Permission[]} permissions - A list of permissions assigned to the technical admin
     */
    constructor(adminId, permissions = []) {
        super(adminId, permissions);
    }

    /**
     * Perform a technical task
     */
    performTechnicalTask() {
        console.log(`TechnicalAdmin ${this.adminId} is performing a technical task.`);
    }
}

export default TechnicalAdmin;