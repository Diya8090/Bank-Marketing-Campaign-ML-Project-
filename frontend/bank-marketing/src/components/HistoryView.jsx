import { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Search,
  FileSpreadsheet
} from 'lucide-react';

export default function HistoryView({ history = [], onClearHistory }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.decision && item.decision.toLowerCase().includes(term)) ||
      (item.job && item.job.toLowerCase().includes(term)) ||
      String(item.age).includes(term) ||
      String(item.balance).includes(term)
    );
  });

  const getProbPct = (item) => {
    if (item.probability_percent !== undefined) return item.probability_percent;
    if (item.probabilityPct !== undefined) return item.probabilityPct;
    if (item.probability !== undefined) return Math.round(item.probability * 10000) / 100;
    return 0;
  };

  const isPositive = (item) => item.prediction === 1 || item.decision === 'SUBSCRIBED';

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bank_predictions_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = ["Timestamp", "Decision", "Probability (%)", "Age", "Balance (€)", "Duration (s)", "Campaign", "Housing Loan", "Personal Loan", "Job", "Education"];
    const rows = history.map(item => [
      item.timestamp || new Date().toISOString(),
      item.decision || (isPositive(item) ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'),
      getProbPct(item),
      item.age,
      item.balance,
      item.duration,
      item.campaign,
      item.housing || 'n/a',
      item.loan || 'n/a',
      item.job || 'n/a',
      item.education || 'n/a'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bank_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="history-workspace card-panel">
      <div className="panel-header">
        <div className="header-left">
          <div className="header-icon-box">
            <History size={20} />
          </div>
          <div>
            <h3>Prediction Log & Client Comparison</h3>
            <p className="subtitle">Saved prediction records logged from FastAPI ML backend</p>
          </div>
        </div>

        <div className="header-actions">
          {history.length > 0 && (
            <>
              <button 
                type="button" 
                className="btn-secondary-action" 
                onClick={handleExportCSV}
              >
                <FileSpreadsheet size={15} />
                <span>Export CSV</span>
              </button>

              <button 
                type="button" 
                className="btn-secondary-action" 
                onClick={handleExportJSON}
              >
                <Download size={15} />
                <span>Export JSON</span>
              </button>

              <button 
                type="button" 
                className="btn-danger-action" 
                onClick={onClearHistory}
              >
                <Trash2 size={15} />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      {history.length > 0 && (
        <div className="history-search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by prediction decision, job, age, or balance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="empty-history-state">
          <History size={48} className="empty-icon text-muted" />
          <h4>No Saved Predictions Yet</h4>
          <p>Run predictions on the Interactive Prediction Card tab and click <strong>Save to History</strong> to log customer evaluation profiles here.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Prediction Decision</th>
                <th>Probability</th>
                <th>Age</th>
                <th>Balance (€)</th>
                <th>Call Duration</th>
                <th>Campaign</th>
                <th>Loans</th>
                <th>Job & Education</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => {
                const pos = isPositive(item);
                const probVal = getProbPct(item);
                return (
                  <tr key={index} className={pos ? 'row-positive' : 'row-negative'}>
                    <td>{index + 1}</td>
                    <td className="time-cell">
                      {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </td>
                    <td>
                      <span className={`status-pill ${pos ? 'pill-success' : 'pill-danger'}`}>
                        {pos ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{item.decision || (pos ? 'SUBSCRIBED' : 'NOT SUBSCRIBED')}</span>
                      </span>
                    </td>
                    <td>
                      <strong className={pos ? 'text-emerald' : 'text-rose'}>
                        {probVal}%
                      </strong>
                    </td>
                    <td>{item.age} yrs</td>
                    <td>€{Number(item.balance).toLocaleString()}</td>
                    <td>{item.duration}s</td>
                    <td>{item.campaign}</td>
                    <td>
                      <div className="loans-stack">
                        <span className={`mini-badge ${item.housing === 'yes' ? 'badge-rose' : 'badge-emerald'}`}>
                          H: {(item.housing || 'no').toUpperCase()}
                        </span>
                        <span className={`mini-badge ${item.loan === 'yes' ? 'badge-rose' : 'badge-emerald'}`}>
                          L: {(item.loan || 'no').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="job-edu-stack">
                        <span className="job-name">{item.job || 'n/a'}</span>
                        <span className="edu-name">{item.education || 'n/a'}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
