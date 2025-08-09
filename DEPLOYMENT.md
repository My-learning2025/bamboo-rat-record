# Firebase Hosting Deployment Guide

## Prerequisites

1. Install Firebase CLI globally:

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

## Setup Firebase Project

### Option 1: Use existing Firebase project

1. Update `.firebaserc` file with your project ID:
   ```json
   {
     "projects": {
       "default": "your-project-id"
     }
   }
   ```

### Option 2: Create new Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Update `.firebaserc` with the new project ID

## Deployment

### Build and Deploy

```bash
# Build and deploy everything
npm run deploy

# Deploy only hosting
npm run deploy:hosting

# Manual deployment
npm run build
firebase deploy --only hosting
```

### First Time Setup (if needed)

```bash
firebase init hosting
```

- Select existing project or create new one
- Choose `build` as public directory
- Configure as single-page app: Yes
- Overwrite index.html: No

## Project Structure

```
├── build/                  # Built files (auto-generated)
├── public/                 # Public assets
├── src/                    # Source code
├── firebase.json          # Firebase configuration
├── .firebaserc           # Firebase project configuration
└── package.json          # Project dependencies and scripts
```

## Configuration Files

### firebase.json

- **public**: "build" - The directory to deploy
- **rewrites**: Single-page app routing
- **headers**: Cache control for performance

### .firebaserc

- Contains your Firebase project ID
- Allows multiple environments (dev, staging, prod)

## Useful Commands

```bash
# Preview locally before deploying
firebase hosting:channel:deploy preview

# View deployment history
firebase hosting:sites:list

# Roll back to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:TARGET_CHANNEL_ID
```

## Environment Variables

Create `.env.production` for production-specific settings:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Add custom domain
3. Follow DNS configuration instructions

## Security Rules

Ensure your Firestore security rules are properly configured in Firebase Console.

## Monitoring

- View hosting metrics in Firebase Console
- Set up performance monitoring
- Configure analytics if needed
