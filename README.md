# SHUATSPHERE

A Reddit-like community app for SHUATS students with Spheres, posts, comments, messaging, and more.

## Features

- 🔐 Login with @shiats.edu.in only
- 🌐 Spheres (Communities) - join/create
- 📝 Posts - text, image, link
- 👍 Boost (upvote) / 👎 Bury (downvote)
- 💬 Threaded comments
- 💭 Whispers (DMs)
- 🔔 Notifications
- 👤 User profiles with Aura score
- 🏆 Badges system
- 🌙 Dark/Light theme (auto)
- 📱 PWA support

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui components
- **Backend**: FastAPI + MongoDB
- **Storage**: Cloudinary
- **Mobile**: Capacitor (Android/iOS)
- **Deployment**: Vercel (frontend) + Render (backend)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Backend Setup

```bash
cd server
pip install -r requirements.txt
# Configure .env with your MongoDB URI and Cloudinary keys
uvicorn main:app --reload
```

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Set `VITE_API_URL` to your backend URL

### Backend (Render/Railway)
1. Create new Python service
2. Connect to your MongoDB Atlas
3. Set environment variables

### Android App
```bash
npm run build
npx cap sync android
npx cap open android
```

## Auto-Updates (OTA)

The app uses GitHub Releases for automatic updates:
1. Every push to main triggers a new build
2. APK is uploaded to GitHub Releases
3. App checks for updates on startup
4. Users get prompt to update automatically

## License

MIT