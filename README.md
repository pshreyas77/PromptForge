# PromptForge AI Studio 🚀

<div align="center">

**Context-aware prompt engineering for sophisticated LLM interactions**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Security](#-security)

</div>

---

## 📖 Overview

PromptForge AI is a powerful prompt engineering tool that helps you create, optimize, and manage prompts for Large Language Models. Built with React, TypeScript, and powered by Google's Gemini AI, it features secure OAuth authentication and a beautiful, responsive interface.

### ✨ Key Highlights

- 🎯 **AI-Powered Prompt Generation** - Generate optimized prompts using Gemini 2.5 Flash
- 🔐 **Secure OAuth Authentication** - Google & GitHub login with enterprise-grade security
- 🎨 **Beautiful UI** - Modern, responsive design with dark/light themes
- 📱 **Mobile-First** - Optimized for all devices (iOS, Android, Windows)
- 🧠 **Custom Training** - Train the model with your own examples
- 📜 **History Management** - Save and revisit your prompt generations
- ⚡ **Real-time Generation** - Fast, streaming responses
- 🛡️ **Production-Ready** - Built with security best practices

---

## 🎯 Features

### Prompt Engineering

- **Generate Mode** - Create new prompts from simple ideas
- **Improve Mode** - Enhance existing prompts
- **Persona Selection** - Choose from Marketer, Developer, Teacher, CEO, and more
- **Tone Control** - Professional, Creative, Persuasive, Academic, Casual
- **Length Options** - Concise, Medium, Detailed, Comprehensive

### Authentication & Security

- ✅ Google OAuth 2.0 integration
- ✅ GitHub OAuth 2.0 integration
- ✅ Secure session management
- ✅ HttpOnly cookies (XSS protection)
- ✅ Rate limiting (DDoS protection)
- ✅ CORS protection
- ✅ Security headers (Helmet.js)

### User Experience

- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 💾 Local history storage
- 🎨 3D spotlight effects
- ⚡ Smooth animations
- 📋 One-click copy to clipboard

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- OAuth credentials (optional, for authentication)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/pshreyas77/PromptForge.git
cd PromptForge
```

2. **Install dependencies**

```bash
npm install
cd server
npm install
cd ..
```

3. **Configure environment variables**

   Frontend (`.env.local`):

```env
GEMINI_API_KEY=your-gemini-api-key
VITE_API_URL=http://localhost:3001/api
```

   Backend (`server/.env`):

```env
NODE_ENV=development
PORT=3001
SESSION_SECRET=your-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
CLIENT_URL=http://localhost:3000
```

4. **Start the application**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

5. **Open your browser**

```
http://localhost:3000
```

---

## 📚 Documentation

For detailed setup and configuration, please refer to:

- **README.md** - This file contains all essential documentation
- **SECURITY.md** - Security policies and best practices
- **.env.example** - Environment variable templates

---

## 🛡️ Security

PromptForge AI is built with security as a top priority:

- **OAuth 2.0** - No password storage, delegated authentication
- **Session Security** - HttpOnly, Secure, SameSite cookies
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Whitelist-based origin control
- **Security Headers** - CSP, XSS protection, clickjacking prevention
- **Environment Variables** - Secrets never committed to code

See [SECURITY.md](SECURITY.md) for complete security documentation.

---

## 🏗️ Tech Stack

### Frontend

- **React 19.2** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend

- **Express.js 4.18** - Web framework
- **Passport.js** - Authentication
- **Helmet.js** - Security headers
- **Express Session** - Session management
- **Express Rate Limit** - Rate limiting

### AI

- **Google Gemini 2.5 Flash** - Prompt generation

---

## 📁 Project Structure

```
PromptForge/
├── components/           # React components
│   ├── AuthModal.tsx
│   ├── HistorySidebar.tsx
│   ├── MagicButton.tsx
│   └── ...
├── services/             # API services
│   ├── authService.ts
│   └── geminiService.ts
├── server/               # Backend API
│   ├── index.js
│   └── package.json
├── App.tsx               # Main app component
├── types.ts              # TypeScript types
└── ...
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI model
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">

Made with ❤️ by the PromptForge Team

⭐ [Star this repo](https://github.com/pshreyas77/PromptForge) if you find it helpful!

</div>
