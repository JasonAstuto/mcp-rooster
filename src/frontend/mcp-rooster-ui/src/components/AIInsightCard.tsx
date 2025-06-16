// src/components/AIInsightCard.tsx

import React from 'react';
import { Card, CardContent, Typography, Tooltip } from '@mui/material';

interface AIInsightCardProps {
  title: 'Red Team' | 'Blue Team' | 'Executive';
  description: string;
  content: string;
}

const getAccentColor = (title: string) => {
  switch (title) {
    case 'Red Team':
      return '#ff1744';
    case 'Blue Team':
      return '#2979ff';
    case 'Executive':
      return '#f9a825';
    default:
      return '#ccc';
  }
};

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ title, description, content }) => {
  return (
    <Tooltip title={description} placement="top" arrow>
      <Card variant="outlined" sx={{ borderLeft: `6px solid ${getAccentColor(title)}`, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <Typography variant="body2" color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
            {content}
          </Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );
};
