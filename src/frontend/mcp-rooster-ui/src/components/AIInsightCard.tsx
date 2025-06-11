import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

interface AIInsightCardProps {
  analysis: string;
  onRepeat?: () => void;
  onApply?: () => void;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ analysis, onRepeat, onApply }) => {
  return (
    <Card elevation={3} sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI Analysis Result
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {analysis}
        </Typography>
      </CardContent>
      {(onRepeat || onApply) && (
        <CardActions>
          {onApply && (
            <Button size="small" color="success" onClick={onApply}>
              Apply Suggestion
            </Button>
          )}
          {onRepeat && (
            <Button size="small" color="primary" onClick={onRepeat}>
              Repeat Analysis
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default AIInsightCard;
