// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// ปิดการใช้งาน Analytics ชั่วคราว - ไม่ import เลย
// import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration (ปิด Analytics ชั่วคราว)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
    // ไม่ใส่ measurementId เพื่อหลีกเลี่ยง Analytics
};
console.log('📋 Firebase Config:', firebaseConfig);
// Check if all required environment variables are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Firebase configuration error: Missing environment variables');
    console.log('📋 Please check your .env file and ensure it contains:');
    console.log('   - REACT_APP_FIREBASE_API_KEY');
    console.log('   - REACT_APP_FIREBASE_PROJECT_ID');
    console.log('   - และตัวแปรอื่นๆ ที่จำเป็น');
    console.log('🔧 Restart the development server after updating .env');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics ปิดการใช้งานชั่วคราวเพื่อหลีกเลี่ยงข้อผิดพลาด
// export const analytics = getAnalytics(app);

export default app;
