import React, { useState, useEffect } from 'react';
import { GetLogs } from '../wailsjs/go/main/App'; 

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    GetLogs()
      .then((data) => {
        setLogs(data || ["No logs recorded yet. Cura system active!"]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to read logs:", err);
        setLogs(["Error loading logs from system backend."]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>🛡️ Cura System Events Log</span>
        <button onClick={fetchLogs} style={styles.button}>Refresh</button>
      </div>
      <div style={styles.console}>
        {loading ? (
          <p style={styles.loading}>Streaming log buffer...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={styles.logLine}>
              <span style={styles.lineNumber}>{index + 1}</span> {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    fontFamily: 'monospace',
    color: '#d4d4d4',
    margin: '20px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#4fc1ff',
  },
  button: {
    padding: '5px 12px',
    backgroundColor: '#0e639c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  console: {
    backgroundColor: '#111',
    padding: '15px',
    borderRadius: '6px',
    maxHeight: '300px',
    overflowY: 'auto',
    textAlign: 'left',
  },
  logLine: {
    fontSize: '13px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    borderBottom: '1px solid #222',
    padding: '4px 0',
  },
  lineNumber: {
    color: '#858585',
    marginRight: '10px',
    userSelect: 'none',
  },
  loading: {
    color: '#858585',
    fontStyle: 'italic',
  }
};
