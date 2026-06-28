# Lotus Divine Visions — Full-Stack Booking & Management Portal

Welcome to the **Lotus Divine Visions** hotel direct reservation system. This project features a modern, ultra-secure Next.js 15 App Router frontend paired with a decoupled Express Node.js backend microservice connected to MongoDB.

---

## 1. Project Architecture

This application follows a decoupled, double-tier microservice architecture:

```
                  ┌──────────────────────────────┐
                  │      Next.js Frontend        │
                  │       (localhost:3000)       │
                  └──────────────┬───────────────┘
                                 │
                    HTTPS Requests (E2EE Envelopes)
                                 │
                  ┌──────────────▼───────────────┐
                  │       Express Backend        │
                  │       (localhost:5001)       │
                  └──────────────┬───────────────┘
                                 │
                        Mongoose Connection
                                 │
                  ┌──────────────▼───────────────┐
                  │         MongoDB              │
                  │       (Database Collection)  │
                  └──────────────────────────────┘
```

### Next.js Frontend (client-side)

- Built on **Next.js 15** with App Router.
- Uses client-side Web Crypto API for native cryptographic encryption.
- Dynamically fetches room lists and prices on mount, falling back to static structures if the server is offline.

### Node.js Backend Microservice

- Built on **Express** and **Mongoose**.
- Handles session nonces, payload decryption, request verification, and data persistence.
- Auto-seeds clean databases with default hotel rooms (`Deluxe Room` and `Family Suite`) on startup.

---

## 2. Cybersecurity & Encryption (E2EE)

To protect reservations from request interception, eavesdropping, and replay attacks, we implement a hybrid cryptographic envelope scheme:

1. **RSA Handshake**: The server generates a 2048-bit RSA key pair on startup. When a guest opens the booking form, the client requests the public key and a single-use `nonceId` (GET `/api/security/key`).
2. **Payload Envelope (AES-GCM)**:
   - Client generates a cryptographically random 256-bit AES symmetric key and 12-byte IV.
   - Client packages the booking payload, adding the `nonceId` and a millisecond `timestamp`.
   - Encrypts this combined payload with the AES key.
   - Encrypts the AES key with the server's public RSA key.
3. **Decryption and Verification**:
   - Server decrypts the AES key using its private RSA key.
   - Decrypts the payload envelope using the AES key.
   - **Replay Protection**: Verifies that the payload `nonce` matches the cached token. Once verified, the nonce is deleted, preventing any identical request replay.
   - **Staleness Checks**: Verifies that the client's payload `timestamp` is fresh (within 60 seconds of the server's clock).
4. **Hardening**:
   - **Helmet Middleware**: Configures secure HTTP headers to prevent XSS, clickjacking, and mime-type sniffing.
   - **Strict Rate Limiting**: Global requests are capped at 100 per 15 minutes, and booking submissions are strictly throttled to 10 attempts per 10 minutes per IP.

---

## 3. The Admin Dashboard

The Admin Dashboard provides hotel managers with direct booking controls and dynamic room inventory management.

### Accessing the Dashboard

- **URL**: Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
- If no active session token is present, you are redirected to the login gate (`/admin/login`).
- **Default Login Password**: `lotusadmin123` (Configure via `ADMIN_PASSWORD` in `backend/.env`).

### Stateless Session Authentication

- Upon logging in, the server generates an HMAC-signed session token using the admin password as the secret key.
- The token is stateless, containing an expiration timestamp (12-hour TTL).
- The token is stored in the client's `localStorage` and sent in the `Authorization: Bearer <token>` header on all admin APIs.

### Curing & Uploading Rooms

1. **Navigate to the "Room Curation" Tab** on the dashboard.
2. Fill in the room metadata (Name, Category, Description, Size, Capacity, Price, and Amenities).
3. **Image Upload Procedure**:
   - Click the "Select Image File" placeholder.
   - Select a local `.jpg`, `.jpeg`, `.png`, or `.webp` image.
   - The browser encodes the image file as a Base64 string and POSTs it securely to `/api/admin/upload`.
   - The server validates it and returns it back directly to the client, which stores the inline Base64 string in MongoDB under `imageUrl`.
   - This eliminates local disk writes, ensuring dynamic uploaded images are **never lost** when the server restarts or when deployed to ephemeral serverless containers (like Vercel).
4. Click **Create Room**. The room will immediately appear on the hotel website home page, rooms page, and choice selections in the booking form.

---

## 4. Setup & Installation

### 1. Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally (`mongodb://localhost:27017/lotus`) or a MongoDB Atlas URI.

### 2. Environment Configurations

#### Backend (`backend/.env`)

Create a `.env` file inside the `backend/` folder:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lotus-visions
ADMIN_PASSWORD=lotusadmin123
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

#### Frontend (`.env` or root context)

No special environment configuration is required for development. The client defaults to querying the backend at `http://localhost:5001`.

---

## 5. Available Scripts

All scripts are executed from the root of the project:

### Running in Development (Concurrent)

Start both Next.js frontend (port `3000`) and Node.js backend (port `5001`) simultaneously:

```bash
npm run dev
```

### Production Build

Build the optimized Next.js production bundle:

```bash
npm run build
```

### Formatting

Run the code formatter (Prettier) to format all files according to code standards:

```bash
npm run format
```
