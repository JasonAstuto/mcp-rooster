import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
    Paper,
  Button
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
type TuningSettings = {
  [protocol: string]: {
    sensitivity: number;
    threshold: number;
  };
};

const STORAGE_KEY = 'mcp-rooster-tuning-settings';
const protocols = ['HTTP', 'HTTPS', 'DNS'];

const loadSettings = (): TuningSettings => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
};

const saveSettings = (settings: TuningSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const TuningPanelPage: React.FC = () => {
  const [settings, setSettings] = useState<TuningSettings>(loadSettings());
  const [selectedProtocol, setSelectedProtocol] = useState('HTTP');

  const currentSettings = settings[selectedProtocol] || { sensitivity: 50, threshold: 10 };

  const handleSensitivityChange = (
    _event: Event,
    value: number | number[],
    _activeThumb: number
  ) => {
    const numericValue = Array.isArray(value) ? value[0] : value;
  
    const updated = {
      ...settings,
      [selectedProtocol]: {
        ...currentSettings,
        sensitivity: numericValue
      }
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleThresholdChange = (
    _event: Event,
    value: number | number[],
    _activeThumb: number
  ) => {
    const numericValue = Array.isArray(value) ? value[0] : value;
  
    const updated = {
      ...settings,
      [selectedProtocol]: {
        ...currentSettings,
        threshold: numericValue
      }
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleProtocolChange = (event: any) => {
    setSelectedProtocol(event.target.value);
  };

  const handleReset = () => {
    const reset = { ...settings };
    delete reset[selectedProtocol];
    setSettings(reset);
    saveSettings(reset);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Protocol Tuning
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
  <InputLabel id="protocol-label">Protocol</InputLabel>
  <Select
    labelId="protocol-label"
    id="protocol"
    value={selectedProtocol}
    onChange={handleProtocolChange}
    label="Protocol"
  >
    {protocols.map((proto) => (
      <MenuItem key={proto} value={proto}>
        {proto}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        <Typography gutterBottom>
          Sensitivity ({currentSettings.sensitivity})
        </Typography>
        <Slider
          value={currentSettings.sensitivity}
          onChange={handleSensitivityChange}
          aria-label="Sensitivity"
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{ mb: 4 }}
        />

        <Typography gutterBottom>
          Anomaly Threshold ({currentSettings.threshold})
        </Typography>
        <Slider
          value={currentSettings.threshold}
          onChange={handleThresholdChange}
          aria-label="Anomaly Threshold"
          valueLabelDisplay="auto"
          min={1}
          max={50}
        />

        <Box mt={3}>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset {selectedProtocol} Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TuningPanelPage;
