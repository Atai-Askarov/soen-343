import React from 'react';
import './css/createEvent.css';
import { useState } from 'react';

const CreateEvent = () => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [eventType, setEventType] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [speaker, setSpeaker] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Event created!');
    }
    
    return (
        <body>
        <div className="createEvent">
        <h1>Create New Event</h1>
        <form onSubmit={handleSubmit}>
            <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
            Start Date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
            End Date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <label>
            Start Time:
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <label>
            End Time:
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </label>
            <label>
            Location:
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>
            <label>
                Who's organizing this event?
                <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
            </label>
            <label>
                Speaker Name
                <input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)} />
            </label>
            <label>
                Event Type:
                <br></br>
                <br></br>
                    <select name="event-type" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                        <option value="workshop">workshop</option>
                        <option value="webinar">webinar</option>
                        <option value="conference">conference</option>
                        <option value="seminar">seminar</option>
                        </select>
                </label>
            <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <button type="submit">Create Event</button>
        </form>
        </div>
        </body>
    );

}

export default CreateEvent;