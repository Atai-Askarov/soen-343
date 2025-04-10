import React, { useState, useEffect } from "react";
import "./css/createEvent.css";
import { CreateEventCommand } from "../components/Command/CreateEventCommand";
import commandService from "../services/CommandService";
import { useNavigate } from "react-router-dom";
function generateZoomLink(meetingId = "1234567890", passcode = "abcd1234") {
  // Optional: encode passcode in base64 if needed
  return `https://zoom.us/j/${meetingId}?pwd=${passcode}`;
}

const CreateEvent = () => {
  const navigate = useNavigate();
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
    venue_id: "",
  });
  const [speakers, setSpeakers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
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

    // Fetch speakers from the backend
    const fetchSpeakers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/by_role?role=speaker");
        const data = await response.json();
        if (response.ok) {
          setSpeakers(data.users);
        } else {
          throw new Error(data.message || "Failed to fetch speakers");
        }
      } catch (error) {
        console.error("Error fetching speakers:", error);
      }
    };
    
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:5000/venues");
        const data = await res.json();
        if (res.ok) setVenues(data.venues);
        else throw new Error(data.message || "Failed to fetch venues");
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchSpeakers();
    fetchVenues();
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
    
    // Validate times
    if (formData.starttime && formData.endtime && formData.starttime > formData.endtime) {
      alert("Error: Start time cannot be later than end time.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: 'info', text: 'Submitting request...' });
    
    try {
      // Prepare event data for the command
      const eventData = {
        eventname: formData.name,
        eventdate: formData.date,
        eventstarttime: `${formData.date} ${formData.starttime}`,
        eventendtime: `${formData.date} ${formData.endtime}`,
        eventlocation: formData.location,
        eventdescription: formData.description,
        speakerid: formData.speakerid,
        organizerid: formData.organizerid,
        event_type: formData.event_type,
        social_media_link: formData.social_media_link,
        venue_id: formData.venue_id,
      };
      
      // Create the command
      const command = new CreateEventCommand(eventData);
      
      // Add to command queue
      commandService.addCommand(command);
      
      // Show success message
      setSubmitMessage({ 
        type: 'success', 
        text: 'Your event creation request has been submitted for approval. You will be notified once it is approved.' 
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          date: "",
          starttime: "",
          endtime: "",
          location: "Montreal",
          description: "",
          speakerid: "",
          event_type: "workshop",
          social_media_link: "",
          venue_id: "",
        });
        setSubmitMessage(null);
        navigate("/my-requests"); // Optional: navigate to a page showing user's requests
      }, 3000);
      
    } catch (error) {
      console.error('Error creating command:', error);
      setSubmitMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="createEvent">
      <h1>Create New Event</h1>
      {submitMessage && (
        <div className={`message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}
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
            min={new Date().toISOString().split("T")[0]} 
          />
        </label>

        <label>
          Start Time:
          <input
            type="time"
            name="starttime"
            value={formData.starttime}
            onChange={handleChange}
            step="1"
            pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
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
            min={formData.starttime}
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
            <button
              type="button"
              className={`location-btn ${formData.location === 'Online' ? 'active' : ''}`}
              onClick={() => handleLocationChange('Online')}
            >
              Online
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
          <select
            name="speakerid"
            value={formData.speakerid}
            onChange={handleChange}
            required
          >
            <option value="">Select a Speaker to Invite</option>
            {speakers.map(speaker => (
              <option key={speaker.id} value={speaker.id}>
                {speaker.username}
              </option>
            ))}
          </select>
        </label>

        <label>
          Venue:
          <select
              name="venue_id"
              value={formData.venue_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a Venue</option>
              {venues.map(venue => (
                <option key={venue.id} value={venue.id}>
                  {`${venue.name} — ${venue.address} | Capacity: ${venue.capacity} | Rate: $${venue.price_per_hour}/hr`}
                </option>
              ))}
            </select>
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

        <button 
          className="create-button" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
