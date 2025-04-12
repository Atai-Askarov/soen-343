import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTag, 
  FaChartPie,
  FaChartBar,
  FaMoneyBillWave,
  FaTicketAlt,
  FaReceipt,
  FaDownload,
  FaDollarSign
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
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import '../css/manageFinancials.css';

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

const ManageFinancials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [event] = useState(location.state?.eventData);
  
  // If no event data was passed, redirect back to manage events page
  useEffect(() => {
    if (!event) {
      console.error("No event data provided to EventFinancials");
      navigate('/manage-events');
    }
  }, [event, navigate]);
  
  if (!event) {
    return (
      <div className="financials-dashboard">
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
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Revenue breakdown data
  const revenueData = {
    labels: ['Standard Tickets', 'Premium Tickets', 'VIP Tickets', 'Sponsors', 'Merchandise'],
    datasets: [
      {
        data: [5000, 7500, 10000, 15000, 2500],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Expenses breakdown data
  const expensesData = {
    labels: ['Venue', 'Staff', 'Marketing', 'Equipment', 'Food & Beverages', 'Miscellaneous'],
    datasets: [
      {
        data: [12000, 8000, 5000, 3000, 7000, 2000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Ticket sales by category
  const ticketSalesData = {
    labels: ['Standard', 'Premium', 'VIP'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [100, 50, 25],
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate total revenue, expenses and profit
  const totalRevenue = 40000;  // Sum of all revenue sources
  const totalExpenses = 37000;  // Sum of all expenses
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = (netProfit / totalRevenue) * 100;
  
  return (
    <div className="financials-dashboard">
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
            <FaDownload /> Export Financial Report
          </button>
        </div>
      </div>
      
      <div className="dashboard-title">
        <h2>Financial Overview</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <div className="stat-value">{formatCurrency(totalRevenue)}</div>
            <div className="stat-label">gross income</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon expenses">
            <FaReceipt />
          </div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <div className="stat-value">{formatCurrency(totalExpenses)}</div>
            <div className="stat-label">operating costs</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className={`stat-icon ${netProfit >= 0 ? 'profit' : 'loss'}`}>
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>Net Profit</h3>
            <div className={`stat-value ${netProfit >= 0 ? 'profit-text' : 'loss-text'}`}>
              {formatCurrency(netProfit)}
            </div>
            <div className="stat-label">{profitMargin.toFixed(1)}% margin</div>
          </div>
        </div>
      </div>
      
      <div className="analytics-section">
        <div className="analytics-row">
          <div className="analytics-card pie-chart">
            <div className="card-header">
              <h2><FaChartPie className="header-icon" /> Revenue Breakdown</h2>
            </div>
            <div className="chart-container">
              <Doughnut 
                data={revenueData} 
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
          
          <div className="analytics-card pie-chart">
            <div className="card-header">
              <h2><FaChartPie className="header-icon" /> Expenses Breakdown</h2>
            </div>
            <div className="chart-container">
              <Pie 
                data={expensesData}
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
        </div>
        
        <div className="analytics-card">
          <div className="card-header">
            <h2><FaTicketAlt className="header-icon" /> Ticket Sales by Category</h2>
          </div>
          <div className="chart-container">
            <Bar 
              data={ticketSalesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Tickets'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Ticket Type'
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

export default ManageFinancials;