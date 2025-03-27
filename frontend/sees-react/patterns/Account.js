import Observer from './Observer/Observer.js';


/**
 * Account - Abstract class for user accounts
 */
class Account {
    /**
     * Create a new Account
     * @param {string|number} userID - Unique identifier for the account
     * @param {string} name - User's name
     * @param {string} email - User's email address
     * @param {string} password - User's password (should be hashed in production)
     */
    constructor(userID, name, email, password) {
        super(); // Call Observer constructor

        if (new.target === Account) {
            throw new Error("Cannot instantiate abstract class Account directly.");
        }
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.password = password;
        }
    /**
     * Update method from Observer interface - receives event state updates
     * @param {EventState} eventState - The updated event state
     */
    update(eventState) {
        // TODO: Implement this with the notification feature
        // Base implementation for handling updates about events
        // Subclasses should override this for specific behavior
        console.log(`Account ${this.name} received update for event: ${eventState.getName()}`);
    }
    /**
     * Register a new account
     * @returns {Promise} Promise representing the registration process
     */
    async register() {
        throw new Error("Account.register() must be implemented by subclasses.");
    }

    /**
     * Login to an existing account
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise} Promise representing the login process
     */
    async login(email, password) {
        throw new Error("Account.login() must be implemented by subclasses.");
    }


    /**
     * Update account information
     * @param {Object} updatedInfo - Object containing fields to update
     */
    updateProfile(updatedInfo) {
        Object.keys(updatedInfo).forEach(key => {
            if (this.hasOwnProperty(key) && key !== 'userID') {
                this[key] = updatedInfo[key];
            }
        });
        console.log(`Profile updated for user ${this.name}.`);
    }

    /**
     * Change account password
     * @param {string} currentPassword - Current password for verification
     * @param {string} newPassword - New password to set
     * @returns {boolean} Whether password was successfully changed
     */
    changePassword(currentPassword, newPassword) {
        if (this.password === currentPassword) {
            this.password = newPassword;
            console.log("Password changed successfully.");
            return true;
        } else {
            console.log("Current password is incorrect.");
            return false;
        }
    }

    /**
     * Get user information (excluding sensitive data)
     * @returns {Object} User information
     */
    getUserInfo() {
        return {
            userID: this.userID,
            name: this.name,
            email: this.email,
            isLoggedIn: this.isLoggedIn
        };
    }

    /**
     * Verify if provided credentials match account
     * @param {string} email - Email to verify
     * @param {string} password - Password to verify
     * @returns {boolean} Whether credentials are valid
     */
    verifyCredentials(email, password) {
        return this.email === email && this.password === password;
    }
}

export default Account;