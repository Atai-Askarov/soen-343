import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTag, 
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaShare,
  FaUserFriends,
  FaDownload,
  FaEye
} from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import '../css/manageAnalytics.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ManageAnalytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [event] = useState(location.state?.eventData);
  
  // If no event data was passed, redirect back to manage events page
  useEffect(() => {
    if (!event) {
      console.error("No event data provided to ManageAnalytics");
      navigate('/manage-events');
    }
  }, [event, navigate]);
  
  if (!event) {
    return (
      <div className="analytics-dashboard">
        <div className="error-container">
          <h2>Missing Event Data</h2>
          <p>No event data was provided. Redirecting to events page...</p>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Chart data for engagement metrics
  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Page Views',
        data: [150, 160, 170, 240, 260, 310, 280],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Ticket Clicks',
        data: [50, 55, 60, 85, 90, 110, 95],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
        tension: 0.3,
      }
    ],
  };
  
  // Chart data for traffic sources
  const trafficSourceData = {
    labels: ['Direct', 'Social Media', 'Email', 'Search', 'Referral'],
    datasets: [
      {
        data: [35, 30, 15, 12, 8],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for conversion rate
  const conversionRateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: [2.4, 2.8, 3.2, 3.8, 4.5, 5.1],
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      },
    ],
  };
  
  return (
    <div className="analytics-dashboard">
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
            <FaDownload /> Export Report
          </button>
        </div>
      </div>
      
      <div className="dashboard-title">
        <h2>Event Performance Analytics</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaEye />
          </div>
          <div className="stat-content">
            <h3>Total Page Views</h3>
            <div className="stat-value">1,570</div>
            <div className="stat-label">+12% from last week</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon share">
            <FaShare />
          </div>
          <div className="stat-content">
            <h3>Social Shares</h3>
            <div className="stat-value">284</div>
            <div className="stat-label">across platforms</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUserFriends />
          </div>
          <div className="stat-content">
            <h3>Conversion Rate</h3>
            <div className="stat-value">5.1%</div>
            <div className="stat-label">visits to registrations</div>
          </div>
        </div>
      </div>
      
      <div className="analytics-section">
        <div className="analytics-row">
          <div className="analytics-card wide">
            <div className="card-header">
              <h2><FaChartLine className="header-icon" /> Engagement Metrics Over Time</h2>
            </div>
            <div className="chart-container">
              <Line 
                data={engagementData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        maxTicksLimit: 6
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
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
        
        <div className="analytics-row">
          <div className="analytics-card pie-chart">
            <div className="card-header">
              <h2><FaChartPie className="header-icon" /> Traffic Sources</h2>
            </div>
            <div className="chart-container">
              <Pie 
                data={trafficSourceData} 
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
              <h2><FaChartBar className="header-icon" /> Conversion Rate Trend</h2>
            </div>
            <div className="chart-container">
              <Bar 
                data={conversionRateData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        },
                        maxTicksLimit: 6
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
    </div>
  );
};

export default ManageAnalytics;