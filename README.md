# Student Event Score Backend

A Node.js + Express backend for storing student scores in events with admin login and result APIs.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm run dev
```

## API routes

### Admin

- `POST /api/admin/register` - create an admin account
  - body: `{ "email": "admin@example.com", "password": "secret" }`
- `POST /api/admin/login` - login and receive a JWT
  - body: `{ "email": "admin@example.com", "password": "secret" }`
  - response: `{ "token": "..." }`

### Scores

- `POST /api/scores` - upload a score (admin only)
  - headers: `Authorization: Bearer <token>`
  - body: `{ "studentName": "Jane Doe", "eventName": "Math Quiz", "eventType": "individual", "point": 92, "prize": "1st", "batch": "2024-A", "eventDate": "2026-04-22" }`
  - `eventType` must be either `"group"` or `"individual"`
- `GET /api/scores` - get all results
- `GET /api/scores/student/:studentName` - get all scores for a student
- `GET /api/scores/event/:eventName` - get all scores for an event
- `GET /api/scores/:id` - get a single score record by ID
- `GET /api/scores/rankings/batch` - get batch rankings (overall and date-wise)
- `GET /api/scores/rankings/overall` - get overall student rankings across all batches sorted by total points
- `PUT /api/scores/:id` - update a score (admin only)
  - headers: `Authorization: Bearer <token>`
  - body: `{ "studentName": "Jane Doe", "point": 95, ... }` (any field can be updated)
- `DELETE /api/scores/:id` - delete a score (admin only)
  - headers: `Authorization: Bearer <token>`

## Notes

- Use MongoDB Atlas or local MongoDB.
- The admin token is required for score uploads.
