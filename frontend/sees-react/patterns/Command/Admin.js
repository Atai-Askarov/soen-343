import System from "../System.js";
import CommandFactory from "./Commands/CommandFactory.js";
/**
 * Admin - Abstract class for all admin types
 */
class Admin {
  constructor(adminId, permissions = []) {
    if (new.target === Admin) {
      throw new Error("Cannot instantiate abstract class Admin directly.");
    }
    this.adminId = adminId;
    this.permissions = permissions;
    this.system = new System(); // Each admin interacts with the system
    this.commandFactory = new CommandFactory();
  }

  /**
   * Submit a command to the system for execution
   * @param {Command} command - The command to submit
   */
  submitCommand(command) {
    console.log(`Admin ${this.adminId} is submitting a command.`);
    this.system.executeCommand(command);
  }

  /**
   * Undo the last command submitted by this admin
   */
  undoLastCommand() {
    console.log(`Admin ${this.adminId} is undoing the last command.`);
    this.system.undoLastCommand();
  }

  /**
   * Get the history of commands submitted by this admin
   * @returns {Command[]} The list of commands
   */
  getCommandHistory() {
    return this.system.getCommandHistory();
  }
}

export default Admin;
