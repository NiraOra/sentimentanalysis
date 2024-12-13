// Filename - App.js

// Importing modules
import React, { useState, useEffect } from "react";
import { Box, TextField, Container, Paper, Button } from '@mui/material';
import "./App.css";

function App() {
    // State for storing the analysis response
    const [res, setRes] = useState("");
    // State for storing text input
    const [inputText, setInputText] = useState("");

    // Using useEffect for initial data fetching
    useEffect(() => {
        fetchData();
    }, []);

    // Function to fetch data and analyze sentiment
    const fetchData = async (text = "") => {
        try {
            if (text) {
                const analysisResponse = await fetch("/anal", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text })
                });
                const analysisJson = await analysisResponse.json();
                setRes(analysisJson.Sentiment);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Handle text field changes
    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputText.trim()) {
            fetchData(inputText);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <div className="App">
                    <p>Sentiment Analysis: {res}</p>
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
                            label="Type Text" 
                            variant="filled" 
                            fullWidth
                            value={inputText}
                            onChange={handleTextChange}
                        />
                        <Button 
                            variant="contained" 
                            type="submit"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Analyze Sentiment
                        </Button>
                    </Box>
                </div>
            </Paper>
        </Container>
    );
}

export default App;