import { Command } from './Command';

export class SendEmailCampaignCommand extends Command {
  constructor(eventId, eventName) {
    super(
      'SendEmailCampaign', 
      `Send email campaign for "${eventName}"`
    );
    this.eventId = eventId;
    this.eventName = eventName;
    this.result = null; // Store result for potential undo
  }
  
  async execute() {
    try {
      const response = await fetch(`http://localhost:5000/emailSending?eventId=${this.eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email campaign failed');
      }
      
      const data = await response.json();
      this.result = data;
      return data;
    } catch (error) {
      console.error('Email campaign error:', error);
      throw error;
    }
  }
  
  async undo() {
    // If needed, implement a cancellation mechanism
    // For example, calling an endpoint to cancel the email campaign
    // try {
    //   const response = await fetch(`http://localhost:5000/cancelEmailCampaign?eventId=${this.eventId}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
      
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Failed to cancel email campaign');
    //   }
      
    //   return await response.json();
    // } catch (error) {
    //   console.error('Campaign cancellation error:', error);
    //   throw error;
    // }
  }
  
  getDetails() {
    return {
      ...super.getDetails(),
      eventId: this.eventId,
      eventName: this.eventName,
      result: this.result
    };
  }
}