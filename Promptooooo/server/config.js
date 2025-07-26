// Configuration file for the Prompto backend
// In production, use environment variables instead of hardcoded values

module.exports = {
    // OpenRouter API Configuration
    OPENROUTER_API_KEY: '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',
    OPENROUTER_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    OPENROUTER_MODEL: 'google/gemma-3n-e4b-it:free',

    // Server Configuration
    PORT: process.env.PORT || 5000,

    // CORS Configuration
    CORS_ORIGIN: 'http://127.0.0.1:5500', // Live Server default port

    // API Configuration
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7
}; 