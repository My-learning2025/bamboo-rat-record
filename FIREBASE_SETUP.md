# Firebase Setup Instructions

## ขั้นตอนการติดตั้ง Firebase

### 1. สร้าง Firebase Project

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Add project" หรือ "เพิ่มโปรเจกต์"
3. ตั้งชื่อโปรเจกต์ เช่น "bamboo-rat-record"
4. เลือกการตั้งค่าตามต้องการ
5. คลิก "Create project"

### 2. เพิ่ม Web App

1. ในหน้า Project Overview คลิกไอคอน `</>`
2. ตั้งชื่อ App เช่น "Bamboo Rat Record Web"
3. คลิก "Register app"
4. คัดลอก Firebase configuration

### 3. เปิดใช้งาน Firestore Database

1. ไปที่ "Firestore Database" ในเมนูด้านซ้าย
2. คลิก "Create database"
3. เลือก "Start in test mode" (สำหรับการพัฒนา)
4. เลือก location ที่ใกล้ที่สุด เช่น "asia-southeast1"

### 4. กำหนดค่า Environment Variables

แก้ไขไฟล์ `.env` และใส่ค่าจาก Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-actual-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
REACT_APP_FIREBASE_APP_ID=your-actual-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id
```

### 5. Firestore Security Rules (สำหรับ Production)

ไปที่ Firestore Database > Rules และใส่:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // อนุญาตให้อ่านและเขียนได้ทุกคน (สำหรับการพัฒนา)
    match /{document=**} {
      allow read, write: if true;
    }

    // สำหรับ Production ให้ใช้:
    // match /bamboo_rat_records/{document} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

### 6. Collection Structure

ข้อมูลจะถูกเก็บใน collection ชื่อ `bamboo_rat_records` ด้วยโครงสร้าง:

```javascript
{
id: "tpdrOS0ujp7fCElSdERV", // รหัสหนูไผ่ (Firebase auto-generated document ID)
name:"A0001", // ชื่อ/รหัสหนูไผ่
status:"ປະສົມ", // สถานะ: ປະສົມ, ຖືພາ, ລ້ຽງລູກ, ພັກຟື້ນ
owner: "Tay", // เจ้าของ
breedingDate: "01/01/2024", // วันผสมพันธุ์
birthDate: "01/01/2024", // วันเกิด
separation_date: "01/01/2024", // วันที่แยกออกจากแม่
estrus_date: "01/03/2024", // วันดิ้นเอา
createdAt: Timestamp, // วันที่สร้างข้อมูล
updatedAt: Timestamp // วันที่แก้ไขล่าสุด
}
```

### 7. การทดสอบ

1. เริ่มต้น development server: `npm start`
2. ลองเพิ่มข้อมูลใหม่
3. ตรวจสอบใน Firebase Console ว่าข้อมูลถูกเพิ่มเข้าไปหรือไม่

### 8. การ Deploy

1. Build โปรเจกต์: `npm run build`
2. ติดตั้ง Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Initialize: `firebase init hosting`
5. Deploy: `firebase deploy`

## หมายเหตุ

- ไฟล์ `.env` ไม่ควรถูก commit ลง git (ไฟล์นี้อยู่ใน .gitignore แล้ว)
- สำหรับ Production ควรใช้ Firebase Security Rules ที่เข้มงวดกว่านี้
- ควรเปิดใช้งาน Authentication ก่อนนำไปใช้งานจริง

```

```
