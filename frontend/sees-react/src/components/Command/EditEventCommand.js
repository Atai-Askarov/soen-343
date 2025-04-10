import { Command } from './Command';

export class EditEventCommand extends Command {
  constructor(eventId, eventData) {
    super(
      'EditEvent', 
      `Edit event "${eventData.eventname}" on ${new Date(eventData.eventdate).toLocaleDateString()}`
    );
    this.eventId = eventId;
    this.eventData = eventData;
    this.originalEvent = null; // Store original event data for undo capability
  }
  
  async execute() {
    try {
      // First, fetch the original event data for potential undo operation
      const getResponse = await fetch(`http://localhost:5000/events/${this.eventId}`);
      if (!getResponse.ok) {
        throw new Error(`Failed to fetch original event (ID: ${this.eventId})`);
      }
      this.originalEvent = await getResponse.json();
      
      // Now perform the update operation
      const response = await fetch(`http://localhost:5000/update_event/${this.eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Event update failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Event update error:', error);
      throw error;
    }
  }
  
  async undo() {
    if (!this.originalEvent) {
      throw new Error('Cannot undo: original event state not available');
    }
    
    try {
      const response = await fetch(`http://localhost:5000/update_event/${this.eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.originalEvent),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Event undo failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Event undo error:', error);
      throw error;
    }
  }
  
  getDetails() {
    return {
      ...super.getDetails(),
      eventId: this.eventId,
      eventName: this.eventData.eventname,
      eventDate: this.eventData.eventdate,
      eventLocation: this.eventData.eventlocation,
      eventType: this.eventData.event_type,
      speakerId: this.eventData.speakerid,
      organizerId: this.eventData.organizerid,
      venueId: this.eventData.venue_id
    };
  }
}