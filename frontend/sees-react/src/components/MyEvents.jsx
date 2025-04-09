import React, { useEffect, useState } from 'react';
import './css/myevents.css'; // Adjust the path as necessary

const MyEvents = () => {
    const [tickets, setTickets] = useState([]);
    const [events, setEvents] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); 
        }
    }, []);
    
    useEffect(() => {
        if (user) {
            const fetchTickets = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/get_tickets_by_user/${user.id}`);
                    if (!response.ok) {
                        throw new Error(`Error fetching tickets: ${response.statusText}`);
                    }
                    const data = await response.json();
                    setTickets(data.tickets); 
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchTickets();
        }
    }, [user]);
    
    useEffect(() => {
        if (tickets.length > 0) {
            const fetchEvents = async () => {
                try {
                    const eventPromises = tickets.map(ticket =>
                        fetch(`http://localhost:5000/events/${ticket.eventid}`)
                            .then(res => res.json())
                            .catch(err => {
                                console.error("Error fetching event:", err);
                                return null;
                            })
                    );
                    const eventData = await Promise.all(eventPromises);
                    setEvents(eventData);  
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchEvents();
        }
    }, [tickets]);  
    
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="my-events">
            {tickets.length === 0 ? (
                <p>No tickets found for this user.</p>
            ) : (
                <div className="events-list">
                    {tickets.map((ticket, index) => (
                        <div key={ticket.id} className="event-item">
                            <div className="event-content">
                                <div className="event-image-div">
                                <img 
                                    src={events[index]?.event_img || 'default-image.jpg'} 
                                    alt="Event" 
                                    className="event-image" 
                                />
                                </div>
                                <div className="event-details">
                                    {events[index] ? (
                                        <div>
                                            <p><strong>Event Name:</strong> {events[index].eventname}</p>
                                            <p><strong>Date:</strong> {events[index].eventdate}</p>
                                            <p><strong>Start Time:</strong> {events[index].eventstarttime}</p>
                                            <p><strong>Location:</strong> {events[index].eventlocation}</p>
                                            <p><strong>Event Description:</strong> {events[index].eventdescription}</p>
                                        </div>
                                    ) : (
                                        <p>Event details not available.</p>
                                    )}
                                </div>
                                <div className="ticket-info">
                                    <h3>Ticket ID: {ticket.id}</h3>
                                    <p>Description ID: {ticket.descid}</p>
                                    <p>IMMA ADD THE QR CODE OR SMTH</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents;




