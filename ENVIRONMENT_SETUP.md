# Environment Configuration Guide

This project is configured to work seamlessly in both **localhost development** and **production** environments.

## Frontend Configuration

### Files Structure
- `.env.local` - Development environment (localhost)
- `.env.production` - Production environment (Netlify)

### Environment Variables

**Development (.env.local):**
```
VITE_API_BASE_URL=http://localhost:8070/api
```

**Production (.env.production):**
```
VITE_API_BASE_URL=https://forensic-vault.onrender.com/api
```

### How It Works
1. The frontend uses `import.meta.env.VITE_API_BASE_URL` to dynamically set the API base URL
2. During development (`npm run dev`), Vite uses `.env.local`
3. During production build (`npm run build`), Vite uses `.env.production`
4. Socket connections automatically derive the base URL from the API endpoint

### Frontend Files Updated
- `src/services/api.js` - Uses environment variable for API base URL
- `src/services/socket.js` - Derives socket URL from API base URL

### Running Frontend

**Development (localhost):**
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

**Production Build:**
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Netlify
```

---

## Backend Configuration

### Files Structure
- `.env.local` - Development environment (localhost)
- `.env.production` - Production environment (Render)

### Environment Variables

**Development (.env.local):**
```
NODE_ENV=development
PORT=8070
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/forensic-vault
```

**Production (.env.production):**
```
NODE_ENV=production
PORT=8070
CLIENT_URL=https://forensic-vault.netlify.app
MONGO_URI=your_production_mongodb_uri_here
```

### Configuration Details

| Variable | Development | Production | Purpose |
|----------|-------------|-----------|---------|
| `NODE_ENV` | development | production | Environment mode |
| `PORT` | 8070 | 8070 | Server port |
| `CLIENT_URL` | http://localhost:5173 | https://forensic-vault.netlify.app | CORS origin for frontend |
| `MONGO_URI` | mongodb://localhost:27017/forensic-vault | your_mongodb_uri | MongoDB connection string |

### Backend Files Updated
- `server.js` - Uses environment variables for:
  - CORS origin (Socket.IO)
  - CORS origin (Express middleware)
  - Port configuration

### Running Backend

**Development (localhost):**
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:8070
# CORS accepts requests from http://localhost:5173
```

**Production:**
```bash
cd backend
npm start
# Server runs on port 8070
# CORS accepts requests from https://forensic-vault.netlify.app
```

---

## Deployment Instructions

### Backend Deployment (Render.com)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add environment configuration"
   git push
   ```

2. **On Render Dashboard:**
   - Create a new Web Service
   - Connect your GitHub repository
   - Configure environment variables:
     ```
     NODE_ENV=production
     PORT=8070
     CLIENT_URL=https://forensic-vault.netlify.app
     MONGO_URI=your_mongodb_connection_string
     ```
   - Deploy

### Frontend Deployment (Netlify)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add environment configuration"
   git push
   ```

2. **On Netlify Dashboard:**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: (Netlify uses `.env.production`)
   - Deploy

---

## Important Notes

### Security
- **Never commit `.env` files** - They are already in `.gitignore`
- Keep production MongoDB URIs and secrets in environment variables only
- Don't hardcode sensitive information in the code

### CORS Configuration
- Development: Backend accepts requests from `http://localhost:5173`
- Production: Backend accepts requests from `https://forensic-vault.netlify.app`
- This prevents CORS errors in both environments

### Socket.IO Configuration
- Socket connections use the same environment-based URLs
- Frontend automatically derives socket URL from API base URL
- Both development and production use the same socket connection logic

### Testing the Setup

**Local Development:**
1. Terminal 1: `cd backend && npm run dev`
2. Terminal 2: `cd frontend && npm run dev`
3. Open http://localhost:5173

**Verify Correct URLs:**
- Frontend should connect to http://localhost:8070/api
- Socket should connect to http://localhost:8070
- No CORS errors should appear in browser console

---

## Troubleshooting

### CORS Errors
- Check `.env.local` in backend has correct `CLIENT_URL`
- Ensure frontend URL matches `CLIENT_URL` in backend environment

### API Connection Errors
- Verify `VITE_API_BASE_URL` in `.env.local` (frontend)
- Ensure backend is running on the specified port
- Check network tab in DevTools

### Socket Connection Issues
- Verify socket URL is derived correctly from API base URL
- Check browser console for socket errors
- Ensure backend CORS allows the client URL

---

## Environment Variables Reference

### Frontend (Vite)
```javascript
// Access in code
import.meta.env.VITE_API_BASE_URL
```

### Backend (Node.js)
```javascript
// Access in code
process.env.NODE_ENV
process.env.PORT
process.env.CLIENT_URL
process.env.MONGO_URI
```

---

**Last Updated:** May 2, 2026
