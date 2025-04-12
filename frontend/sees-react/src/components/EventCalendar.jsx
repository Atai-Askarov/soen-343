import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './css/EventCalendar.css';
import '../pages/css/eventPopup.css'; // Adjust the path as necessary

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events, view, date, onViewChange, onDateChange, onEventClick }) => {
  const eventList = events.map(event => ({
    id: event.eventid,
    title: event.eventname,
    start: new Date(`${event.eventstarttime}`),
    end: new Date(`${event.eventendtime}`),
    description: event.eventdescription,
  }));

  return (
    <div className="calendar-section">
      <h2 className="section-header">Event Calendar</h2>
      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: "100%" }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={view}
        view={view}
        date={date}
        onView={onViewChange}
        onNavigate={onDateChange}
        onSelectEvent={onEventClick}
      />
    </div>
  );
};

export default EventCalendar;
