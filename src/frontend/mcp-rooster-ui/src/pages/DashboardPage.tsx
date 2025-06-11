import React from 'react';
import { Typography, Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        Overview and stats coming soon.
      </Typography>
    </Box>
  );
};

export default DashboardPage;
