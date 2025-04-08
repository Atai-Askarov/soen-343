import Account from "./Account.js";

/**
 * AccountRegistry - Singleton pattern implementation for centralized account management
 */
class AccountRegistry {
  /**
   * Create a new AccountRegistry
   */
  constructor() {
    // Ensure singleton pattern
    if (AccountRegistry.instance) {
      return AccountRegistry.instance;
    }

    AccountRegistry.instance = this;
    this.accounts = new Map(); // Using Map for efficient lookup by userId
    this.emailIndex = new Map(); // For email lookups
  }

  /**
   * Get the singleton instance
   * @returns {AccountRegistry} The singleton instance
   */
  static getInstance() {
    if (!AccountRegistry.instance) {
      AccountRegistry.instance = new AccountRegistry();
    }
    return AccountRegistry.instance;
  }

  /**
   * Add a new account to the registry
   * @param {Account} account - The account to add
   * @returns {boolean} Whether the account was added successfully
   */
  addAccount(account) {
    if (!(account instanceof Account)) {
      console.error("Invalid account object");
      return false;
    }

    // Check if account with this ID or email already exists
    if (
      this.accounts.has(account.userID) ||
      this.emailIndex.has(account.email)
    ) {
      console.error("Account with this ID or email already exists");
      return false;
    }

    // Add account to both maps
    this.accounts.set(account.userID, account);
    this.emailIndex.set(account.email, account.userID);
    return true;
  }

  /**
   * Remove an account from the registry
   * @param {string|number} userID - The ID of the account to remove
   * @returns {boolean} Whether the account was removed successfully
   */
  removeAccount(userID) {
    const account = this.accounts.get(userID);

    if (!account) {
      console.error("Account not found");
      return false;
    }

    // Remove from both maps
    this.emailIndex.delete(account.email);
    this.accounts.delete(userID);
    return true;
  }

  /**
   * Get an account by ID
   * @param {string|number} userID - The ID of the account to retrieve
   * @returns {Account|null} The found account or null
   */
  getAccountById(userID) {
    return this.accounts.get(userID) || null;
  }

  /**
   * Get an account by email
   * @param {string} email - The email of the account to retrieve
   * @returns {Account|null} The found account or null
   */
  getAccountByEmail(email) {
    const userID = this.emailIndex.get(email);
    if (!userID) return null;
    return this.accounts.get(userID);
  }

  /**
   * Update an existing account
   * @param {string|number} userID - The ID of the account to update
   * @param {Object} updatedInfo - The updated information
   * @returns {boolean} Whether the update was successful
   */
  updateAccount(userID, updatedInfo) {
    const account = this.accounts.get(userID);

    if (!account) {
      console.error("Account not found");
      return false;
    }

    // Handle email updates by updating the email index
    if (updatedInfo.email && updatedInfo.email !== account.email) {
      if (this.emailIndex.has(updatedInfo.email)) {
        console.error("Email already in use");
        return false;
      }
      this.emailIndex.delete(account.email);
      this.emailIndex.set(updatedInfo.email, userID);
    }

    // Update the account
    account.updateProfile(updatedInfo);
    return true;
  }

  /**
   * Authenticate a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Account|null} The authenticated account or null
   */
  authenticate(email, password) {
    const account = this.getAccountByEmail(email);

    if (!account || !account.verifyCredentials(email, password)) {
      return null;
    }

    return account;
  }

  /**
   * Get all accounts in the registry
   * @returns {Array<Account>} Array of all accounts
   */
  getAllAccounts() {
    return Array.from(this.accounts.values());
  }

  /**
   * Find accounts matching specific criteria
   * @param {Function} predicate - Function to test each account
   * @returns {Array<Account>} Array of matching accounts
   * Example  Find accounts using a specific email domain
   *   const corporateAccounts = registry.findAccounts(account => account.email.endsWith("@company.com"));
   *   console.log("Corporate accounts:", corporateAccounts);
   */
  findAccounts(predicate) {
    return Array.from(this.accounts.values()).filter(predicate);
  }

  /**
   * Get the number of accounts in the registry
   * @returns {number} Number of accounts
   */
  getAccountCount() {
    return this.accounts.size;
  }

  /**
   * Clear all accounts from the registry
   */
  clearAllAccounts() {
    this.accounts.clear();
    this.emailIndex.clear();
  }
}

export default AccountRegistry;
