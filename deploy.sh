#!/bin/bash

echo "================================================"
echo "Firebase Hosting Deployment Script"
echo "================================================"
echo

echo "Step 1: Building React application..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed! Please check the errors above."
    exit 1
fi

echo
echo "Step 2: Deploying to Firebase Hosting..."
echo "Make sure you have:"
echo "- Firebase CLI installed: npm install -g firebase-tools"
echo "- Logged in to Firebase: firebase login"
echo "- Updated .firebaserc with correct project ID"
echo

read -p "Continue with deployment? (y/n): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo "Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo "Deployment failed! Please check the errors above."
    exit 1
fi

echo
echo "================================================"
echo "Deployment completed successfully!"
echo "================================================"
echo "Your app should be available at:"
echo "https://YOUR-PROJECT-ID.web.app"
echo "https://YOUR-PROJECT-ID.firebaseapp.com"
echo
