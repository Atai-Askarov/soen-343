//? Nice charts :D!!
import TicketSalesChart from '../components/Analytics/TicketSalesChart';
import TicketTypeChart from '../components/Analytics/TicketTypeChart';
import EventViewsChart from '../components/Analytics/EventViewsChart';
import AttendeeNumbersChart from '../components/Analytics/AttendeeNumbersChart';
import ProfitChart from '../components/Analytics/ProfitChart';
import SocialMediaChart from '../components/Analytics/SocialMediaChart';
import FeedbackChart from '../components/Analytics/FeedbackChart';
import RevenueSourcesChart from '../components/Analytics/RevenueSourcesChart';


/**
 * Service for fetching and processing event analytics data
 */
const eventAnalyticsService = {
    /**
     * Fetch all analytics data for an event
     * @param {number} eventId - The event ID
     * @returns {Promise<Object>} - Object containing all analytics data
     */
    async getEventAnalytics(eventId) {
        try {
            // Fetch event details, ticket descriptions, and ticket sales in parallel
            const [eventData, ticketDescriptions, ticketSales] = await Promise.all([
                this.fetchEventDetails(eventId),
                this.fetchTicketDescriptions(eventId),
                this.fetchTicketSales(eventId)
            ]);
    
        
          let attendanceData = null;
          try {
            attendanceData = await this.fetchAttendanceData(eventId);
          } catch (error) {
            console.log("Could not fetch attendance data:", error.message);
          }
          
          return {
              event: eventData,
              ticketSales: {
                title: "Ticket Sales",
                content: <TicketSalesChart data={this.processTicketSalesData(ticketSales, ticketDescriptions).chartData} />
              },
              attendeeNumbers: {
                  title: "Attendee Numbers",
                  content: <AttendeeNumbersChart data={this.processAttendeeData(ticketSales, attendanceData).chartData} />
                },
              eventViews: {
                title: "Event Views",
                content: <EventViewsChart data={this.generatePlaceholderViewsData().chartData} />
              },
            ticketTypes: {
              title: "Ticket Types",
              content: <TicketTypeChart data={this.processTicketTypeData(ticketDescriptions, ticketSales).chartData} />
            },
            profit: {
              title: "Profit Analysis",
              content: <ProfitChart data={this.calculateProfitData(ticketSales, ticketDescriptions).chartData} />
            },
            feedback: {
              title: "Attendee Feedback",
              content: <FeedbackChart data={this.generatePlaceholderFeedbackData().themeData} />
            },
            socialMedia: {
              title: "Social Media Engagement",
              content: <SocialMediaChart data={this.generatePlaceholderSocialData().chartData} />
            },
            revenueSources: {
              title: "Revenue Sources",
              content: <RevenueSourcesChart data={this.calculateRevenueSources(ticketSales, ticketDescriptions).chartData} />
            }
          };
        } catch (error) {
          console.error('Error fetching analytics data:', error);
          throw error;
        }
      },
  
    /**
     * Fetch event details
     */
    async fetchEventDetails(eventId) {
      const response = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
      return await response.json();
    },

/**
 * Process attendee data for charts
 * @param {Array} ticketSales - Ticket sales data (for fallback calculations)
 * @param {Object} attendanceData - Real attendance data from backend (optional)
 */
processAttendeeData(ticketSales, attendanceData = null) {
    // First check if we have real attendance data
    if (attendanceData && attendanceData.total_registered) {
      console.log("Using real attendance data");
      return {
        chartData: [
          { 
            name: 'Current', 
            registered: attendanceData.total_registered, 
            attended: attendanceData.total_attended 
          }
        ],
        totalRegistered: attendanceData.total_registered,
        totalAttended: attendanceData.total_attended,
        attendanceRate: attendanceData.attendance_rate || 0
      };
    }
    
    // Fall back to placeholder data if no real data available
    console.log("Using placeholder attendance data");
    return {
      chartData: [
        { name: 'Week 1', registered: 50, attended: 42 },
        { name: 'Week 2', registered: 75, attended: 65 },
        { name: 'Week 3', registered: 90, attended: 70 },
        { name: 'Week 4', registered: 85, attended: 73 }
      ],
      totalRegistered: ticketSales.length,
      totalAttended: Math.floor(ticketSales.length * 0.85) // Estimated 85% attendance
    };
  },
    /**
     * Fetch ticket descriptions for an event
     */
    async fetchTicketDescriptions(eventId) {
      const response = await fetch(`http://127.0.0.1:5000/ticket-descriptions/${eventId}`);
      const data = await response.json();
      return data.ticket_descriptions || [];
    },
  
    /**
     * Fetch ticket sales data for an event
     * TODO: Implement this endpoint in the backend
     */
    async fetchTicketSales(eventId) {
      // This endpoint doesn't exist yet - it needs to be created in the backend
      const response = await fetch(`http://127.0.0.1:5000/tickets/${eventId}`);
      const data = await response.json();
      return data.tickets || [];
    },
  
    /**
     * Process ticket sales data for charts
     */
    processTicketSalesData(ticketSales, ticketDescriptions) {
      // Group sales by month/date for chart display
      const salesByMonth = this.groupSalesByMonth(ticketSales);
      
      // Calculate totals
      const totalSold = ticketSales.length;
      const totalRevenue = ticketSales.reduce((sum, ticket) => {
        const description = ticketDescriptions.find(desc => desc.id === ticket.ticket_desc_id);
        return sum + (description ? description.price : 0);
      }, 0);
  
      return {
        chartData: salesByMonth,
        totalSold,
        totalRevenue
      };
    },
  
    /**
     * Process attendee data
     */
    async fetchAttendanceData(eventId) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/attendance/${eventId}`);
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching attendance data: ${error.message}`);
          // Return null instead of throwing to fail more gracefully
          return null;
        }
      },
  
    /**
     * Process ticket type data
     */
    processTicketTypeData(ticketDescriptions, ticketSales) {
        // Count sales by ticket type
        const salesByType = {};
        
        ticketSales.forEach(ticket => {
          // Adjust field name to match what the backend returns
          const description = ticketDescriptions.find(desc => desc.id === ticket.descid);
          if (description) {
            salesByType[description.name] = (salesByType[description.name] || 0) + 1;
          }
        });
        
        // Format for chart display
        const chartData = Object.keys(salesByType).map(name => ({
          name,
          value: salesByType[name]
        }));
        
        return {
          chartData,
          breakdown: Object.keys(salesByType).map(name => ({
            name,
            count: salesByType[name],
            percentage: Math.round((salesByType[name] / ticketSales.length) * 100)
          }))
        };
      },
  
    /**
     * Calculate revenue sources
     */
    calculateRevenueSources(ticketSales, ticketDescriptions) {
    
      const ticketRevenue = ticketSales.reduce((sum, ticket) => {
        // Change ticket.ticket_desc_id to ticket.descid to match backend
        const description = ticketDescriptions.find(desc => desc.id === ticket.descid);
        return sum + (description ? description.price : 0);
      }, 0);
      
      //TODO REMOVE THIS HARD CODED placeholder data for other revenue sources
      return {
        chartData: [
          { name: 'Ticket Sales', value: ticketRevenue },
          { name: 'Merchandise', value: Math.round(ticketRevenue * 0.15) }, // Placeholder
          { name: 'Sponsorships', value: Math.round(ticketRevenue * 0.06) }  // Placeholder
        ]
      };
    },
  
    /**
     * Helper: Group sales by month
     */
    groupSalesByMonth(ticketSales) {
      // Group ticket sales by month
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const salesByMonth = Array(12).fill(0);
      
      ticketSales.forEach(ticket => {
        const date = new Date(ticket.purchase_date);
        const month = date.getMonth();
        salesByMonth[month]++;
      });
      
      return monthNames.map((name, index) => ({
        name,
        value: salesByMonth[index]
      })).filter(item => item.value > 0); // Only include months with sales
    },
  
    /**
     * Calculate profit data 
     */
    calculateProfitData(ticketSales, ticketDescriptions) {
      // we would need cost data in  backend to make this accurate
      // This is just a placeholder calculation
      
      const monthlyData = this.groupSalesByMonth(ticketSales);
      
      return {
        chartData: monthlyData.map(month => {
          const revenue = month.value * 50; // Assuming average ticket price of $50
          const costs = Math.round(revenue * 0.6); // Assuming costs are 60% of revenue
          return {
            name: month.name,
            revenue,
            costs,
            profit: revenue - costs
          };
        }),
        totalRevenue: ticketSales.length * 50,
        totalCosts: Math.round(ticketSales.length * 50 * 0.6),
        totalProfit: Math.round(ticketSales.length * 50 * 0.4)
      };
    },
  
    // Placeholder methods for data we don't currently have in the backend
    generatePlaceholderViewsData() {
      return {
        chartData: [
          { date: '3/1', pageViews: 120, uniqueVisitors: 80 },
          { date: '3/8', pageViews: 250, uniqueVisitors: 170 },
          { date: '3/15', pageViews: 310, uniqueVisitors: 220 },
          { date: '3/22', pageViews: 340, uniqueVisitors: 240 },
          { date: '3/29', pageViews: 220, uniqueVisitors: 165 }
        ],
        totalPageViews: 1240,
        totalUniqueVisitors: 875
      };
    },
    
    generatePlaceholderFeedbackData() {
      return {
        rating: 4.2,
        themeData: [
          { name: 'Location', count: 42 },
          { name: 'Speakers', count: 38 },
          { name: 'Food', count: 35 },
          { name: 'Organization', count: 28 },
          { name: 'Content', count: 25 }
        ]
      };
    },
    
    generatePlaceholderSocialData() {
      return {
        chartData: [
          { platform: 'Instagram', value: 85 },
          { platform: 'Twitter', value: 65 },
          { platform: 'Facebook', value: 45 },
          { platform: 'LinkedIn', value: 30 },
          { platform: 'TikTok', value: 20 }
        ],
        mentions: 156,
        hashtagUsage: 87
      };
    }
  };
  
  export default eventAnalyticsService;