# Security Policy

## Environment Variables

All sensitive configuration should be stored in `.env` files, which are **never** committed to the repository.

### Setup Instructions

1. **Backend Setup**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and fill in your actual credentials
   ```

2. **Frontend Setup**
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env and fill in your configuration
   ```

### Protected Secrets

Never commit the following to the repository:
- `SUPABASE_URL` and `SUPABASE_KEY` (database credentials)
- `JWT_SECRET` (authentication secret)
- `IMAGEKIT_PRIVATE_KEY` (private keys)
- `SMTP_PASS` (email service password)
- `AZURE_API_KEY` (AI service keys)
- `FIRECRAWL_API_KEY` (web scraping API key)
- Any other API keys or authentication tokens

### .gitignore Configuration

The repository includes proper `.gitignore` configuration that prevents accidental commits:
- `.env` files are ignored
- `.env.local` files are ignored
- `.env.*.local` files are ignored
- No credentials are ever tracked by git

### Verification

To verify no secrets are committed:
```bash
# Check git history for secrets (if needed)
git log -p | grep -E "SUPABASE_KEY|JWT_SECRET|IMAGEKIT_PRIVATE_KEY"
```

All variables should reference `process.env.*` in code, never hardcoded values.

### Production Deployment

For production:
1. Use your hosting platform's environment variable management (Render, Railway, Vercel, etc.)
2. Set strong, unique values for all secrets
3. Rotate API keys regularly
4. Never share `.env` files with others
5. Use different credentials for development and production

## Reporting Security Issues

If you discover a security vulnerability, please email security@choiceproperties.com instead of using the issue tracker.
