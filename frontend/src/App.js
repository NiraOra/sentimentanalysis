// Filename - App.js

import React, { useState } from "react";
import { Box, TextField, Container, Paper, Button, CircularProgress } from '@mui/material';
import "./App.css";

function App() {
    const [res, setRes] = useState({ message: "", score: 0 });
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        if (score > 0.3) {
          return "#4caf50";
        } // Green for positive
        if (score < -0.3) {
          return "#f44336";
        } // Red for negative
        return "#ff9800"; // Orange for neutral
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <div className="App">
                    <h2>Sentiment Analysis</h2>
                    {res.message && (
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                p: 2, 
                                mb: 3, 
                                backgroundColor: getSentimentColor(res.score),
                                color: 'white'
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
                            '& > :not(style)': { m: 1, width: '25ch' },
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
        </Container>
    );
}

export default App;