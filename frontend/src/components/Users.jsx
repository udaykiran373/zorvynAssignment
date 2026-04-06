// src/components/Users.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const loadUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data.data.users))
      .catch(err => setError(err.response?.data?.message || 'Error fetching users'));
  };

  useEffect(() => { loadUsers(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete User Permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      loadUsers();
    } catch(err) { setError(err.response?.data?.message); }
  };

  return (
    <div className="glass records-section" style={{ animation: 'slideUp 0.6s ease' }}>
        <h2>User Management (Admin Only)</h2>
        {error && <div className="error-msg">{error}</div>}
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td>{u.status}</td>
                <td>
                  <button className="btn-small danger" onClick={() => deleteUser(u._id)}>Wipe</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
