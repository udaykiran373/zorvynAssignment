// src/components/Records.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Records({ userRole }) {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ amount: '', type: 'expense', category: 'General', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadRecords = () => {
    axios.get(`/api/records${searchTerm ? `?search=${searchTerm}` : ''}`)
      .then(res => setRecords(res.data.data.records))
      .catch(err => setError(err.response?.data?.message || 'Unauthorized'));
  };

  useEffect(() => { loadRecords(); }, [searchTerm]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/records', formData);
      setFormData({ amount: '', type: 'expense', category: 'General', notes: '' });
      loadRecords();
    } catch(err) { setError(err.response?.data?.message); }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`/api/records/${id}`);
      loadRecords();
    } catch(err) { setError(err.response?.data?.message); }
  }

  const startEdit = (r) => { setEditingId(r._id); setEditForm(r); };
  const cancelEdit = () => { setEditingId(null); };
  const saveEdit = async (id) => {
    try {
      await axios.patch(`/api/records/${id}`, {
          amount: editForm.amount, type: editForm.type, category: editForm.category, notes: editForm.notes
      });
      setEditingId(null);
      loadRecords();
    } catch(err) { setError(err.response?.data?.message); }
  };

  return (
    <div style={{ animation: 'slideUp 0.6s ease' }}>
        {error && <div className="error-msg glass" style={{marginBottom: '1rem'}}>{error}</div>}

        {/* Admin CRUD Matrix */}
        {userRole === 'Admin' && (
          <div className="glass records-section" style={{marginBottom: '2rem'}}>
            <h2>Log New Record</h2>
            <form onSubmit={handleCreate} className="form-group">
                <input type="number" className="input-field" placeholder="Amount ($)" style={{marginTop: 0}}
                  value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required/>
                <select className="input-select" style={{marginTop: 0}} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input type="text" className="input-field" placeholder="Category" style={{marginTop: 0}}
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required/>
                <input type="text" className="input-field" placeholder="Notes (Optional)" style={{marginTop: 0}}
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}/>
                
                <button type="submit" className="btn-small success" style={{padding: '12px 24px'}}>Commit</button>
            </form>
          </div>
        )}

        <div className="glass records-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h2 style={{margin: 0}}>Financial Ledger</h2>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Filter / Search Notes..." 
                  style={{width: '300px', margin: 0}}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <table className="data-table">
            <thead>
                <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
                {userRole === 'Admin' && <th>Execute</th>}
                </tr>
            </thead>
            <tbody>
                {records.map(r => (
                <tr key={r._id}>
                    {editingId === r._id ? (
                        <>
                            <td>{new Date(r.date).toLocaleDateString()}</td>
                            <td>
                                <select className="input-select" style={{padding: '4px', margin: 0}} value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </td>
                            <td><input type="text" className="input-field" style={{padding: '4px', margin: 0}} value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} /></td>
                            <td><input type="number" className="input-field" style={{padding: '4px', margin: 0, width: '80px'}} value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} /></td>
                            <td><input type="text" className="input-field" style={{padding: '4px', margin: 0, width: '120px'}} value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} /></td>
                            <td>
                                <button className="btn-small success" onClick={() => saveEdit(r._id)}>Save</button>
                                <button className="btn-small danger" onClick={cancelEdit}>Cancel</button>
                            </td>
                        </>
                    ) : (
                        <>
                            <td>{new Date(r.date).toLocaleDateString()}</td>
                            <td>{r.type.toUpperCase()}</td>
                            <td>{r.category}</td>
                            <td className={r.type === 'income' ? 'positive' : 'negative'}>${r.amount}</td>
                            <td style={{color: 'var(--text-muted)'}}>{r.notes}</td>
                            {userRole === 'Admin' && (
                                <td>
                                    <button className="btn-small" style={{borderColor: 'var(--accent)', color: 'var(--accent)'}} onClick={() => startEdit(r)}>Edit</button>
                                    <button className="btn-small danger" onClick={() => deleteRecord(r._id)}>Soft Delete</button>
                                </td>
                            )}
                        </>
                    )}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  );
}
