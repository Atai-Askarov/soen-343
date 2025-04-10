import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTag, 
  FaChartPie,
  FaChartBar,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaDownload
} from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import '../css/manageAttendees.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ManageAttendees = () => {
  const { id } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (location.state?.eventData) {
      setEvent(location.state.eventData);
      setLoading(false);
      return;
    }
    
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, location.state]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Chart data
  const attendanceData = {
    labels: ['Registered', 'Attended', 'No-shows'],
    datasets: [
      {
        data: [150, 120, 30],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const demographicsData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
    datasets: [
      {
        label: 'Age Demographics',
        data: [25, 45, 30, 15, 5],
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const registrationTimeData = {
    labels: ['2+ Weeks Before', '1-2 Weeks Before', 'Days Before', 'Day Of'],
    datasets: [
      {
        label: 'Registration Timing',
        data: [40, 35, 20, 5],
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  if (loading) {
    return (
      <div className="attendees-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="attendees-dashboard">
        <div className="error-container">
          <h2>Error Loading Event</h2>
          <p>{error || 'Event not found'}</p>
          <Link to="/manage-events" className="btn-back">
            <FaArrowLeft /> Back to Events
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="attendees-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <Link to="/manage-events" className="btn-back">
            <FaArrowLeft /> Back to Events
          </Link>
          <h1>{event.eventname}</h1>
          <div className="event-meta">
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>{formatDate(event.eventdate)}</span>
            </div>
            
            <div className="meta-item">
              <FaMapMarkerAlt className="meta-icon" />
              <span>{event.eventlocation || 'Location not specified'}</span>
            </div>
            
            <div className="meta-item">
              <FaTag className="meta-icon" />
              <span>{event.event_type || 'Type not specified'}</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className={`status-badge ${new Date(event.eventdate) > new Date() ? 'upcoming' : 'past'}`}>
            {new Date(event.eventdate) > new Date() ? 'Upcoming' : 'Past'}
          </div>
          <button className="export-btn">
            <FaDownload /> Export Data
          </button>
        </div>
      </div>
      
      <div className="dashboard-title">
        <h2>Attendee Analytics</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Registered</h3>
            <div className="stat-value">150</div>
            <div className="stat-label">attendees</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon attendance">
            <FaUserCheck />
          </div>
          <div className="stat-content">
            <h3>Attendance Rate</h3>
            <div className="stat-value">80%</div>
            <div className="stat-label">attended</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon timing">
            <FaUserClock />
          </div>
          <div className="stat-content">
            <h3>Avg. Registration</h3>
            <div className="stat-value">10</div>
            <div className="stat-label">days before event</div>
          </div>
        </div>
      </div>
      
      <div className="analytics-section">
        <div className="analytics-row">
          <div className="analytics-card pie-chart">
            <div className="card-header">
              <h2><FaChartPie className="header-icon" /> Attendance Overview</h2>
            </div>
            <div className="chart-container">
              <Pie 
                data={attendanceData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 15,
                        padding: 15
                      }
                    },
                    title: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="card-header">
              <h2><FaChartBar className="header-icon" /> Age Demographics</h2>
            </div>
            <div className="chart-container">
              <Bar 
                data={demographicsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        maxTicksLimit: 5
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="analytics-card timeline-chart">
          <div className="card-header">
            <h2><FaChartBar className="header-icon" /> Registration Timeline</h2>
          </div>
          <div className="chart-container">
            <Bar 
              data={registrationTimeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      maxTicksLimit: 5
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  title: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAttendees;