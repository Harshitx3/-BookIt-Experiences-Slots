# BookIt: Experiences & Slots — Fullstack Booking App

**One-line:** A complete end-to-end web application where users can explore travel experiences, view availability, select slots, and complete bookings. Built to evaluate frontend (React + TypeScript + Tailwind) and backend (Node.js + Express/NestJS) skills, API integration, and design fidelity.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Requirements (From brief)](#requirements-from-brief)
5. [High-level Architecture](#high-level-architecture)
6. [API Specification](#api-specification)
7. [Data Models (Example)](#data-models-example)
8. [Database Setup](#database-setup)
9. [Running Locally](#running-locally)
10. [Frontend Implementation Notes](#frontend-implementation-notes)
11. [Backend Implementation Notes](#backend-implementation-notes)
12. [Validation & Concurrency](#validation--concurrency)
13. [Design Fidelity & Figma](#design-fidelity--figma)
14. [Testing](#testing)
15. [Deployment Suggestions](#deployment-suggestions)
16. [Checklist for Reviewers](#checklist-for-reviewers)
17. [License](#license)

---

## Project Overview

This project is a booking system focused on travel experiences (tours, classes, day trips). Users browse experiences, view details (including dates and available slots), choose a slot, checkout (with promo codes), and receive a booking confirmation. The app is intended to test real-world fullstack tasks: API design and consumption, form flows, UX states (loading, failures, sold-out), data validation, and concurrency control (prevent double bookings).

## Tech Stack

* **Frontend:** React + TypeScript (Vite or Next.js recommended), TailwindCSS, Axios or Fetch
* **Backend:** Node.js + Express (or NestJS)
* **Database:** PostgreSQL (recommended) *or* MongoDB / MySQL
* **Authentication:** Optional (email-only or guest flow supported)
* **Testing:** Jest / Supertest for backend, React Testing Library for frontend

## Features

* List experiences on Home page
* Experience Details page with dates & per-date slot availability
* Checkout page to collect user info, promo code, and show price summary
* Result page showing booking success or failure
* Promo code validation (e.g. `SAVE10`, `FLAT100`)
* Prevent double-booking for the same slot
* Responsive UI matching Figma design

## Requirements (From brief)

**Frontend**

* React + TypeScript
* TailwindCSS (mandatory)
* Pages: Home, Details, Checkout, Result
* Responsive, mobile-first, consistent spacing & typography
* Clear feedback states (loading, success, failure, sold-out)
* Use Axios or Fetch; state via React hooks; minimal validation
* Match provided Figma exactly

**Backend**

* Node.js + Express or NestJS
* Database: PostgreSQL / MySQL / MongoDB
* Endpoints: `GET /experiences`, `GET /experiences/:id`, `POST /bookings`, `POST /promo/validate`
* Persist data and validate required fields
* Prevent double-booking for same slot

---

## High-level Architecture

```
[React (Vite/Next)] <--> [REST API (Express)] <--> [Database (Postgres/MongoDB)]
```

* Frontend consumes REST endpoints using Axios.
* Backend enforces business rules and concurrency checks.
* Database stores experiences, slots, and bookings.

---

## API Specification

All responses use JSON. Example success codes use `200`/`201`; client errors `4xx`.

### `GET /experiences`

* Query params (optional): `?limit=20&page=1`, `?search=beach`
* Response: `[{ id, title, shortDescription, thumbnailUrl, priceFrom, rating }]`

### `GET /experiences/:id`

* Response includes: `id, title, description, images[], price, dates[]`
* `dates[]` shape:

```json
{
  "date": "2025-11-15",
  "slots": [
    { "slotId": "s1", "time": "09:00", "capacity": 10, "booked": 3 }
  ]
}
```

### `POST /promo/validate`

* Body: `{ code: string, totalAmount: number }`
* Response: `{ valid: boolean, discountAmount: number, newTotal: number, message: string }`

### `POST /bookings`

* Body (example):

```json
{
  "experienceId": "e123",
  "date": "2025-11-15",
  "slotId": "s1",
  "user": { "name": "A User", "email": "a@x.com", "phone": "+9198..." },
  "promoCode": "SAVE10",
  "amountPaid": 900
}
```

* Responses:

  * `201 Created` with booking details on success
  * `409 Conflict` if slot sold out or concurrent booking conflict
  * `400 Bad Request` if validation fails

---

## Data Models (Example)

### Postgres (relational) — simplified

**experiences**

* id (uuid, pk)
* title
* description
* base_price
* created_at

**slots**

* id (uuid, pk)
* experience_id (fk -> experiences.id)
* date (date)
* time (time)
* capacity (int)
* booked_count (int)

**bookings**

* id (uuid, pk)
* experience_id
* slot_id
* user_name
* user_email
* user_phone
* promo_code
* amount_paid
* status (confirmed, failed)
* created_at

### MongoDB (document) — simplified

`experiences` collection with nested `dates` and `slots` arrays. `bookings` as separate collection linking by id.

---

## Database Setup

### PostgreSQL (recommended)

1. Install Postgres and create a database: `createdb travel_bookings`
2. Run migrations (example using `knex` or `typeorm`/`prisma`):

```sql
CREATE TABLE experiences (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT, description TEXT, base_price NUMERIC, created_at TIMESTAMP DEFAULT now());
CREATE TABLE slots (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE, date DATE, time TIME, capacity INT, booked_count INT DEFAULT 0);
CREATE TABLE bookings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), experience_id UUID, slot_id UUID, user_name TEXT, user_email TEXT, user_phone TEXT, promo_code TEXT, amount_paid NUMERIC, status TEXT, created_at TIMESTAMP DEFAULT now());
```

### MongoDB

Use `mongoose` schemas. No migrations required; seed sample data with a script.

---

## Running Locally

> The repo should include `/frontend` and `/backend` directories.

### Backend

1. `cd backend`
2. Copy `.env.example` to `.env` and set values:

```
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/travel_bookings
JWT_SECRET=your_jwt_secret (optional)
```

3. Install & run:

```bash
npm install
npm run dev   # nodemon / ts-node-dev
# or
npm run start # production build
```

4. Optional: Run migrations and seed script: `npm run migrate && npm run seed`

### Frontend

1. `cd frontend`
2. Copy `.env.example` and set `VITE_API_URL=http://localhost:4000`
3. Install & run:

```bash
npm install
npm run dev
# Build
npm run build
```

4. Open `http://localhost:3000` (or the port Vite/Next prints)

---

## Frontend Implementation Notes

* Use **React + TypeScript**. Prefer Vite for faster dev, or Next.js if routing/SSG required.
* Styling must use **TailwindCSS**. Follow the Figma tokens for colors, spacing, and typography.
* Pages to implement:

  * **Home**: Fetch `GET /experiences`. Show card grid with `thumbnail`, `title`, `priceFrom`, `rating`.
  * **Details**: Fetch `GET /experiences/:id`. Show carousel of images, full description, date selector, and slot list with capacities. Disable sold-out slots.
  * **Checkout**: Controlled form for user name, email, phone, optional promo. Validate name (non-empty) and email (regex). Show order summary, apply promo via `POST /promo/validate` before submitting booking.
  * **Result**: Show booking id on success or error message on failure. Provide CTA to view bookings or go back home.
* State management: use local component state and React Context (if needed) — do **not** introduce heavy state libs unless necessary.
* API client: axios instance with baseURL and interceptors for error handling.
* UX: show skeleton loaders for lists and spinners for actions; show inline validation messages; handle 409 conflicts on booking.

---

## Backend Implementation Notes

* Use **Express + TypeScript** (or NestJS). Structure into `routes/controllers/services/models`.

* Implement endpoints described in API spec. Validate incoming requests using `zod`/`joi`/`express-validator`.

* Promo codes: keep a small `promo_codes` table/collection with fields `{ code, type: percent|flat, value, expiresAt, usageLimit }`.

* Booking flow (atomic):

  1. Receive booking request.
  2. Validate payload & promo code.
  3. Start DB transaction:

     * Re-check `slots.capacity - booked_count > 0` for the requested slot.
     * If enough capacity, increment `booked_count` and insert booking record.
     * Commit transaction.
  4. If conflict detected (no capacity), rollback and return `409 Conflict`.

* For MongoDB, use `findOneAndUpdate` with an atomic `$inc` and `query` that ensures `capacity - booked_count > 0`.

* Logging and structured error responses are required for debugging.

---

## Validation & Concurrency

* **Server-side validation**: All required fields, email format, correct slot/existence, positive amount.
* **Prevent double-booking**:

  * Use DB-level transactions and `SELECT ... FOR UPDATE` (Postgres) or atomic updates (MongoDB) to ensure slot capacity checks and updates are atomic.
  * Return `409 Conflict` for attempted bookings when slot capacity has been exhausted between check and commit.

---

## Design Fidelity & Figma

* The frontend **must match** the provided Figma file exactly across desktop and mobile breakpoints. This includes:

  * Spacing scale (tokens)
  * Typography size/weights
  * Color variables
  * Component states (hover, disabled, active)
* Include a `design/` folder with exported assets and the Figma link in the repo README.

---

## Testing

* **Backend**: Unit tests for services and integration tests for APIs using `supertest`. Cover booking flow including concurrency tests.
* **Frontend**: React Testing Library for components, and e2e tests with Playwright or Cypress for core booking flow.

---

## Deployment Suggestions

* **Backend:** Dockerize and deploy to Render/Heroku/AWS Elastic Beanstalk. Use managed Postgres (Heroku Postgres, RDS) or MongoDB Atlas.
* **Frontend:** Vercel (Next) or Netlify / Vercel (Vite) for static hosting.
* Ensure environment variables and DB migrations run in CI pipeline. Add health checks for API.

---

## Checklist for Reviewers

* [ ] Frontend uses React + TypeScript
* [ ] Tailwind used for all styling
* [ ] Pages: Home, Details, Checkout, Result implemented
* [ ] UI matches Figma across breakpoints
* [ ] API integration works end-to-end
* [ ] Promo validation implemented and tested
* [ ] DB persists bookings
* [ ] Race conditions prevented (no double-booking)
* [ ] Proper success/failure/loader states

---

## Sample `.env.example` (frontend)

```
VITE_API_URL=http://localhost:4000
```

## Sample `.env.example` (backend)

```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/travel_bookings
NODE_ENV=development
JWT_SECRET=change_me
```

---

## Next Steps / Recommended Tasks For Developer

1. Seed the DB with 8–12 experiences covering multiple dates and varying slot capacities.
2. Build the frontend pages and implement the detail → checkout → booking flow.
3. Implement backend booking transaction and promo validation.
4. Add e2e tests for the critical path.
5. Polish UI to match Figma exactly and submit for review.

---

## License

MIT

---

If you want, I can also:

* Generate starter repo structure with boilerplate code for frontend and backend.
* Create example seed data and SQL/Mongo scripts.
* Produce a checklist-based grading rubric for reviewers.
