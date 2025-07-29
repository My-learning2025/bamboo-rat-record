# บันทึกข้อมูลหนูไผ่ (Bamboo Rat Record)

เว็บแอปพลิเคชันสำหรับการบันทึกและจัดการข้อมูลหนูไผ่ พัฒนาด้วย React + TypeScript + Material UI

## ฟีเจอร์หลัก

- 🌙 **ธีมมืด** - ปรับปรุงการมองเห็นและลดความเมื่อยล้าของสายตา
- 📱 **Mobile-First Design** - ออกแบบเพื่อใช้งานบนมือถือเป็นหลัก
- 🔍 **ระบบกรองข้อมูล** - กรองข้อมูลตามประเภทต่างๆ
- ➕ **Floating Action Button** - ปุ่มเพิ่มข้อมูลที่ปรับตัวตามการเลื่อนหน้าจอ
- 📊 **การแสดงผลแบบ Grid** - แสดงข้อมูลในรูปแบบ 2 คอลัมน์
- 🎨 **UI สวยงาม** - ใช้ Material UI เพื่อความสวยงามและใช้งานง่าย

## เทคโนโลยีที่ใช้

- **React 18** - JavaScript library สำหรับสร้าง UI
- **TypeScript** - Type-safe JavaScript
- **Material UI (MUI)** - React UI framework
- **Emotion** - CSS-in-JS library

## การติดตั้งและรัน

1. **ติดตั้ง dependencies:**

   ```bash
   npm install
   ```

2. **เริ่มรันแอปพลิเคชัน:**

   ```bash
   npm start
   ```

3. **เปิดเบราว์เซอร์ไปที่:**
   ```
   http://localhost:3000
   ```

## การใช้งาน

### การดูข้อมูล

- ข้อมูลจะแสดงในรูปแบบการ์ด 2 คอลัมน์
- แต่ละการ์ดจะแสดงรหัสของข้อมูล (เช่น A00001, A00002)

### การกรองข้อมูล

- ใช้ dropdown ด้านบนเพื่อเลือกประเภทข้อมูลที่ต้องการแสดง
- ตัวเลือก: ข้อมูลระบบ, รายการทั้งหมด, รายการใหม่

### การเพิ่มข้อมูล

1. กดปุ่ม **+** (Floating Action Button) ที่มุมขวาล่าง
2. ใส่รหัสข้อมูลในฟอร์ม
3. กด "เพิ่มข้อมูล" เพื่อบันทึก

### การโต้ตอบกับ FAB

- ปุ่ม FAB จะซ่อนตัวเมื่อเลื่อนหน้าจอลง
- จะแสดงกลับมาเมื่อเลื่อนหน้าจอขึ้น
- ใช้ Fade animation เพื่อความนุ่มนวล

## โครงสร้างโปรเจ็กต์

```
src/
├── App.tsx              # Main component
├── AddRecordModal.tsx   # Modal สำหรับเพิ่มข้อมูล
├── index.tsx           # Entry point
├── index.css          # Global styles
└── ...
```

## การปรับแต่ง

### เปลี่ยนสีธีม

แก้ไขใน `App.tsx` ที่ `createTheme()`:

```typescript
const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#90caf9", // เปลี่ยนสีหลัก
    },
    // ...
  },
});
```

### เพิ่มข้อมูลเริ่มต้น

แก้ไขใน `App.tsx` ที่ `initialRecordData`:

```typescript
const initialRecordData = [
  { id: "A00001", status: "active" },
  // เพิ่มข้อมูลเพิ่มเติม...
];
```

## การ Build สำหรับ Production

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ในโฟลเดอร์ `build/`

## ฟีเจอร์ที่จะพัฒนาต่อ

- [ ] การค้นหาข้อมูล
- [ ] การแก้ไขข้อมูล
- [ ] การลบข้อมูล
- [ ] การบันทึกข้อมูลใน Local Storage
- [ ] การ Export ข้อมูล
- [ ] การ Import ข้อมูล

## License

This project is licensed under the MIT License.
