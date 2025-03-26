import Admin from './Admin.js';

/**
 * DesignatedExecutive - A concrete implementation of the Admin class
 */
class DesignatedExecutive extends Admin {
    /**
     * Create a new DesignatedExecutive
     * @param {string} adminId - The unique ID of the designated executive
     * @param {Permission[]} permissions - A list of permissions assigned to the designated executive
     */
    constructor(adminId, permissions = []) {
        super(adminId, permissions);
    }

    /**
     * Approve an event
     */
    approveEvent(event) {
        console.log(`DesignatedExecutive ${this.adminId} approved the event: ${event.getDescription()}`);
    }
}

export default DesignatedExecutive;