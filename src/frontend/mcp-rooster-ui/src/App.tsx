import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar, AppBar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BugReportIcon from '@mui/icons-material/BugReport';
import TuneIcon from '@mui/icons-material/Tune';
import WarningIcon from '@mui/icons-material/Warning';
import DashboardPage from './pages/DashboardPage';
import LogAnalyzerPage from './pages/LogAnalyzerPage';
import TuningPanelPage from './pages/TuningPanelPage';
import AlertPanelPage from './pages/AlertPanelPage';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Log Analyzer', icon: <BugReportIcon />, path: '/analyze' },
  { label: 'Tuning', icon: <TuneIcon />, path: '/tuning' },
  { label: 'Alerts', icon: <WarningIcon />, path: '/alerts' }
];

const NavMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <List>
      {navItems.map((item) => (
        <ListItemButton
          key={item.path}
          selected={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
};

const Layout: React.FC = () => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          MCP Rooster – The Early Warning System
        </Typography>
      </Toolbar>
    </AppBar>
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <NavMenu />
    </Drawer>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/analyze" element={<LogAnalyzerPage />} />
        <Route path="/tuning" element={<TuningPanelPage />} />
        <Route path="/alerts" element={<AlertPanelPage />} />
      </Routes>
    </Box>
  </Box>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
