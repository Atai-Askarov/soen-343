import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/myevents.css'; // Adjust the path as necessary
import { Views } from 'react-big-calendar';
import EventCalendar from "../components/EventCalendar.jsx"; // Import the EventCalendar component
const MyEvents = () => {
    const navigate = useNavigate(); // Add navigation hook
    const [tickets, setTickets] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const popupRef = useRef(null);
    const [view, setView] = useState(Views.WEEK);
    const [date, setDate] = useState(new Date());
    
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

    // Event click handler to set popup position and show event details
    const handleEventClick = (event, e) => {
        const { clientX, clientY } = e;
        setPopupPosition({ x: clientX, y: clientY });
        setSelectedEvent(event);
    };

    const handleOutsideClick = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            setSelectedEvent(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const navigateToEventDetails = (event, e) => {
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
                                    <p>IMMA ADD THE QR CODE OR SMTH</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reusable calendar component */}
            <EventCalendar
                events={events}
                view={view}
                date={date}
                onViewChange={setView}
                onDateChange={(newDate) => setDate(new Date(newDate))}
                onEventClick={handleEventClick}
            />

            {/* Event Popup */}
            {selectedEvent && (
                <div
                    ref={popupRef}
                    className="event-popup"
                    style={{
                        position: "absolute",
                        top: popupPosition.y + window.scrollY,
                        left: popupPosition.x + window.scrollX,
                        backgroundColor: "white",
                        padding: "10px",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        maxWidth: "300px",
                        fontSize: 14,
                    }}
                >
                    <h3>Event Details</h3>
                    <p><strong>Name:</strong> {selectedEvent.title}</p>
                    <p><strong>Description:</strong> {selectedEvent.description}</p>
                </div>
            )}
        </div>
    );
};

export default MyEvents;





