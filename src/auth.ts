import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

// ฟังก์ชันสำหรับ Sign In แบบ Anonymous
export const signInAnonymous = async (): Promise<User | null> => {
    try {
        const result = await signInAnonymously(auth);
        console.log('✅ ล็อกอินแบบ Anonymous สำเร็จ:', result.user.uid);
        return result.user;
    } catch (error) {
        console.error('❌ ล็อกอินล้มเหลว:', error);
        return null;
    }
};

// ฟังก์ชันตรวจสอบสถานะการล็อกอิน
export const checkAuthState = (): Promise<User | null> => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
};

// Auto sign in ถ้ายังไม่ได้ล็อกอิน
export const ensureAuthenticated = async (): Promise<User | null> => {
    const user = await checkAuthState();
    if (user) {
        console.log('👤 ผู้ใช้ล็อกอินแล้ว:', user.uid);
        return user;
    } else {
        console.log('🔐 กำลังล็อกอินแบบ Anonymous...');
        return await signInAnonymous();
    }
};
