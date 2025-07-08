# FlockShop.ai – Shared Wishlist App

A collaborative, real-time wishlist app for group shopping, built as a full-stack assignment.

## Features

- User signup/login (Firebase Auth)
- Create, edit, delete wishlists
- Add, edit, remove products (name, image URL, price)
- Invite others to wishlists (mock)
- Show who added/edited each item
- Comments and emoji reactions on products
- Responsive, mobile-friendly UI
- Protected routes and clean UX

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Firebase Auth
- **Backend:** Node.js, Express, Firebase Admin SDK
- **Database:** Firebase Firestore

## Setup Instructions

### 1. Clone and Install

```
git clone <your-repo-url>
cd AIproject
cd backend && npm install
cd ../frontend && npm install
```

### 2. Firebase Setup

- Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
- Enable **Authentication** (Email/Password)
- Create a **Firestore** database
- Download your **service account JSON** and add it to `/backend/.env` as `FIREBASE_SERVICE_ACCOUNT_KEY`
- Set your `FIREBASE_PROJECT_ID` in `/backend/.env`
- Add your Firebase web config to `/frontend/src/firebase.js`

### 3. Run the App

- **Backend:**
  ```
  cd backend
  node index.js
  ```
- **Frontend:**
  ```
  cd frontend
  npm run dev
  ```
- Open the local URL (e.g., `http://localhost:5173`)

## Usage & Testing

- Sign up and log in
- Create wishlists, add/edit/remove products
- Invite users (mock), see members
- Add comments and emoji reactions to products
- Logout/login, test protected routes
- Check Firebase Console for users and data
- Test on mobile for responsiveness

## Scaling & Improvements

- Use real-time sync (e.g., Firebase Realtime DB or Socket.IO)
- Real email invites and user search
- Granular permissions (owner, editor, viewer)
- Better error handling and notifications
- UI/UX polish and accessibility improvements
-

## Assumptions & Limitations

- Invite is mocked (no real email/user lookup)
- No advanced permissions (all members can edit)
- No file/image uploads (image URL only)

---
