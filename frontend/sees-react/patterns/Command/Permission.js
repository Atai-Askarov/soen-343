/**
 * Permission - Represents a permission that an admin can have
 */
class Permission {
    /**
     * Create a new Permission
     * @param {string} name - The name of the permission
     * @param {string} description - A description of what the permission allows
     */
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    /**
     * Get the permission name
     * @returns {string} The name of the permission
     */
    getName() {
        return this.name;
    }

    /**
     * Get the permission description
     * @returns {string} The description of the permission
     */
    getDescription() {
        return this.description;
    }
}

export default Permission;