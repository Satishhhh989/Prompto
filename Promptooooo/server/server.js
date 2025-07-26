const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const config = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Prompto backend is running' });
});

// Main API endpoint for generating prompts
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: 'Prompt is required'
            });
        }

        // Call OpenRouter API
        const response = await fetch(config.OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
                'HTTP-Referer': config.CORS_ORIGIN,
                'X-Title': 'Prompto - AI Prompt Generator',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.OPENROUTER_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: config.TEMPERATURE,
                max_tokens: config.MAX_TOKENS
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenRouter API Error:', errorData);
            return res.status(response.status).json({
                error: `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
            });
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return res.status(500).json({
                error: 'Invalid response format from API'
            });
        }

        res.json({
            content: data.choices[0].message.content
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`🚀 Prompto backend server running on port ${config.PORT}`);
    console.log(`📡 CORS enabled for origin: ${config.CORS_ORIGIN}`);
    console.log(`🔗 Health check: http://localhost:${config.PORT}/api/health`);
}); 