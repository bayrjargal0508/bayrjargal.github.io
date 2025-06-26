'use client';

import { useEffect, useState } from 'react';

type Log = {
  url: string;
  timestamp: string;
  userId: string;
};

export default function MonitoringLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/get-logs');
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data.logs);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Access Logs</h2>
      {logs.length === 0 && <p>No logs found.</p>}
      <ul className="list-disc pl-5 space-y-2">
        {logs.map(({ url, timestamp, userId }, index) => (
          <li key={index} className="border p-2 rounded shadow-sm">
            <p>
              <strong>User:</strong> {userId}
            </p>
            <p>
              <strong>URL:</strong> <a href={url} className="text-blue-600 underline" target="_blank" rel="noreferrer">{url}</a>
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
