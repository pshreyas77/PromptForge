# 🚀 Quick Start Guide

## 1️⃣ Get OAuth Credentials (5 minutes)

### Google OAuth:
1. Go to https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth Client ID (Web application)
4. Add redirect URI: `http://localhost:3001/api/auth/google/callback`
5. Copy Client ID & Secret

### GitHub OAuth:
1. Go to https://github.com/settings/developers
2. New OAuth App
3. Callback URL: `http://localhost:3001/api/auth/github/callback`
4. Copy Client ID & Secret

---

## 2️⃣ Configure Environment (2 minutes)

### Backend (`server/.env`):
```env
GOOGLE_CLIENT_ID=paste-here
GOOGLE_CLIENT_SECRET=paste-here
GITHUB_CLIENT_ID=paste-here
GITHUB_CLIENT_SECRET=paste-here
SESSION_SECRET=any-random-string
CLIENT_URL=http://localhost:3000
```

### Frontend (`.env.local`):
```env
GEMINI_API_KEY=your-existing-key
VITE_API_URL=http://localhost:3001/api
```

---

## 3️⃣ Install & Run (2 minutes)

```bash
# Install backend
cd server
npm install

# Start backend (keep running)
npm run dev

# In new terminal - start frontend
cd ..
npm run dev
```

---

## 4️⃣ Test (1 minute)

1. Open http://localhost:3000
2. Click "Sign In"
3. Try "Continue with Google" or "Continue with GitHub"
4. ✅ You're logged in!

---

## 🆘 Problems?

**"Redirect URI mismatch"**
→ Check OAuth app settings match exactly: `http://localhost:3001/api/auth/google/callback`

**"CORS error"**
→ Ensure `CLIENT_URL=http://localhost:3000` in `server/.env`

**"Invalid client"**
→ Double-check Client ID and Secret (no extra spaces)

---

## 📚 Full Documentation

- **Detailed OAuth Setup:** `SETUP_OAUTH.md`
- **Security Guide:** `SECURITY.md`
- **Complete README:** `README_AUTH.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`

---

**Total Setup Time: ~10 minutes** ⏱️
