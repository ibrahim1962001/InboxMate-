# InboxMate / MailGenie Pro

AI-powered Gmail assistant — web app (Phase 1). English & Arabic UI.

**Repository:** [github.com/ibrahim1962001/InboxMate-](https://github.com/ibrahim1962001/InboxMate-)

## Features (Phase 1)

- Google OAuth + Gmail API (read, compose, send)
- AI email drafting (OpenAI optional; fallback template without API key)
- Unified inbox view
- EN / AR interface with RTL
- Subscription requests + manual admin approval
- Admin dashboard for pending payments

## Setup (local)

1. Copy `env.example` to `.env` and fill values.
2. Create [Google Cloud OAuth credentials](https://console.cloud.google.com/):
   - Enable Gmail API
   - OAuth consent screen + Web client
   - Redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Install and migrate:

```bash
npm install --legacy-peer-deps
npm run db:push
npm run dev
```

4. Set `ADMIN_EMAIL` to your Google account email for admin access.

Open [http://localhost:3000/en](http://localhost:3000/en) or `/ar` for Arabic.

### Database

- **Local:** SQLite (`DATABASE_URL="file:./dev.db"`)
- **Production (optional):** [Neon](https://neon.tech) PostgreSQL — use `prisma/schema.postgresql.prisma` and run `npx prisma db push` with Neon connection string

## Roadmap

- Chrome Extension
- iOS / Android (React Native)
- Smart categorization & cleanup rules
- Deploy (Vercel / VPS) when ready
