import React, { useState, useEffect } from 'react';
import "../css/manageUsers.css";
import axios from "axios";

const ManageUsers = () => {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    user_id: '',
    username: '',
    email: '',
    user_type: '',
    interests: '',
  });
  const [editingIndex, setEditingIndex] = useState(null); // Track the row being edited
  const [selectedRow, setSelectedRow] = useState(null); // Track the row selected for viewing

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setRows(response.data); // Assuming the API returns an array of user objects
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers(); // Fetch users when the component mounts
  }, []);

  const handleAddRow = () => {
    if (newRow.user_id && newRow.username && newRow.email && newRow.user_type && newRow.interests) {
      setRows([...rows, newRow]);
      setNewRow({ user_id: '', username: '', email: '', user_type: '', interests: '' }); // Reset the input fields
    } else {
      alert('Please fill out all fields before adding a row.');
    }
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    if (selectedRow === rows[index]) {
      setSelectedRow(null); // Clear the selected row if it was deleted
    }
  };

  const handleEditRow = (index) => {
    setEditingIndex(index);
    setNewRow(rows[index]); // Populate the input fields with the row's data
  };

  const handleUpdateRow = () => {
    if (editingIndex !== null) {
      const updatedRows = rows.map((row, index) =>
        index === editingIndex ? newRow : row
      );
      setRows(updatedRows);
      setEditingIndex(null); // Exit editing mode
      setNewRow({ user_id: '', username: '', email: '', user_type: '', interests: '' }); // Reset the input fields
    }
  };

  const handleViewRow = (row) => {
    setSelectedRow(row); // Set the selected row for viewing
  };

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Actions</th>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Interests</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <button onClick={() => handleEditRow(index)}>Update</button>
                <button onClick={() => handleDeleteRow(index)}>Delete</button>
                <button onClick={() => handleViewRow(row)}>View</button>
              </td>
              <td>{row.id}</td>
              <td>{row.username}</td>
              <td>{row.email}</td>
              <td>{row.user_type}</td>
              <td>{row.interests}</td>
            </tr>
          ))}
          <tr>
            <td>
              {editingIndex !== null ? (
                <button onClick={handleUpdateRow}>Save</button>
              ) : (
                <button onClick={handleAddRow}>Add</button>
              )}
            </td>
            <td>
              <input
                type="text"
                name="user_id"
                value={newRow.user_id}
                onChange={handleInputChange}
                placeholder="Enter user ID"
              />
            </td>
            <td>
              <input
                type="text"
                name="username"
                value={newRow.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </td>
            <td>
              <input
                type="email"
                name="email"
                value={newRow.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </td>
            <td>
              <input
                type="text"
                name="user_type"
                value={newRow.user_type}
                onChange={handleInputChange}
                placeholder="Enter user type"
              />
            </td>
            <td>
              <input
                type="text"
                name="interests"
                value={newRow.interests}
                onChange={handleInputChange}
                placeholder="Enter interests"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h2>JSON Representation</h2>
      {selectedRow ? (
        <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
      ) : (
        <p>No row selected for viewing.</p>
      )}
    </div>
  );
};

export default ManageUsers;