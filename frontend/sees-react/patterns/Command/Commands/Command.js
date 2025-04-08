/**
 * Command interface for defining executable commands
 */
class Command {
    /**
     * Execute the command
     */
    execute() {
        throw new Error("Command.execute() must be implemented by subclasses.");
    }

    /**
     * Undo the command
     */
    undo() {
        throw new Error("Command.undo() must be implemented by subclasses.");
    }
}

export default Command;