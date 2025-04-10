import React, { useEffect, useState } from "react";
import { Link,  } from "react-router-dom";
import "./css/home.css"; 
import "./css/eventPopup.css"; 


const Home = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/events");
        const data = await response.json();
        if (data.events) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const scrollEvents = (direction) => {
    const eventRow = document.getElementById("eventRow");
    const scrollAmount = 350; // Adjust based on event size
  
    if (direction === "left") {
      eventRow.scrollLeft -= scrollAmount;
    } else {
      eventRow.scrollLeft += scrollAmount;
    }
  };
  

  return (
    <div>
      <div className="scrollImage">
        <img className="image" src="https://puzzlemania-154aa.kxcdn.com/products/2024/puzzle-enjoy-1000-pieces-montreal-skyline-by-night-canada.webp" alt="placeholder" />
      </div>
      <div className="home-image-text">
      <p className="home-image-text-subtitle">Welcome to SEES</p>
        <p className="home-image-text-subtitle">Your Event Management Platform </p>
      </div>
      <div className="content">
        {user ? (
          <div>
            <h1>Welcome back, {user.username}!</h1>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="event-slider">
              <button className="scroll-button left" onClick={() => scrollEvents("left")}>
                &#10094;
              </button>
          <div className="event-row" id="eventRow">
            {events.length > 0 ? (
              events.map((event) => (
                
                <div
                  key={event.id}
                  className="event-container"
                  style={{ backgroundImage: `url(${event.event_img || '/images/default.jpg'})` }}
                >
                  <Link to={`/eventpage/${event.eventid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <p className="event-name" style={{fontSize:"24px", fontWeight: "bold", fontFamily:"Roboto, sans-serif"}}>{event.eventname}</p>

                    <p className="event-type" style={{fontSize:"20px", fontWeight: "bold", fontFamily:"Roboto, sans-serif"}}>
                    <i class="fas fa-solid fa-globe"></i> {event.event_type}
                  </p>
                    <p className="event-date" style={{fontSize:"20px", fontWeight: "bold", fontFamily:"Roboto, sans-serif"}}>
                      <i className="fas fa-calendar-alt"></i>  {event.eventdate}
                    </p>
                    <p className="event-location" style={{fontSize:"20px", fontWeight: "bold", fontFamily:"Roboto, sans-serif"}}>
                      <i className="fas fa-map-marker-alt"></i>  {event.eventlocation}
                  </p>
                    <p className="event-description" style={{fontWeight: "bold", fontFamily:"Roboto, sans-serif"}}>
                      <div style={{fontSize:"20px"}}>Description</div>
                      <div style={{marginLeft:"20px", paddingRight:"30px"}}>{event.eventdescription}</div>
                      </p>
                      <p className="event-speaker" style={{fontSize:"20px", fontWeight: "bold", fontFamily:"Roboto, sans-serif"}}>
                      <i class="fas fa-solid fa-microphone"></i> {event.speakerid ? `With Special Guest ${event.speakerid}` : "TBA"}</p>

                    </Link>
                </div>

              ))
            ) : (
              <p>No events available at the moment.</p>
            )}
          </div>
          <button className="scroll-button right" onClick={() => scrollEvents("right")}>
            &#10095;
          </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;



