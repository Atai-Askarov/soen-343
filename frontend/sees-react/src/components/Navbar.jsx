import React, { useEffect, useState } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user data
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    setUser(null); // Reset state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">Logo</div>
        <div className="search-bar">
          <input type="text" placeholder="Find Events" />
        </div>
      </div>
      <div className="navbar-right">
        <ul>
          {user ? (
            // If the user is logged in, show these options
            <>
              <li className="nav-button">
                <Link to="/home">Home</Link>
              </li>
              <li className="nav-button">
                <Link to="/my-events">My Events</Link>
              </li>
              <li className="nav-button">
                <Link to="/networking">Networking</Link>
              </li>
              <li className="nav-button" onClick={handleLogout}>
                <button className="logout-button">Logout</button>
              </li>
            </>
          ) : (
            // If the user is not logged in, show these options
            <>
              <li className="nav-button">
                <Link to="/">Pricing</Link>
              </li>
              <li className="nav-button">
                <Link to="createEvent">Plan Event</Link>
              </li>
              <li className="nav-button">
                <Link to="login">Login</Link>
              </li>
              <li className="nav-button sign-up">
                <Link to="signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

