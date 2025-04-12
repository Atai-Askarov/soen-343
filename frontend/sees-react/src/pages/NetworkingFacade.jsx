class NetworkingFacade {
  constructor(eventId) {
    this.eventId = eventId;
  }

  // Fetch event details
  async fetchEventDetails() {
    try {
      const response = await fetch(`http://127.0.0.1:5000/events/${this.eventId}`);
      return await response.json();
    } catch (error) {
      throw new Error('Error fetching event data.');
    }
  }

  // Fetch tickets and user details
  async fetchTickets() {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_tickets_by_event/${this.eventId}`);
      const data = await response.json();
      const userIds = Array.from(new Set(data.tickets.map(ticket => ticket.userid)));
      return { tickets: data.tickets, userIds };
    } catch (error) {
      throw new Error('Error fetching tickets.');
    }
  }

  // Fetch user details by IDs
  async fetchUserDetails(userIds) {
    const usersMap = {};
    try {
      for (const userId of userIds) {
        const response = await fetch(`http://127.0.0.1:5000/users/${userId}`);
        const userData = await response.json();
        if (userData) {
          usersMap[userId] = userData;
        }
      }
      return usersMap;
    } catch (error) {
      throw new Error('Error fetching user details.');
    }
  }

  // Fetch speakers
  async fetchSpeakers() {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/by_role?role=speaker`);
      const data = await response.json();
      if (Array.isArray(data.users)) {
        return data.users;
      } else {
        throw new Error('Speakers data is not in the expected format.');
      }
    } catch (error) {
      throw new Error('Error fetching speakers.');
    }
  }
}

export default NetworkingFacade;
