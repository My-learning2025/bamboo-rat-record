// ทดสอบการเชื่อมต่อ Firebase และดึงข้อมูล
import { getAllRecords } from './firebaseService';

// ฟังก์ชันทดสอบ
async function testFirebaseConnection() {
    console.log('🔥 เริ่มทดสอบการเชื่อมต่อ Firebase...');

    try {
        // ทดสอบดึงข้อมูลทั้งหมด
        const records = await getAllRecords();
        console.log('✅ เชื่อมต่อ Firebase สำเร็จ!');
        console.log(`📊 พบข้อมูลทั้งหมด: ${records.length} รายการ`);

        // แสดงข้อมูลรายการแรก (ถ้ามี)
        if (records.length > 0) {
            console.log('📋 ตัวอย่างข้อมูล:');
            console.log(records[0]);
        }

        return records;
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ Firebase:', error);
        throw error;
    }
}

// Export เพื่อใช้งาน
export { testFirebaseConnection };
