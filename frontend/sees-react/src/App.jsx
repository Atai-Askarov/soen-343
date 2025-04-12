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
import ShareResourcePage from "./pages/ShareResources";
import Budget from "./pages/budget";
import MyEventsLearner from "./pages/myEventsLearner";
import ManageEvents from "./pages/ManageEvents"
import EventDetail from './pages/EventDetails';
import ReviewEvent from "./pages/ReviewEvent";
import EventPageAttendee from './pages/EventPageAttendee'
import SponsorView from "./pages/SponsorView";
import SponsorPackages from "./pages/SponsorPackages";
import SponsorAnalytics from "./pages/SponsorAnalytics";
import SponsorDashboard from "./pages/SponsorDashboard";
import MySponsorships from "./pages/MySponsorships";
import ManageQA from "./pages/ManageQA"
import Networking from "./pages/networking";
import GroupchatPage from "./pages/groupchat";


import ConfirmationPage from "./pages/QRConfirmationPage";
import ManageAttendees from "./pages/ManagementEvents/ManageAttendees";
import ManageAnalytics from "./pages/ManagementEvents/ManageAnalytics";
import ManageFinancials from "./pages/ManagementEvents/ManageFinancials";
import ManageRequests from "./pages/ManagementEvents/ManageRequests"
import OrgPackageCreation from "./pages/OrgPackageCreation";
import ManageUsers from "./pages/ManagementEvents/ManageUsers";

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
              <Route path="/share-resources/:eventId" element={<ShareResourcePage />} />
              <Route path="/budget/:eventId" element={<Budget />} />
              

              <Route path="/sponsor-view" element={<SponsorView />} />
              <Route path="/sponsor/:eventId" element={<SponsorPackages />} />
              <Route path="/sponsor/analytics" element={<SponsorAnalytics />} />
              <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
              <Route path="/sponsor/mysponsorships" element={<MySponsorships />} />
              <Route path="/sponsorships/:eventId" element={<OrgPackageCreation />} />
              <Route path="/event-details/:id" element={<EventDetail />} />
              <Route path="/review-event/:commandId" element={<ReviewEvent />} />
              <Route path="/myevents" element={<MyEventsLearner />} />
              <Route path="/event-attendee/:id" element={<EventPageAttendee />} />
              
              //Routes just for management
              <Route path="/manage-qa/:eventId" element={<ManageQA />} />
              <Route  path="/events/:eventId/attendees" element={<ManageAttendees />} />
              <Route path="/events/:eventId/analytics" element={<ManageAnalytics />} />
              <Route path="/events/:eventId/financials" element={<ManageFinancials/>} />
              <Route path ="/manage-events" element = {<ManageEvents/>}/>
              <Route path ="/manage-requests" element = {<ManageRequests/>}/>
              <Route path ="/manage-users" element = {<ManageUsers/>}/>

              {/* 
            <Route path="/events/:eventId/financials" element={<Budget />} />
            <Route path="/events/:eventId/promotions" element={<Promotion />} />
            <Route path="/events/:eventId/resources" element={<Resources />} />
            <Route path="/events/:eventId/networking" element={<Networking />} /> */}

              <Route path="/events/:eventId/networking" element={<Networking />} />
              <Route path="/groupchat/:groupchatTitle" element={<GroupchatPage />} />

              <Route path="/myevents/attendance-confirmation-page/:ticketId" element={<ConfirmationPage/>} />
              <Route path="/eventDasboard/:eventId/attendance-confirmation-page" element={<ConfirmationPage/>} />
            </Routes>

          
            
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};
export default App;
