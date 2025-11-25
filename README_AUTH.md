# PromptForge AI - Authentication Setup

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
npm install
```

### 2. Configure OAuth (Required)

Follow the detailed guide in `SETUP_OAUTH.md` to:
- Create Google OAuth credentials
- Create GitHub OAuth credentials
- Set up environment variables

### 3. Set Environment Variables

**Backend (`server/.env`):**
```env
NODE_ENV=development
PORT=3001
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000

SESSION_SECRET=your-random-secret-here

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Frontend (`.env.local`):**
```env
GEMINI_API_KEY=your-gemini-api-key
VITE_API_URL=http://localhost:3001/api
```

### 4. Run the Application

**Option A: Using the start script (Windows)**
```bash
start-dev.bat
```

**Option B: Manual start**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

---

## 🔐 Security Features

### ✅ Implemented Security Measures:

1. **OAuth 2.0 Authentication**
   - Google OAuth integration
   - GitHub OAuth integration
   - Secure token handling

2. **Session Security**
   - HttpOnly cookies
   - Secure cookies in production
   - SameSite CSRF protection
   - 24-hour session expiration

3. **HTTP Security Headers**
   - Content Security Policy
   - XSS Protection
   - Clickjacking prevention
   - MIME type sniffing prevention

4. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents brute force attacks
   - DDoS mitigation

5. **CORS Protection**
   - Whitelist specific origins
   - Credential support
   - Method restrictions

6. **Environment Security**
   - Secrets in environment variables
   - .gitignore for sensitive files
   - Separate dev/prod configs

---

## 📁 Project Structure

```
promptforge-ai/
├── server/                    # Backend API
│   ├── index.js              # Express server with OAuth
│   ├── package.json          # Backend dependencies
│   ├── .env.example          # Environment template
│   └── .gitignore            # Ignore sensitive files
├── services/
│   ├── authService.ts        # Frontend auth service
│   └── geminiService.ts      # AI service
├── components/               # React components
├── .env.local               # Frontend environment (not in git)
├── SETUP_OAUTH.md           # OAuth setup guide
├── SECURITY.md              # Security documentation
└── README_AUTH.md           # This file
```

---

## 🔧 API Endpoints

### Authentication Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/github` | Initiate GitHub OAuth |
| GET | `/api/auth/github/callback` | GitHub OAuth callback |
| POST | `/api/auth/email` | Email/password login |
| GET | `/api/auth/user` | Get current user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/health` | Health check |

---

## 🧪 Testing Authentication

### Test Google Login:
1. Click "Sign In" button
2. Select "Continue with Google"
3. Choose your Google account
4. Grant permissions
5. You'll be redirected back to the app

### Test GitHub Login:
1. Click "Sign In" button
2. Select "Continue with GitHub"
3. Authorize the application
4. You'll be redirected back to the app

### Verify Session:
- User info should appear in the header
- Refresh the page - you should stay logged in
- Session persists for 24 hours

---

## 🐛 Troubleshooting

### "Redirect URI mismatch"
**Solution:** Update OAuth app settings to include:
- `http://localhost:3001/api/auth/google/callback`
- `http://localhost:3001/api/auth/github/callback`

### "CORS error"
**Solution:** Ensure `CLIENT_URL` in `server/.env` matches your frontend URL

### "Session not persisting"
**Solution:** 
- Check that cookies are enabled
- Verify `credentials: 'include'` in fetch requests
- Ensure backend and frontend are on same domain/localhost

### "Invalid client"
**Solution:** Double-check your Client ID and Client Secret in `.env`

---

## 🚀 Production Deployment

### Pre-deployment Checklist:

1. **Environment Variables:**
   - [ ] Set `NODE_ENV=production`
   - [ ] Generate strong `SESSION_SECRET`
   - [ ] Update `SERVER_URL` and `CLIENT_URL`

2. **OAuth Configuration:**
   - [ ] Update redirect URIs to production URLs
   - [ ] Use HTTPS URLs only
   - [ ] Verify OAuth app settings

3. **Security:**
   - [ ] Enable HTTPS/SSL
   - [ ] Set `secure: true` for cookies
   - [ ] Implement CSRF tokens
   - [ ] Set up database for sessions
   - [ ] Enable audit logging
   - [ ] Set up monitoring

4. **Infrastructure:**
   - [ ] Use production database
   - [ ] Set up load balancing
   - [ ] Configure CDN
   - [ ] Set up backup systems

See `SECURITY.md` for complete production security checklist.

---

## 📚 Documentation

- **OAuth Setup:** `SETUP_OAUTH.md`
- **Security Guide:** `SECURITY.md`
- **Main README:** `README.md`

---

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `SETUP_OAUTH.md` for detailed setup instructions
3. Check `SECURITY.md` for security-related questions
4. Review server logs for error messages

---

## 📝 License

See LICENSE file for details.
