# SquadUp

SquadUp is a web application designed for Rainbow Six Siege players to easily find teammates. Users can create squad posts, browse active requests, filter by platform, rank, region, game mode, and language, and connect with players who match their preferred playstyle.


**[View live demo](https://squad-up-eta.vercel.app/)**

---

## Features

### Authentication & account
- Registration and login with JWT, passwords hashed with bcrypt
- Mandatory email verification before first login
- Password recovery by email, with single-use, expiring tokens
- Real-time password strength validation (letters, numbers, length)
- Rate limiting on sensitive endpoints (registration, login, password recovery)
- Reset/verification tokens stored as hashes in the database

### Profile
- Edit username, platform, rank, bio, Ubisoft ID, and avatar
- Searchable preferred operators selection, with a configurable limit
- Public (read-only) profile for other users to view, with a direct link to stats on R6 Tracker
- History of your own squad posts, with pagination

### Squad posts
- Create requests with platform, region, rank, game mode, language, mic requirement, and number of players needed
- Edit and delete your own posts
- Limit on posts created per hour, to prevent spam
- Posts automatically expire from the general search 1 hour after creation
- Validation to prevent opening more slots than the squad's actual capacity

### Search
- Combinable filters by platform, region, rank, game mode, language, and mic requirement
- Text search (username or description)
- Sort by most recent, fewest players needed, or closest to the user's rank
- Pagination

### Notifications
- Join requests with accept/decline directly in the notification
- Notification back to the requester, letting them know if they were accepted or declined
- Removal ("kick") of already-accepted members, with automatic notification
- In-browser toast + sound when a new notification arrives, without needing to open the menu

---

## Tech stack

**Frontend**
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Custom components, no heavy UI kit

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- JWT for authentication, bcrypt for passwords
- Zod for data validation
- Nodemailer for transactional emails (verification and password recovery)
- express-rate-limit for abuse protection
- Helmet for HTTP security headers

**Infrastructure**
- Database hosted on [Neon](https://neon.tech) (serverless PostgreSQL)

---

## Architecture

```
SquadUp/
├── SquadUp/              # Frontend (Next.js)
│   ├── app/               # Pages (App Router)
│   ├── components/        # Reusable components
│   └── lib/                # Helpers, types, API calls
│
└── server/                # Backend (Express)
    ├── prisma/             # Database schema and migrations
    └── src/
        ├── routes/          # Endpoint definitions
        ├── controllers/     # Business logic
        ├── middleware/      # Auth, rate limiting, error handling
        ├── schemas/         # Validation with Zod
        └── lib/              # Prisma client, email sending
```

The frontend communicates with the backend via a REST API (`/api/...`). Authentication uses a JWT sent in the `Authorization: Bearer <token>` header, stored in the browser's `localStorage`.

---

## Data model

- **User** — account, profile, preferences, security tokens
- **SquadPost** — squad requests, linked to a `User`
- **Notification** — join requests and their responses, linking two users and optionally a `SquadPost`

---

## Running the project locally

### Prerequisites
- Node.js 20+
- A PostgreSQL database (local or a service like [Neon](https://neon.tech))
- An email account with an "App Password" enabled (for transactional emails)

### Backend

```bash
cd server
npm install
```

Create a `.env` file with:
```
DATABASE_URL="postgresql://..."
JWT_SECRET="a-long-random-string"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=youremail@gmail.com
SMTP_PASS=<app-password>
FRONTEND_URL=http://localhost:3000
PORT=4000
```

```bash
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd SquadUp
npm install
```

Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

---

## Design decisions

- **Post rank vs. owner's rank** - a `SquadPost`'s `rank` field represents the rank required for the squad, independent of the creator's personal rank, allowing for mixed-rank requests.
- **Notifications without WebSockets** - I chose polling (every 15s) instead of WebSockets/Server-Sent Events, since it's sufficient for the expected volume and simpler to maintain; documented as a possible future improvement (Web Push).
- **Hashed security tokens** - password reset and email verification tokens are never stored in plain text in the database, only their SHA-256 hash, to limit the impact of a potential data breach.

---

## Possible future improvements

- Real Web Push (notifications even with the app closed)
- Player review system
- Automated tests (Jest/Vitest)
- Migrating the JWT from `localStorage` to `httpOnly` cookies

---

## Author

Built by André Marques as a portfolio project.
