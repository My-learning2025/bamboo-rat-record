@echo off
echo ================================================
echo Firebase Hosting Deployment Script
echo ================================================
echo.

echo Step 1: Building React application...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Firebase Hosting...
echo Make sure you have:
echo - Firebase CLI installed: npm install -g firebase-tools
echo - Logged in to Firebase: firebase login
echo - Updated .firebaserc with correct project ID
echo.

set /p confirm="Continue with deployment? (y/n): "
if /i "%confirm%" neq "y" (
    echo Deployment cancelled.
    pause
    exit /b 0
)

echo Deploying to Firebase...
firebase deploy --only hosting

if %ERRORLEVEL% neq 0 (
    echo Deployment failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ================================================
echo Deployment completed successfully!
echo ================================================
echo Your app should be available at:
echo https://YOUR-PROJECT-ID.web.app
echo https://YOUR-PROJECT-ID.firebaseapp.com
echo.
pause
