// Filename - App.js

import React, { useState } from "react";
import { 
    Box, 
    TextField, 
    Container, 
    Paper, 
    Button, 
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Divider
} from '@mui/material';
import "./App.css";

function App() {
    const [res, setRes] = useState({ message: "", score: 0 });
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // New states for email rewriter
    const [email, setEmail] = useState("");
    const [tone, setTone] = useState("Work Professional");
    const [rewrittenEmail, setRewrittenEmail] = useState("");
    const [isEmailLoading, setIsEmailLoading] = useState(false);

    const fetchData = async (text = "") => {
        try {
            if (text) {
                setIsLoading(true);
                const analysisResponse = await fetch("/anal", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                const analysisJson = await analysisResponse.json();
                setRes(analysisJson);
                setInputText(""); // Clear input after submission
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setRes({ message: "Error analyzing sentiment", score: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailRewrite = async () => {
        try {
            setIsEmailLoading(true);
            const response = await fetch('/new_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    tone: tone,
                }),
            });
            const data = await response.json();
            setRewrittenEmail(data.email);
            setEmail(""); // Clear input after submission
        } catch (error) {
            console.error('Error:', error);
            setRewrittenEmail("Error generating email");
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputText.trim()) {
            fetchData(inputText);
        }
    };

    // Helper function to get color based on sentiment score
    const getSentimentColor = (score) => {
        // Convert score to number if it's a string
        const numScore = Number(score);
        
        // Add console.log to debug
        console.log('Score:', numScore);
        
        if (numScore > 0.3) {
            return "#4caf50";  // Green for positive
        } 
        if (numScore < -0.3) {
            return "#f44336";  // Red for negative
        }
        return "#ff9800";  // Orange for neutral
    };

    return (
        <Container maxWidth="md">
            {/* Sentiment Analysis Section */}
            <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
                <div className="App">
                    <h2>Sentiment Analysis</h2>
                    {res.message && (
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                p: 2, 
                                mb: 3, 
                                backgroundColor: getSentimentColor(res.score),
                                color: 'white',
                                // Add a default background color
                                bgcolor: (theme) => 
                                    getSentimentColor(res.score) || theme.palette.grey[300]
                            }}
                        >
                            <p style={{ margin: 0 }}>{res.message}</p>
                            <small>Score: {res.score}</small>
                        </Paper>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField 
                            id="filled-basic" 
                            label="Enter text to analyze" 
                            variant="filled" 
                            fullWidth
                            multiline
                            rows={4}
                            value={inputText}
                            onChange={handleTextChange}
                            disabled={isLoading}
                        />
                        <Button 
                            variant="contained" 
                            type="submit"
                            fullWidth
                            disabled={!inputText.trim() || isLoading}
                            sx={{ mt: 2 }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Analyze Sentiment'
                            )}
                        </Button>
                    </Box>
                </div>
            </Paper>

            {/* Email Rewriter Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <div className="App">
                    <h2>Email Rewriter</h2>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            width: '100%'
                        }}
                    >
                        <TextField
                            label="Enter your email"
                            multiline
                            rows={6}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                        
                        <FormControl fullWidth>
                            <InputLabel>Tone</InputLabel>
                            <Select
                                value={tone}
                                label="Tone"
                                onChange={(e) => setTone(e.target.value)}
                            >
                                <MenuItem value="Work Professional">Work Professional</MenuItem>
                                <MenuItem value="Casual and Friendly">Casual and Friendly</MenuItem>
                                <MenuItem value="Apologetic">Apologetic</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleEmailRewrite}
                            disabled={!email.trim() || isEmailLoading}
                            fullWidth
                        >
                            {isEmailLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Rewrite Email'
                            )}
                        </Button>

                        {rewrittenEmail && (
                            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Rewritten Email:
                                </Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {rewrittenEmail}
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </div>
            </Paper>
        </Container>
    );
}

export default App;