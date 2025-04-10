import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NetworkingFacade from "./NetworkingFacade";  // Import the Facade
import "./css/networking.css"; // Import your CSS file for styling

const Networking = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);  
  const [users, setUsers] = useState({});  
  const [speakers, setSpeakers] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [selectedInterests, setSelectedInterests] = useState({
    reading: false,
    coding: false,
    music: false,
    gaming: false,
    sports: false
  });

  const [groupchatTitle, setGroupchatTitle] = useState("");
  const [selectedModerator, setSelectedModerator] = useState("");
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const facade = new NetworkingFacade(eventId);

    const fetchData = async () => {
      try {
        const eventData = await facade.fetchEventDetails();
        setEvent(eventData);

        const { tickets: ticketData, userIds } = await facade.fetchTickets();
        setTickets(ticketData);

        const userDetails = await facade.fetchUserDetails(userIds);
        setUsers(userDetails);

        const speakerData = await facade.fetchSpeakers();
        setSpeakers(speakerData);

        setLoading(false);  // Set loading to false once all data is fetched
      } catch (error) {
        setError(error.message);  // Set error state if something goes wrong
        setLoading(false);  
      }
    };

    fetchData();
  }, [eventId]);

  const handleInterestChange = (interest) => {
    setSelectedInterests(prevState => ({
      ...prevState,
      [interest]: !prevState[interest]
    }));
  };

  const filteredUsers = Object.values(users).filter(user => {
    if (Object.values(selectedInterests).every(val => !val)) {
      return true;
    }
    return Object.keys(selectedInterests).some(interest => selectedInterests[interest] && user.interests.includes(interest));
  });

  // Handle groupchat form submission and posting notifications
  const handleGroupchatSubmit = async (e) => {
    e.preventDefault();

    // Prepare the groupchat data
    const groupchatData = {
      title: groupchatTitle,
      moderator: selectedModerator,
      attendees,
    };

    // Create a notification message
    const notificationMessage = `Based on your events and interests, we would love to invite you to join "${groupchatTitle}", a private groupchat for this event.`;

    // Optional: If you want to include a link in the notification
    const notificationLink = `http://localhost:3000/groupchat/${groupchatTitle}?eventId=${eventId}`;

    try {
      // Send notifications to users who match the selected interests
      const notificationPromises = [
        // Notify the filtered users
        ...filteredUsers.map(user =>
          fetch("http://127.0.0.1:5000/create_notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.id,
              message: notificationMessage,
              link: notificationLink,
            }),
          })
        ),
        // Notify the selected moderator
        fetch("http://127.0.0.1:5000/create_notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: selectedModerator,
            message: notificationMessage,
            link: notificationLink,
          }),
        }),
      ];

      // Wait for all notification requests to finish
      await Promise.all(notificationPromises);

      console.log("Notifications sent successfully!");
      window.alert("Invites sent successfully!");
  
      setGroupchatTitle("");
      setSelectedModerator("");
      setAttendees([]);
      setSelectedInterests({
        reading: false,
        coding: false,
        music: false,
        gaming: false,
        sports: false
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      setError("Error creating notifications.");
    }
  };

  const handleModeratorChange = (e) => {
    setSelectedModerator(e.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="networking-form-container">
    <div className="networking-container">
      <h1 className="event-title">Networking for Event: {event?.name}</h1>
      <p className="event-description">Welcome to the networking section for the event!</p>

      {/* Groupchat Form */}
      <h2 className="groupchat-title">Create A Private Groupchat for This Event</h2>
      <form className="groupchat-form" onSubmit={handleGroupchatSubmit}>
        <div className="form-group">
          <label className="label">
            Groupchat Title/Prompt:
            <input 
              className="input-text" 
              type="text" 
              value={groupchatTitle}
              onChange={(e) => setGroupchatTitle(e.target.value)} 
              placeholder="Enter groupchat title" 
              required
            />
          </label>
        </div>
        <div className="form-group interest-buttons">
          <h3 className="interest-title">Choose Attendees with Specific Interests</h3>
          <div className="interest-button-group">
            <button
              type="button"
              className={`interest-button ${selectedInterests.reading ? "selected" : ""}`}
              onClick={() => handleInterestChange("reading")}
              style={{borderRadius: "30px", width:" 200px", height: "45px",margin:"5px"}}
            >
              <i className="fas fa-book"></i> Reading
            </button>
            <button
              type="button"
              className={`interest-button ${selectedInterests.coding ? "selected" : ""}`}
              onClick={() => handleInterestChange("coding")}
              style={{borderRadius: "30px", width:" 200px", height: "45px",margin:"5px"}}
            >
              <i className="fas fa-code"></i> Coding
            </button>
            <button
              type="button"
              className={`interest-button ${selectedInterests.music ? "selected" : ""}`}
              onClick={() => handleInterestChange("music")}
              style={{borderRadius: "30px", width:" 200px", height: "45px",margin:"5px"}}
            >
              <i className="fas fa-music"></i> Music
            </button>
            <button
              type="button"
              className={`interest-button ${selectedInterests.gaming ? "selected" : ""}`}
              onClick={() => handleInterestChange("gaming")}
              style={{borderRadius: "30px", width:" 200px", height: "45px",margin:"5px"}}
            >
              <i className="fas fa-gamepad"></i> Gaming
            </button>
            <button
              type="button"
              className={`interest-button ${selectedInterests.sports ? "selected" : ""}`}
              onClick={() => handleInterestChange("sports")}
              style={{borderRadius: "30px", width:" 200px", height: "45px"}}
            >
              <i className="fas fa-futbol"></i> Sports
            </button>
          </div>
        </div>


        <div className="form-group">
          <h3 className="moderator-title">Choose a Moderator</h3>
          <select 
            className="select-moderator" 
            value={selectedModerator} 
            onChange={handleModeratorChange} 
            required
          >
            <option value="">Select a Moderator</option>
            {speakers.length > 0 ? (
              speakers.map(speaker => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.username}
                </option>
              ))
            ) : (
              <option disabled>No speakers available</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <button className="submit-button" type="submit">Create Groupchat</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Networking;







