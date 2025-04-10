import React, { useEffect, useState } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]); // To store notifications
  const [showNotifications, setShowNotifications] = useState(false); // To toggle notifications visibility
  const navigate = useNavigate();

  const updateUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };
  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  // Fetch notifications when user data changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    if (user) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/notifications/${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === "success") {
          setNotifications(data.notifications);
        } else {
          console.error("Error fetching notifications:", data.message);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    setUser(null); // Reset state
    navigate("/login"); // Redirect to login page
  };

  const renderUserLinks = () => {
    if (user && user.user_type) {
      switch (user.user_type) {
        case "learner":
          return (
            <>
              <li className="nav-button">
                <Link to="/home">Home</Link>
              </li>
              <li className="nav-button">
                <Link to="/myevents/">My Events</Link>
              </li>
            </>
          );
        case "sponsor":
          return (
            <>

              <li className="nav-button">
                <Link to="/myevents">Sponsored Events</Link>
              </li>
            </>
          );
        case "organizer":
          return (
            <>
              <li className="nav-button">
                <Link to="/createEvent"> Create Event</Link>
              </li>
              <li className="nav-button">
                <Link to="/Dashboard">My Events</Link>
              </li>
            </>
          );
        case "speaker":
          return (
            <>
               <li className="nav-button">
                <Link to="/home">Home</Link>
              </li>

              <li className="nav-button">
                <Link to="/my-events">My Events</Link>
              </li>
            </>
          );
        case "executive":
          return(<>
            <li className="nav-button">
             <Link to="/home">Home</Link>
           </li>
           <li className="nav-button">
             <Link to="/manage-requests">Manage Requests</Link>
           </li>

           <li className="nav-button">
             <Link to="/manage-events">Manage Events</Link>
           </li>
         </>

          )
        case "admin":
          return (
            <>

              <li className="nav-button">
                <Link to="/admin-dashboard">Admin Dashboard</Link>
              </li>
              <li className="nav-button">
                <Link to="/admin-users">Manage Users</Link>
              </li>
            </>
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div style={{ display: "flex", alignItems: "row" }}>
          <div className="navbar-logo">
        <div className="logo">
          <Link to="/home">
            <img className="polar-bear-image" id="PolarImage" src="https://cdn-icons-png.flaticon.com/512/2938/2938245.png" alt="placeholder" />
          </Link>
        </div>
          <Link to="/home">
            <div className="pookie-bears">POOKIE <br></br> BEARS</div>
          </Link>
          </div>
        </div>
      </div>
      <div className="navbar-right">
        <ul>
          {user ? (
            // If the user is logged in, show these options
            <>
              {renderUserLinks()}

              {/* Notification Bell Icon */}
              <li className="notification-button">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <i className="fas fa-bell" style={{ fontSize: "20px", color: "white" }}></i>
                </button>
              </li>

              {/* Logout Button */}
              <li
                className="logout-button"
                style={{ alignItems: "center", color: "white" }}
                onClick={handleLogout}
              >
                LOGOUT
              </li>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="notification-dropdown">
                  <h3>Notifications</h3>
                  {notifications.length > 0 ? (
                    <ul>
                      {notifications.map((notification) => (
                        <li key={notification.id}>
                          <p>{notification.message}</p>
                          {notification.link && (
                            <a href={notification.link} target="_blank" rel="noopener noreferrer">
                              Join Groupchat Now!
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No notifications</p>
                  )}
                </div>
              )}
            </>
          ) : (
            // If the user is not logged in, show these options
            <>
              <li className="nav-button">
                <Link to="login">LOGIN</Link>
              </li>
              <li className="nav-button ">
                <Link to="signup">SIGN UP</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;




