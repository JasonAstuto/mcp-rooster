import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Paper,
    Input,
    Divider
} from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AIInsightCard from '../components/AIInsightCard';

interface AnalysisRecord {
    id: string;
    protocol: string;
    logSnippet: string;
    result: string;
    timestamp: string;
}

const STORAGE_KEY = 'mcp-rooster-analysis-history';

const LogAnalyzerPage: React.FC = () => {
    const [logSnippet, setLogSnippet] = useState('');
    const [protocol, setProtocol] = useState('HTTP');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<AnalysisRecord[]>([]);

    // Load history from localStorage on load
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            setHistory(JSON.parse(raw));
        }
    }, []);

    const saveToHistory = (entry: AnalysisRecord) => {
        const updated = [entry, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleSubmit = async () => {
        if (!logSnippet.trim()) {
            setError("Please enter or upload a log snippet.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult('');

        try {
            const response = await axios.post('/api/analyze', {
                protocol,
                logSnippet
            });

            const analysis = response.data.analysis || "No analysis returned.";
            setResult(analysis);

            saveToHistory({
                id: uuidv4(),
                protocol,
                logSnippet,
                result: analysis,
                timestamp: new Date().toISOString()
            });
        } catch (err: any) {
            console.error(err);
            setError("Analysis failed. See console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const contents = ev.target?.result as string;
            setLogSnippet(contents);
        };
        reader.onerror = () => {
            setError("Failed to read file.");
        };

        reader.readAsText(file);
    };

    const handleHistoryClick = (entry: AnalysisRecord) => {
        setProtocol(entry.protocol);
        setLogSnippet(entry.logSnippet);
        setResult(entry.result);
    };

    const clearHistory = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Log Analyzer
            </Typography>

            <Box mb={2}>
                <Input
                    type="file"
                    inputProps={{ accept: ".log,.txt" }}
                    onChange={handleFileUpload}
                />
            </Box>

            <TextField
                label="Log Snippet"
                multiline
                fullWidth
                rows={10}
                value={logSnippet}
                onChange={(e) => setLogSnippet(e.target.value)}
                variant="outlined"
                margin="normal"
            />

            <TextField
                label="Protocol"
                select
                fullWidth
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                variant="outlined"
                margin="normal"
            >
                <MenuItem value="HTTP">HTTP</MenuItem>
                <MenuItem value="HTTPS">HTTPS</MenuItem>
                <MenuItem value="DNS">DNS</MenuItem>
            </TextField>

            <Box mt={2} mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    Analyze
                </Button>
                {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Box>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            {result && (
                <AIInsightCard
                    analysis={result}
                    onRepeat={handleSubmit}
                    onApply={() => alert("Applying suggestion (not yet implemented).")}
                />
            )}

            <Divider sx={{ my: 4 }} />

            <Box>
                <Typography variant="h6">Analysis History</Typography>

                {history.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        No history yet.
                    </Typography>
                )}

                {history.map((entry) => (
                    <Paper
                        key={entry.id}
                        elevation={1}
                        sx={{ p: 2, mt: 2, cursor: 'pointer' }}
                        onClick={() => handleHistoryClick(entry)}
                    >
                        <Typography variant="subtitle2">
                            {entry.protocol} @ {new Date(entry.timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {entry.logSnippet.slice(0, 200)}...
                        </Typography>
                    </Paper>
                ))}

                {history.length > 0 && (
                    <Button onClick={clearHistory} color="secondary" sx={{ mt: 2 }}>
                        Clear History
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default LogAnalyzerPage;
