import React, { useEffect, useState } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const updateUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial check on mount
    updateUser();

    // Listen for the custom userLogin event
    window.addEventListener("userLogin", updateUser);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("userLogin", updateUser);
    };
  }, []);

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
              <li className="nav-button">
                <Link to="/networking">Networking</Link>
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
             <Link to="/manage-users">Manage Users</Link>
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
              <li className="logout-button" style={{alignItems:"center", color: "white"}} onClick={handleLogout}>
                LOGOUT
              </li>
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


