/**
 * System - Manages the execution of commands and maintains a history
 */
class System {
    constructor() {
        this.commandHistory = []; // Stack to store executed commands
    }

    /**
     * Execute a command and add it to the history
     * @param {Command} command - The command to execute
     */
    executeCommand(command) {
        command.execute();
        this.commandHistory.push(command); // Add the command to the history
    }

    /**
     * Undo the last executed command
     */
    undoLastCommand() {
        if (this.commandHistory.length === 0) {
            console.log("No commands to undo.");
            return;
        }

        const lastCommand = this.commandHistory.pop(); // Remove the last command from the history
        lastCommand.undo(); // Undo the command
    }

    /**
     * Get the history of executed commands
     * @returns {Command[]} The list of executed commands
     */
    getCommandHistory() {
        return this.commandHistory;
    }
}

export default System;