import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import CreateEvent from "./pages/createEvent";
import Dashboard from "./pages/orgDashboard";
import Event from "./pages/eventPage";
import Success from "./pages/Success";
import Canceled from "./pages/Canceled";
import LandingPage from "./pages/LandingPage";
import EventDashboard from "./pages/eventDashboard";
import TicketsPage from "./pages/ticketsPage";
import Budget from "./pages/budget";
import MyEventsLearner from "./pages/myEventsLearner";
import ManageEvents from "./pages/ManageEvents"
import EventDetail from './pages/EventDetails';
import ReviewEvent from "./pages/ReviewEvent";
import EventPageAttendee from './pages/EventPageAttendee'
// import './css/global.css';
import SponsorView from "./pages/SponsorView";
import SponsorPackages from "./pages/SponsorPackages";
import ManageQA from "./pages/ManageQA"
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="page-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/success" element={<Success />} />
              <Route path="/canceled" element={<Canceled />} />
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
              <Route path="/sponsor-view" element={<SponsorView />} />
              <Route path="/sponsor/:eventId" element={<SponsorPackages />} />
              <Route path="/event-details/:id" element={<EventDetail />} />
              <Route path="/review-event/:commandId" element={<ReviewEvent />} />

              <Route path="/myevents" element={<MyEventsLearner />} />
              <Route path="/event-attendee/:id" element={<EventPageAttendee />} />
              <Route path="/manage-qa/:eventId" element={<ManageQA />} />
            </Routes>

          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};
export default App;
