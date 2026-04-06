import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/summary')
      .then(res => setSummary(res.data.data))
      .catch(err => {
          if (err.response?.status === 403) setError('RBAC Error: Dashboard Access Denied'); 
      });
  }, []);

  if (error) return <div className="error-msg glass">{error}</div>;
  if (!summary) return <p>Loading Metrics...</p>;

  return (
    <div style={{ animation: 'slideUp 0.6s ease' }}>
        <div className="metrics-grid">
            <div className="glass metric-card">
                <div className="metric-title">Total Income</div>
                <div className="metric-value positive">${summary.totalIncome?.toLocaleString()}</div>
            </div>
            <div className="glass metric-card">
                <div className="metric-title">Total Outflow</div>
                <div className="metric-value negative">${summary.totalExpense?.toLocaleString()}</div>
            </div>
            <div className="glass metric-card">
                <div className="metric-title">Net Balance</div>
                <div className={`metric-value ${summary.netBalance >= 0 ? 'positive' : 'negative'}`}>
                    ${summary.netBalance?.toLocaleString()}
                </div>
            </div>
        </div>

        <div className="glass records-section">
            <h2>Recent Transactions</h2>
            {summary.recentActivity?.length > 0 ? (
                summary.recentActivity.map((r, i) => (
                    <div className="record-item" key={i}>
                        <div className="record-left">
                            <strong>{r.category}</strong>
                            <span>{new Date(r.date).toLocaleDateString()} &middot; {r.notes || "Auto Log"}</span>
                        </div>
                        <div className={`record-amount ${r.type === 'income' ? 'positive' : 'negative'}`}>
                            {r.type === 'income' ? '+' : '-'}${r.amount.toLocaleString()}
                        </div>
                    </div>
                ))
            ) : <p style={{color: 'var(--text-muted)'}}>No Activity Logged.</p>}
        </div>
    </div>
  );
}
