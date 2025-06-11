import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';

type Alert = {
  id: string;
  protocol: string;
  summary: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
};

const mockAlerts: Alert[] = [
  {
    id: '1',
    protocol: 'HTTP',
    summary: 'Unusual POST pattern to /admin detected.',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 min ago
  },
  {
    id: '2',
    protocol: 'HTTPS',
    summary: 'TLS handshake anomalies observed from unknown IP.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: '3',
    protocol: 'DNS',
    summary: 'High volume of A record queries to suspicious domain.',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  }
];

const severityColor = (severity: Alert['severity']) => {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'info';
  }
};

const AlertPanelPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Simulate fetching from backend
    setAlerts(mockAlerts);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Recent Alerts
      </Typography>

      {alerts.length === 0 ? (
        <Typography>No alerts to show.</Typography>
      ) : (
        <Stack spacing={2}>
          {alerts.map((alert) => (
            <Paper key={alert.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  {alert.summary}
                </Typography>
                <Chip
                  label={alert.severity.toUpperCase()}
                  color={severityColor(alert.severity)}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {alert.protocol} • {new Date(alert.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default AlertPanelPage;
