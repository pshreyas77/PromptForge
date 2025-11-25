# OAuth Setup Guide for PromptForge AI

This guide will help you set up Google and GitHub OAuth authentication for your application.

## Prerequisites

- Node.js installed (v16 or higher)
- A Google Cloud account
- A GitHub account

---

## 1. Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "PromptForge AI" and click "Create"

### Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: PromptForge AI
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue" through the scopes and test users
4. Back to "Create OAuth client ID":
   - Application type: Web application
   - Name: PromptForge Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3001`
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/google/callback`
   - Click "Create"
5. Copy your **Client ID** and **Client Secret**

---

## 2. GitHub OAuth Setup

### Step 1: Register a New OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   - Application name: `PromptForge AI`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3001/api/auth/github/callback`
4. Click "Register application"

### Step 2: Get Credentials

1. After registration, you'll see your **Client ID**
2. Click "Generate a new client secret"
3. Copy your **Client Secret** (you won't be able to see it again!)

---

## 3. Configure Environment Variables

### Backend Configuration

1. Navigate to the `server` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cd server
   cp .env.example .env
   ```

3. Edit `server/.env` and add your credentials:
   ```env
   NODE_ENV=development
   PORT=3001
   SERVER_URL=http://localhost:3001
   CLIENT_URL=http://localhost:3000

   SESSION_SECRET=generate-a-random-string-here

   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here

   GITHUB_CLIENT_ID=your-github-client-id-here
   GITHUB_CLIENT_SECRET=your-github-client-secret-here
   ```

### Frontend Configuration

1. In the root directory, update `.env.local`:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   VITE_API_URL=http://localhost:3001/api
   ```

---

## 4. Install Dependencies and Run

### Install Backend Dependencies

```bash
cd server
npm install
```

### Start the Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Start the Frontend (in a new terminal)

```bash
cd ..
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## 5. Test Authentication

1. Open `http://localhost:3000` in your browser
2. Click "Sign In"
3. Try logging in with Google or GitHub
4. You should be redirected to the OAuth provider, then back to your app

---

## Security Best Practices

### For Development:
- ✅ Use localhost URLs
- ✅ Keep `.env` files out of version control (already in `.gitignore`)
- ✅ Use different credentials for dev and production

### For Production:
- ✅ Use HTTPS URLs only
- ✅ Set `NODE_ENV=production`
- ✅ Use strong, random `SESSION_SECRET` (generate with: `openssl rand -base64 32`)
- ✅ Enable `secure` cookies (automatically done when `NODE_ENV=production`)
- ✅ Update OAuth redirect URIs to your production domain
- ✅ Use environment variables from your hosting provider
- ✅ Implement rate limiting (already included)
- ✅ Add CSRF protection for production
- ✅ Use a proper database instead of in-memory sessions
- ✅ Implement proper password hashing with bcrypt (for email auth)

---

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure your OAuth redirect URIs exactly match what's in your OAuth app settings
- Check for trailing slashes and http vs https

### "Invalid client" error
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces in your `.env` file

### Session not persisting
- Make sure `credentials: 'include'` is set in fetch requests
- Check that cookies are enabled in your browser
- Verify CORS settings allow credentials

### CORS errors
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Check that `credentials: true` is set in CORS config

---

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Passport.js Documentation](http://www.passportjs.org/docs/)

---

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Make sure both frontend and backend servers are running
