# Environment Setup - Summary of Changes

## ✅ Changes Made

### 1. Frontend Environment Files Created

**`.env.local` (Development)**
```
VITE_API_BASE_URL=http://localhost:8070/api
```

**`.env.production` (Production/Netlify)**
```
VITE_API_BASE_URL=https://forensic-vault.onrender.com/api
```

### 2. Backend Environment Files Created

**`.env.local` (Development)**
```
NODE_ENV=development
PORT=8070
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/forensic-vault
```

**`.env.production` (Production/Render)**
```
NODE_ENV=production
PORT=8070
CLIENT_URL=https://forensic-vault.netlify.app
MONGO_URI=your_production_mongodb_uri_here
```

### 3. Frontend Code Updates

**`frontend/src/services/api.js`**
- Changed from: `baseURL: "http://localhost:8070/api"`
- Changed to: `baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8070/api"`
- Uses environment variable with fallback

**`frontend/src/services/socket.js`**
- Changed from: `const socket = io("http://localhost:8070")`
- Changed to: Dynamic URL based on `VITE_API_BASE_URL`
- Automatically derives socket URL from API base URL

### 4. Backend Code Updates

**`backend/server.js`**
- Socket.IO CORS: Changed to use `process.env.CLIENT_URL || "http://localhost:5173"`
- Express CORS: Changed to use `process.env.CLIENT_URL || "http://localhost:5173"`
- Port: Changed to use `process.env.PORT || 8070`

### 5. .gitignore Updates

**Frontend `.gitignore`**
- Added explicit entries for `.env.local` and `.env.production`

**Backend `.gitignore`**
- Added explicit entries for `.env`, `.env.local`, `.env.production`

---

## 🚀 How to Use

### Development (Localhost)

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # First time only
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # First time only
npm run dev
```

Then open: **http://localhost:5173**

### Production Deployment

**Update Production MongoDB URI:**
Before deploying, update the `MONGO_URI` in `.env.production` files with your actual MongoDB connection string.

**Backend on Render:**
1. Push code to GitHub
2. Create Web Service on Render
3. Add environment variables from `.env.production`
4. Deploy

**Frontend on Netlify:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy (Netlify uses `.env.production` automatically)

---

## 📋 URL Configuration

| Environment | Backend URL | Frontend URL | CORS Origin |
|-------------|------------|-------------|------------|
| Development | http://localhost:8070 | http://localhost:5173 | http://localhost:5173 |
| Production | https://forensic-vault.onrender.com | https://forensic-vault.netlify.app | https://forensic-vault.netlify.app |

---

## ⚠️ Important

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Add production MongoDB URI** before deploying
3. **Test locally first** before deploying to production
4. **Verify CORS configuration** matches your deployment URLs

---

## 🔍 Verification Checklist

- [ ] Frontend starts on http://localhost:5173 with `npm run dev`
- [ ] Backend starts on http://localhost:8070 with `npm run dev`
- [ ] No CORS errors in browser console
- [ ] API calls work correctly
- [ ] Socket connections work correctly
- [ ] Frontend can authenticate and communicate with backend
- [ ] Production MongoDB URI is set in `.env.production`

---

## 📚 Full Documentation

For detailed information, refer to: **ENVIRONMENT_SETUP.md**

---

**Setup completed on:** May 2, 2026
