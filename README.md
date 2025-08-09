# Bamboo Rat Record Management System

A mobile-first web application for managing bamboo rat breeding records with Firebase backend.

## Features

- 📱 Mobile-first responsive design
- � Bamboo rat record management
- 🔄 Real-time data synchronization with Firebase
- 📊 Status tracking (ປະສົມ, ຖືພາ, ລ້ຽງລູກ, ພັກຟື້ນ)
- 👥 Multi-owner support
- 📅 Date tracking for breeding, birth, separation, and estrus
- 🗑️ Delete functionality with confirmation
- 🎨 Modern dark theme UI

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth (Anonymous)
- **Hosting**: Firebase Hosting
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase CLI

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd bamboo-rat-record
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Firebase configuration in `src/firebase.ts`

4. Start development server:
   ```bash
   npm start
   ```

## Deployment

### Quick Deploy

```bash
# Windows
./deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Manual
npm run deploy
```

### First Time Setup

1. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Update `.firebaserc` with your Firebase project ID:

   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Build and deploy to Firebase
- `npm run deploy:hosting` - Deploy only hosting
- `npm test` - Run tests
