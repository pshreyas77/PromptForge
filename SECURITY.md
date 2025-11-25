# Security Implementation Guide

## Overview

This document outlines the security measures implemented in PromptForge AI and best practices for maintaining security.

---

## 🔐 Authentication Security

### OAuth 2.0 Implementation

**What we've implemented:**
- ✅ OAuth 2.0 flow for Google and GitHub
- ✅ Server-side session management
- ✅ Secure cookie configuration
- ✅ HTTPS enforcement in production
- ✅ Token storage on server-side only

**Security benefits:**
- Users never share passwords with our app
- OAuth tokens are managed by trusted providers
- Automatic token refresh and revocation support
- Multi-factor authentication support (provider-dependent)

### Session Management

```javascript
// Secure session configuration
session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,           // HTTPS only in production
    httpOnly: true,         // Prevents XSS attacks
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    sameSite: 'lax'        // CSRF protection
  }
})
```

**Key features:**
- HttpOnly cookies prevent JavaScript access
- Secure flag ensures HTTPS-only transmission
- SameSite attribute prevents CSRF attacks
- Session expiration after 24 hours

---

## 🛡️ Security Headers (Helmet.js)

We use Helmet.js to set secure HTTP headers:

```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
})
```

**Protection against:**
- ✅ XSS (Cross-Site Scripting)
- ✅ Clickjacking
- ✅ MIME type sniffing
- ✅ Insecure connections

---

## 🚦 Rate Limiting

**Implementation:**
```javascript
rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests, please try again later.'
})
```

**Protects against:**
- Brute force attacks
- DDoS attempts
- API abuse
- Credential stuffing

---

## 🔒 CORS Configuration

**Secure CORS setup:**
```javascript
cors({
  origin: process.env.CLIENT_URL,  // Specific origin only
  credentials: true,                // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

**Security benefits:**
- Only allows requests from your frontend domain
- Prevents unauthorized cross-origin requests
- Supports secure credential transmission

---

## 🔑 Environment Variables

### Critical Variables to Protect:

1. **SESSION_SECRET**
   - Generate: `openssl rand -base64 32`
   - Never commit to version control
   - Rotate regularly in production

2. **OAuth Credentials**
   - GOOGLE_CLIENT_SECRET
   - GITHUB_CLIENT_SECRET
   - Store in secure environment variable service

3. **API Keys**
   - GEMINI_API_KEY
   - Restrict by domain/IP in provider console
   - Monitor usage for anomalies

### Environment Variable Security:
```bash
# ✅ Good - Using environment variables
const secret = process.env.SESSION_SECRET;

# ❌ Bad - Hardcoded secrets
const secret = "my-secret-key-123";
```

---

## 🔐 Password Security (Email Auth)

**For production email/password authentication:**

```javascript
import bcrypt from 'bcrypt';

// Hashing password
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verifying password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Best practices:**
- ✅ Use bcrypt with 12+ salt rounds
- ✅ Never store plain text passwords
- ✅ Implement password strength requirements
- ✅ Add account lockout after failed attempts
- ✅ Implement password reset with secure tokens

---

## 🌐 Production Deployment Checklist

### Before Going Live:

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS everywhere (SSL/TLS certificates)
- [ ] Update OAuth redirect URIs to production URLs
- [ ] Generate strong `SESSION_SECRET`
- [ ] Enable secure cookies (`secure: true`)
- [ ] Set up proper database (not in-memory sessions)
- [ ] Implement database connection pooling
- [ ] Add request logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Implement backup and recovery procedures
- [ ] Add CSRF token protection
- [ ] Enable API key rotation
- [ ] Set up firewall rules
- [ ] Implement IP whitelisting for admin routes
- [ ] Add security headers validation
- [ ] Enable audit logging
- [ ] Set up intrusion detection
- [ ] Implement data encryption at rest
- [ ] Add input validation and sanitization
- [ ] Set up automated security scanning
- [ ] Create incident response plan

---

## 🚨 Common Vulnerabilities & Mitigations

### 1. XSS (Cross-Site Scripting)
**Mitigation:**
- ✅ Content Security Policy headers
- ✅ Input sanitization
- ✅ Output encoding
- ✅ HttpOnly cookies

### 2. CSRF (Cross-Site Request Forgery)
**Mitigation:**
- ✅ SameSite cookie attribute
- ✅ CSRF tokens (add for production)
- ✅ Origin header validation

### 3. SQL Injection
**Mitigation:**
- ✅ Use parameterized queries
- ✅ ORM/query builders
- ✅ Input validation

### 4. Session Hijacking
**Mitigation:**
- ✅ Secure, HttpOnly cookies
- ✅ HTTPS only
- ✅ Session expiration
- ✅ Session regeneration after login

### 5. Man-in-the-Middle (MITM)
**Mitigation:**
- ✅ HTTPS/TLS encryption
- ✅ HSTS headers
- ✅ Certificate pinning

---

## 📊 Security Monitoring

### What to Monitor:

1. **Failed Login Attempts**
   - Track IP addresses
   - Implement temporary bans
   - Alert on suspicious patterns

2. **API Usage**
   - Monitor rate limit hits
   - Track unusual traffic patterns
   - Alert on quota exceeded

3. **Error Rates**
   - Track 4xx/5xx responses
   - Monitor authentication failures
   - Alert on spikes

4. **Session Activity**
   - Track concurrent sessions
   - Monitor session duration
   - Alert on anomalies

---

## 🔄 Regular Security Maintenance

### Weekly:
- Review access logs
- Check for failed authentication attempts
- Monitor API usage patterns

### Monthly:
- Update dependencies (`npm audit fix`)
- Review and rotate API keys
- Check OAuth app permissions
- Review security headers

### Quarterly:
- Rotate SESSION_SECRET
- Security audit of codebase
- Penetration testing
- Review and update security policies

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

## 🆘 Security Incident Response

If you discover a security vulnerability:

1. **Do not** disclose publicly
2. Document the issue in detail
3. Assess the impact and severity
4. Develop and test a fix
5. Deploy the fix immediately
6. Notify affected users if necessary
7. Conduct post-incident review

---

## 📧 Contact

For security concerns or to report vulnerabilities, please contact:
- Email: security@yourcompany.com
- Use responsible disclosure practices
