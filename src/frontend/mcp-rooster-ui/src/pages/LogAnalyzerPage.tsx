// src/pages/LogAnalyzerPage.tsx

import React, { useState, useRef } from 'react';
import {
    Button,
    CircularProgress,
    Container,
    Snackbar,
    Alert,
    TextField,
    Typography,
    Box,
} from '@mui/material';
import { AIInsightCard } from '../components/AIInsightCard';

export const LogAnalyzerPage: React.FC = () => {
    const [logSnippet, setLogSnippet] = useState('');
    const [analysis, setAnalysis] = useState<{
        redTeam?: string;
        blueTeam?: string;
        executive?: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(
        null
    );
    const resultRef = useRef<HTMLDivElement>(null);

    const handleAnalyze = async () => {
        if (!logSnippet.trim()) {
            setToast({ message: 'Please enter a log snippet.', severity: 'error' });
            return;
        }

        setLoading(true);
        setAnalysis(null);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logSnippet }),
            });

            if (!response.ok) throw new Error('API returned error');

            const data = await response.json();
            setAnalysis(data.analysis);
            setToast({ message: 'Analysis complete', severity: 'success' });

            // Scroll to results
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
        } catch (error) {
            setToast({ message: 'Analysis failed. Try again later.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom mt={4}>
                AI Log Analyzer
            </Typography>

            <TextField
                label="Paste log snippet"
                multiline
                minRows={6}
                fullWidth
                variant="outlined"
                margin="normal"
                value={logSnippet}
                onChange={(e) => setLogSnippet(e.target.value)}
            />

            <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                {loading ? <CircularProgress size={24} /> : null}
                <Button variant="contained" onClick={handleAnalyze} disabled={loading}>
                    Analyze
                </Button>
            </Box>

            <div ref={resultRef} style={{ marginTop: '2rem' }}>
                {analysis && (
                    <>
                        <AIInsightCard
                            title="Red Team"
                            description="How an attacker might exploit the system."
                            content={analysis.redTeam ?? 'No data'}
                        />
                        <AIInsightCard
                            title="Blue Team"
                            description="What defenders should do in response."
                            content={analysis.blueTeam ?? 'No data'}
                        />
                        <AIInsightCard
                            title="Executive"
                            description="Summary for business and risk context."
                            content={analysis.executive ?? 'No data'}
                        />
                    </>
                )}
            </div>

            {toast && (
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => setToast(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity={toast.severity} onClose={() => setToast(null)} sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};
export default LogAnalyzerPage;
