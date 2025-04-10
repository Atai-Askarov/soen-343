import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/myevents.css'; // Adjust the path as necessary
import QRCode from './QRCode';

const MyEvents = () => {
    const navigate = useNavigate(); // Add navigation hook
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
    
    // Updated navigation function for event attendees
    const navigateToEventDetails = (event, e) => {
        // Prevent navigation if clicking on ticket info
        if (e.target.closest('.ticket-info')) {
            return;
        }
        
        if (event && event.eventid) {
            navigate(`/event-attendee/${event.eventid}`);
        }
    };
    
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
                        <div 
                            key={ticket.id} 
                            className="event-item"
                            onClick={(e) => navigateToEventDetails(events[index], e)}
                            style={{ cursor: 'pointer' }}
                        >
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
                                <div className="ticket-info" onClick={(e) => e.stopPropagation()}>
                                    <h3>Ticket ID: {ticket.id}</h3>
                                    <p>Description ID: {ticket.descid}</p>
                                    {console.log(ticket)}
                                    <QRCode
                                        endpoint="http://localhost:5000/attendance/checkin" 
                                        params={{ ticket_id: ticket.id, event_id: ticket.eventid }} 
                                        
                                    />
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




