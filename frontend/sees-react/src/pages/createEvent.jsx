import React, { useState, useEffect } from "react";
import "./css/createEvent.css";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    starttime: "",
    endtime: "",
    location: "Montreal",
    description: "",
    speakerid: "",
    event_type: "workshop",
    social_media_link: "",
  });

  const eventTypes = ["workshop", "webinar", "conference", "seminar"];

  // Get the current user (organizer) from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData(prevState => ({
        ...prevState,
        organizerid: user.id, // Automatically set the organizer ID
      }));
    }
  }, []);

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
          eventstarttime: `${formData.date} ${formData.starttime}`,
          eventendtime: `${formData.date} ${formData.endtime}`,
          eventlocation: formData.location,
          eventdescription: formData.description,
          speakerid: formData.speakerid,
          organizerid: formData.organizerid,
          event_type: formData.event_type,
          social_media_link: formData.social_media_link
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Event created successfully! ID: ${data.eventid}`);
        // Reset form
        setFormData({
          name: "",
          date: "",
          starttime: "",
          endtime: "",
          location: "Montreal",
          description: "",
          speakerid: "",
          event_type: "workshop",
          social_media_link: ""
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

        <label>
  Start Time:
  <input
    type="time"
    name="starttime"
    value={formData.starttime}
    onChange={handleChange}
    step="1" // Allows seconds
    pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" // Ensures HH:MM:SS format
  />
</label>

<label>
  End Time:
  <input
    type="time"
    name="endtime"
    value={formData.endtime}
    onChange={handleChange}
    step="1"
    pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
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
          Speaker ID:
          <input
            type="number"
            name="speakerid"
            value={formData.speakerid}
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
        <label>
          Social Media Link
          <input
            type="text"
            name="social_media_link"
            value={formData.social_media_link}
            onChange={handleChange}
          />
        </label>
        <button className='create-button' type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
