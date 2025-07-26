# Prompto - AI Prompt Generator

A secure full-stack web application for generating perfect AI prompts instantly. The application has been refactored from a single-page app to a secure client-server architecture.

## 🏗️ Architecture

- **Frontend**: HTML, CSS, JavaScript (runs on Live Server port 5500)
- **Backend**: Node.js Express server (runs on port 5000)
- **API**: Secure proxy to OpenRouter API

## 📁 Project Structure

```
project-root/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js   ← Updated to call backend
├── server/
│   ├── package.json
│   ├── config.js  ← Contains API key securely
│   └── server.js  ← Express backend server
└── README.md
```

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Start the Backend Server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

### 3. Start the Frontend

Use Live Server or any local development server to serve the `frontend/` directory on port 5500.

- **VS Code**: Right-click `frontend/index.html` → "Open with Live Server"
- **Other**: Use any local server (http-server, python -m http.server, etc.)

### 4. Access the Application

Open your browser and navigate to:
- Frontend: `http://127.0.0.1:5500/frontend/index.html`
- Backend Health Check: `http://localhost:5000/api/health`

## 🔧 Configuration

### Backend Configuration

The backend configuration is in `server/config.js`:

```javascript
module.exports = {
    OPENROUTER_API_KEY: 'your-api-key-here',
    OPENROUTER_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    OPENROUTER_MODEL: 'google/gemma-3n-e4b-it:free',
    PORT: 5000,
    CORS_ORIGIN: 'http://127.0.0.1:5500'
};
```

### Frontend Configuration

The frontend configuration is in `frontend/app.js`:

```javascript
this.BACKEND_URL = 'http://localhost:5000';
this.API_ENDPOINT = '/api/generate';
```

## 🔒 Security Features

- ✅ API key moved to backend (no longer exposed in frontend)
- ✅ CORS configured for local development
- ✅ Input validation on both frontend and backend
- ✅ Error handling and logging
- ✅ Secure proxy to OpenRouter API

## 📡 API Endpoints

### POST `/api/generate`

Generate an AI prompt using the backend proxy.

**Request:**
```json
{
    "prompt": "Your system prompt here"
}
```

**Response:**
```json
{
    "content": "Generated AI prompt content"
}
```

### GET `/api/health`

Health check endpoint to verify the server is running.

**Response:**
```json
{
    "status": "OK",
    "message": "Prompto backend is running"
}
```

## 🛠️ Development

### Backend Development

```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

The frontend files are static and can be edited directly. Changes will be reflected immediately when using Live Server.

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the frontend is running on port 5500 and the backend on port 5000
2. **API Key Issues**: Verify the API key in `server/config.js` is valid
3. **Port Conflicts**: Change the port in `server/config.js` if port 5000 is in use

### Debug Mode

Enable debug logging by adding `console.log` statements in the backend or checking browser developer tools for frontend issues.

## 📝 Notes

- The API key is currently stored in `config.js` for development. In production, use environment variables.
- The frontend preserves all original functionality and styling.
- The backend handles all OpenRouter API communication securely.

## 🎯 Features

- ✅ Secure API key handling
- ✅ Real-time prompt generation
- ✅ Multiple style options
- ✅ Copy to clipboard functionality
- ✅ Responsive design
- ✅ Error handling and user feedback
- ✅ Character counting and validation 