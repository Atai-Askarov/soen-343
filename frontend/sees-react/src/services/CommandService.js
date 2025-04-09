/**
 * Service for managing queued commands
 */
class CommandService {
    constructor() {
      this.loadCommands();
    }
    
    loadCommands() {
      try {
        const savedCommands = localStorage.getItem('pendingCommands');
        this.commands = savedCommands ? JSON.parse(savedCommands) : [];
      } catch (error) {
        console.error('Error loading commands:', error);
        this.commands = [];
      }
    }
    
    saveCommands() {
      try {
        localStorage.setItem('pendingCommands', JSON.stringify(this.commands));
      } catch (error) {
        console.error('Error saving commands:', error);
      }
    }
    
    addCommand(command) {
      this.commands.push(command);
      this.saveCommands();
      return command.id;
    }
    
    getCommands(status = null) {
      if (status) {
        return this.commands.filter(cmd => cmd.status === status);
      }
      return [...this.commands];
    }
    
    getCommandById(id) {
      return this.commands.find(cmd => cmd.id === id);
    }
    
    async approveCommand(id) {
      const commandIndex = this.commands.findIndex(cmd => cmd.id === id);
      if (commandIndex === -1) {
        throw new Error(`Command with ID ${id} not found`);
      }
      
      const command = this.commands[commandIndex];
      
      try {
        // Recreate the proper command object based on the stored data
        let executableCommand;
        switch (command.type) {
          case 'CreateEvent':
            const { CreateEventCommand } = await import('../components/Command/CreateEventCommand');
            executableCommand = new CreateEventCommand(command.eventData);
            break;
          // Add cases for other command types as needed
          default:
            throw new Error(`Unknown command type: ${command.type}`);
        }
        
        // Execute the command
        const result = await executableCommand.execute();
        
        // Update command status
        command.status = 'approved';
        command.executedAt = new Date();
        command.result = result;
        this.saveCommands();
        
        return { success: true, result };
      } catch (error) {
        command.status = 'failed';
        command.error = error.message;
        this.saveCommands();
        return { success: false, error: error.message };
      }
    }
    
    rejectCommand(id, reason) {
      const command = this.commands.find(cmd => cmd.id === id);
      if (!command) {
        throw new Error(`Command with ID ${id} not found`);
      }
      
      command.status = 'rejected';
      command.rejectedAt = new Date();
      command.rejectionReason = reason;
      this.saveCommands();
      
      return { success: true };
    }
    
    deleteCommand(id) {
      const initialLength = this.commands.length;
      this.commands = this.commands.filter(cmd => cmd.id !== id);
      
      if (this.commands.length === initialLength) {
        throw new Error(`Command with ID ${id} not found`);
      }
      
      this.saveCommands();
      return { success: true };
    }
  }
  
  const commandService = new CommandService();
  export default commandService;