# MoneyMind Dual Arcade

**By Ekam Group**

A dual-game Android application with real money earning capabilities.

## Features
- Two engaging games: Money Rain & Color Trap
- Multi-language support (English, Hindi, Punjabi, Urdu, Spanish, Arabic)
- Real ad integration (Start.io & Unity Ads)
- Wallet system with withdrawal functionality
- Admin panel for user management
- Unlimited levels with progressive difficulty

## Setup Instructions

1. Replace Firebase config in `www/firebase-config.js` with your actual Firebase credentials
2. Replace Unity Game ID in `www/js/ads.js` with your actual Unity Game ID
3. Start.io App ID is already configured: 208449971
4. Upload to GitHub and let Actions build the APK

## Build Locally
```bash
npm install
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
