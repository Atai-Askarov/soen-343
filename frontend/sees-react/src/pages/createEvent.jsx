import React, { useState } from "react";
import "./css/createEvent.css";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "Montreal", 
    description: "",
    speaker: "",
    stakeholder: "",
    organizer: "",
    event_type: "workshop" 
  });

  const eventTypes = ["workshop", "webinar", "conference", "seminar"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventname: formData.name,
          eventdate: formData.date,
          eventlocation: formData.location,
          eventdescription: formData.description,
          speaker: formData.speaker,
          stakeholder: formData.stakeholder,
          organizer: formData.organizer,
          event_type: formData.event_type
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Event created successfully! ID: ${data.eventid}`);
        // Reset form
        setFormData({
          name: "",
          date: "",
          location: "Montreal",
          description: "",
          speaker: "",
          stakeholder: "",
          organizer: "",
          event_type: "workshop"
        });
      } else {
        throw new Error(data.message || 'Failed to create event');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="createEvent">
      <h1>Create New Event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        
        <div className="form-group">
          <label>Location:</label>
          <div className="location-buttons">
            <button
              type="button"
              className={`location-btn ${formData.location === 'Montreal' ? 'active' : ''}`}
              onClick={() => handleLocationChange('Montreal')}
            >
              Montreal
            </button>
            <button
              type="button"
              className={`location-btn ${formData.location === 'Laval' ? 'active' : ''}`}
              onClick={() => handleLocationChange('Laval')}
            >
              Laval
            </button>
          </div>
        </div>
        
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Speaker:
          <input
            type="text"
            name="speaker"
            value={formData.speaker}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Stakeholder:
          <input
            type="text"
            name="stakeholder"
            value={formData.stakeholder}
            onChange={handleChange}
          />
        </label>
        
        <label>
          Organizer:
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Event Type:
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
          >
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>
        
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;