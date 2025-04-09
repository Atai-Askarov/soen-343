import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './css/budget.css';

const Budget = () => {
  const { eventId } = useParams();
  const [budgetItems, setBudgetItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketDescriptions, setTicketDescriptions] = useState([]);
  const [hypotheticalProfit, setHypotheticalProfit] = useState(0);

  const [newItem, setNewItem] = useState({
    type: 'income',
    name: '',
    amount: '',
  });

  const fetchBudgetItems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/budget_items/${eventId}`);
      if (!response.ok) throw new Error('Failed to fetch budget items.');
      const data = await response.json();
      setBudgetItems(Array.isArray(data.budget_items) ? data.budget_items : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDescriptions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/ticket-descriptions/${eventId}`);
      const data = await response.json();

      if (data.ticket_descriptions) {
        setTicketDescriptions(data.ticket_descriptions);
        calculateHypotheticalProfit(data.ticket_descriptions);
      } else {
        console.error('No ticket descriptions found');
      }
    } catch (err) {
      console.error('Error fetching ticket descriptions:', err);
    }
  };

  const calculateHypotheticalProfit = (ticketData) => {
    let totalProfit = 0;
    ticketData.forEach((ticket) => {
      totalProfit += ticket.price * ticket.ticketlimit;
    });
    setHypotheticalProfit(totalProfit);
  };

  const handleTicketLimitChange = (e, index) => {
    const updatedTickets = [...ticketDescriptions];
    updatedTickets[index].ticketlimit = e.target.value;
    setTicketDescriptions(updatedTickets);
    calculateHypotheticalProfit(updatedTickets);
  };

  useEffect(() => {
    fetchBudgetItems();
    fetchTicketDescriptions();
  }, [eventId]);

  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    const allItems = [...budgetItems, ...newItems];
    return allItems.reduce((total, item) => {
      if (item.type === 'income') {
        return total + parseFloat(item.amount);
      } else if (item.type === 'expenditure') {
        return total - parseFloat(item.amount);
      }
      return total;
    }, 0);
  };

  const handleAddNewItem = () => {
    setNewItems([...newItems, { ...newItem }]);
    setNewItem({ type: 'income', name: '', amount: '' });
  };

  const handleDeleteItem = (id) => {
    setDeletedItems([...deletedItems, id]);
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const handleSaveItems = async () => {
    try {
      for (const item of newItems) {
        const response = await fetch('http://localhost:5000/create_budget_item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: eventId,
            type: item.type,
            name: item.name,
            amount: parseFloat(item.amount),
          }),
        });
        if (!response.ok) throw new Error(`Failed to save item: ${item.name}`);
      }

      for (const id of deletedItems) {
        const response = await fetch(`http://localhost:5000/delete_budget_item/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete item with ID: ${id}`);
      }

      setNewItems([]);
      setDeletedItems([]);
      alert('Items saved successfully!');
      await fetchBudgetItems();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading-message">Loading budget items...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="budget-container">
      <div className="header">
        <h2 className="header-title">Your Budget Management</h2>
        <h2 className="header-title">Simulate Ticket Purchases</h2>
        </div>

      <div className="side-menu">
        <Link to={`/eventDashboard/${eventId}`} className="menu-item">Analytics</Link>
        <Link to={`/manage-ticketing/${eventId}`} className="menu-item">Manage Ticketing</Link>
        <Link to={`/promotion/${eventId}`} className="menu-item">Promotion</Link>
        <Link to={`/budget/${eventId}`} className="menu-item">Budgeting</Link>
        <Link to={`/sponsorships/${eventId}`} className="menu-item">Sponsorships</Link>
      </div>
      <div className="budget-content">
      <div>
      <table className="budget-table">
        <thead>
          <tr>
            <th className="budget-column">Type</th>
            <th className="budget-column">Name</th>
            <th className="budget-column">Amount</th>
            <th className="budget-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgetItems.length === 0 && newItems.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-items">No budget items available.</td>
            </tr>
          ) : (
            <>
              {budgetItems.map(item => (
                <tr key={item.id}>
                  <td className="budget-item-type">{item.type}</td>
                  <td className="budget-item-name">{item.name}</td>
                  <td className="budget-item-amount">${parseFloat(item.amount).toFixed(2)}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {newItems.map((item, index) => (
                <tr key={`new-${index}`}>
                  <td className="budget-item-type">{item.type}</td>
                  <td className="budget-item-name">{item.name}</td>
                  <td className="budget-item-amount">${parseFloat(item.amount).toFixed(2)}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteItem(`new-${index}`)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <div className="total-container">
                  <h3>Total Budget: ${calculateTotal().toFixed(2)}</h3>
                </div>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <div className="new-item-form">
        <select className='budget-type-select' name="type" value={newItem.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expenditure">Expenditure</option>
        </select>
        <input type="text" name="name" value={newItem.name} placeholder="Item Name" onChange={handleChange} />
        <input type="number" name="amount" value={newItem.amount} placeholder="Amount" onChange={handleChange} />
        <button className="add-item-button" onClick={handleAddNewItem}>Add Item</button>
      </div>

      <div className="save-button-container">
        <button className="save-button" onClick={handleSaveItems}>Save Items</button>
      </div>
      </div>
      {/* Ticket Descriptions Section */}
      <div className="ticket-descriptions">
        <div className='ticket-description-header'><h3>Ticket Descriptions</h3></div>
        <ul>
          {ticketDescriptions.length > 0 ? (
            ticketDescriptions.map((ticket, index) => (
              <li key={index}>
                <h4>{ticket.name}</h4>
                <p>{ticket.description}</p>
                <p>Price: ${ticket.price}</p>
                <p>Current Limit of Tickets: {ticket.ticketlimit}</p>
                <p>
                  Try a New Limit: 
                  <input
                    type="number"
                    value={ticket.ticketlimit}
                    onChange={(e) => handleTicketLimitChange(e, index)}
                    min="0"
                    className="ticket-limit-input"
                  />
                </p>
                <p>Hypothetical Profit: ${ticket.price * ticket.ticketlimit}</p>
              </li>
            ))
          ) : (
            <p>No ticket descriptions available.</p>
          )}
        </ul>

        <div className="total-hypothetical-profit">
          <h4>Total Hypothetical Profit: ${hypotheticalProfit.toFixed(2)}</h4>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Budget;














