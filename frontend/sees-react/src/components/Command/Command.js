/**
 * Abstract Command class that all commands must extend
 */
export class Command {
  constructor(type, description) {
    this.type = type;
    this.description = description;
    this.timestamp = new Date();
    this.status = 'pending'; // pending, approved, rejected
    this.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }
  
  execute() {
    throw new Error("Execute method must be implemented by concrete commands");
  }
  
  getDetails() {
    return {
      id: this.id,
      type: this.type,
      description: this.description,
      timestamp: this.timestamp,
      status: this.status
    };
  }
}