/**
 * CommandInvoker - Manages command execution flow
 */
export class CommandInvoker {
    constructor() {
      this.commandQueue = [];
      this.executedCommands = [];
    }
    
    addCommand(command) {
      this.commandQueue.push(command);
      command.status = 'pending';
      return this;
    }
    
    async executeAll() {
      const results = [];
      for (const command of this.commandQueue) {
        try {
          const result = await command.execute();
          this.executedCommands.push(command);
          results.push({ command, success: true, result });
        } catch (error) {
          results.push({ command, success: false, error });
        }
      }
      this.commandQueue = [];
      return results;
    }
    
    async executeSingle(command) {
      try {
        const result = await command.execute();
        this.executedCommands.push(command);
        return { success: true, result };
      } catch (error) {
        return { success: false, error };
      }
    }
    
    async undoLast() {
      const command = this.executedCommands.pop();
      if (!command || typeof command.undo !== 'function') {
        return { success: false, error: 'Nothing to undo' };
      }
      
      try {
        const result = await command.undo();
        return { success: true, result };
      } catch (error) {
        this.executedCommands.push(command);
        return { success: false, error };
      }
    }
    
    clearQueue() {
      this.commandQueue = [];
    }
    
    getPendingCommands() {
      return this.commandQueue.map(cmd => cmd.getDescription());
    }
  }