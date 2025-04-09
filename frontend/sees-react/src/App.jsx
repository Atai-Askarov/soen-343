import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import CreateEvent from "./pages/createEvent";
import Dashboard from "./pages/orgDashboard";
import Event from "./pages/eventPage";
import LandingPage from "./pages/LandingPage";
import EventDashboard from "./pages/eventDashboard";
import TicketsPage from "./pages/ticketsPage";
import Budget from "./pages/budget";
import ManageEvents from "./pages/ManageEvents"
import EventDetail from './pages/EventDetails';

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="page-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/createEvent" element={<CreateEvent />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/eventpage/:eventId" element={<Event />} />
              <Route path="/home" element={<Home />} />
              <Route path="/eventDashboard/:eventId" element={<EventDashboard />} />
              <Route path="/manage-ticketing/:eventId" element={<TicketsPage />} />
              <Route path="/promotion/:eventId" element={<TicketsPage />} />
              <Route path="/budget/:eventId" element={<Budget />} />
              <Route path ="/manage-events" element = {<ManageEvents/>}/>
              <Route path="/event-details/:id" element={<EventDetail />} />

            </Routes>

          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
