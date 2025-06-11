import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

function Home() {
  return <div>Home - Log Analyzer</div>;
}

function About() {
  return <div>About MCP Rooster</div>;
}

function Dogs() {
  return <div>Pictures of Dogs</div>;
}

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>MCP Rooster</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/dogs">Dogs</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dogs" element={<Dogs />} />
        </Routes>
      </Container>
    </Router>
  );
}
