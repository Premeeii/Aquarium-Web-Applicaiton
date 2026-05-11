# แผนการพัฒนาตู้ปลาแบบโต้ตอบ (Interactive Aquarium Implementation Plan)

เอกสารนี้อธิบายลำดับขั้นตอนการพัฒนาระบบตู้ปลาตรงกลางจอ ให้สามารถแสดงผลปลาที่ผูกกับ Task และตกแต่งตู้ปลาด้วยไอเทมจาก Inventory ได้

---

## Phase 1: เตรียม State Management & Data Types

**เป้าหมาย:** สร้างโครงสร้างข้อมูลและ Store สำหรับจัดการ Layout ของตู้ปลา

1. **กำหนด Type/Interface:**
   - สร้าง Interface สำหรับข้อมูลใน `AquariumLayout` เช่น:
     ```typescript
     interface AquariumItem {
       id: string; // ID ของไอเทมหรือปลา
       type: "decoration" | "fish";
       x: number; // ตำแหน่งแกน X (เป็น %)
       y: number; // ตำแหน่งแกน Y (เป็น %)
       zIndex: number; // ลำดับความลึก
       flipX?: boolean; // หันซ้าย/ขวา
     }
     ```
2. **สร้าง Zustand Store (`useAquariumStore`):**
   - **State:** `layoutItems` (เก็บ Array ของของตกแต่ง), `isEditMode` (เปิด/ปิดโหมดตกแต่ง)
   - **Actions:** `setEditMode`, `updateItemPosition(id, x, y)`, `addItem(item)`, `removeItem(id)`

---

## Phase 2: ปรับโครงสร้าง UI ของตู้ปลา (Aquarium Canvas)

**เป้าหมาย:** เปลี่ยนภาพตู้ปลาแบบ Static ให้เป็นพื้นที่ที่สามารถนำรูปภาพอื่นมาวางซ้อน (Overlay) ได้ตามพิกัด (X, Y)

1. **สร้าง `<AquariumCanvas />` Component:**
   - ใช้คลาส `.aquarium-wrapper` ที่มีอยู่ แต่ตั้งค่าให้มี `position: relative`
   - นำภาพตู้ปลาเดิม (`.aquarium-image`) มาทำเป็นฉากหลัง (Background layer)
2. **สร้าง `<PlacedItem />` Component:**
   - รับ Props เป็น `item` (จาก `AquariumItem` interface)
   - กำหนด CSS เป็น `position: absolute` และใช้ `left: {item.x}%`, `top: {item.y}%` เพื่อระบุตำแหน่งบนตู้ปลาแบบ Responsive
   - ดึงข้อมูลรูปภาพไอเทมจาก Inventory หรือ Backend มาแสดง

---

## Phase 3: เชื่อมระบบ Task เข้ากับการแสดงผลปลา

**เป้าหมาย:** เมื่อ Task ที่ผูกกับปลากำลังทำงาน (In Progress) ให้ปลานั้นปรากฏขึ้นมาในตู้

1. **ดึงข้อมูล Active Tasks:**
   - อ่าน State จาก `useTaskStore` (หรือ Provider ที่คุณใช้)
   - กรองหา Task ที่ `status === 'IN_PROGRESS'` (กำลังทำ) และมี `linkedFishId`
2. **Render ปลาลงในตู้:**
   - นำข้อมูลปลาเหล่านั้นมา map และแสดงผลใน `<AquariumCanvas />` ร่วมกับของตกแต่ง
   - _Optional:_ เขียนฟังก์ชันสุ่มพิกัด (Random X, Y) ตอนปลาเกิด เพื่อไม่ให้ปลาเกิดทับกัน
3. **เพิ่ม Animation (ความมีชีวิตชีวา):**
   - ใช้ `useEffect` ภายใน Component ปลา เพื่ออัปเดตแกน X/Y แบบสุ่มทุกๆ 3-5 วินาที
   - ใช้ CSS `transition: all 3s ease-in-out;` เพื่อให้ปลาค่อยๆ ว่ายไปตำแหน่งใหม่

---

## Phase 4: โหมดตกแต่งตู้ปลา (Decorate Mode & Drag-and-Drop)

**เป้าหมาย:** ผู้ใช้สามารถหยิบของตกแต่งจาก Inventory มาวางและจัดตำแหน่งได้อย่างอิสระ

1. **UI โหมดตกแต่ง:**
   - เพิ่มปุ่ม `[Edit Aquarium]` เพื่อ Toggle `isEditMode` เป็น `true`
   - เมื่อเปิดโหมดนี้ จะแสดงแถบ Inventory ขนาดย่อมด้านล่างจอ ที่แสดงเฉพาะไอเทมประเภท `decoration`
2. **ติดตั้งระบบ Drag and Drop:**
   - แนะนำให้ใช้ไลบรารี `@dnd-kit/core` หรือ HTML5 Drag API ดั้งเดิม
   - **Logic หยิบลงตู้:** เมื่อลากจาก Inventory มาปล่อยที่ Canvas ให้คำนวณตำแหน่งเมาส์ เทียบกับขนาด Canvas เพื่อแปลงเป็นเปอร์เซ็นต์ (X%, Y%) แล้วบันทึกลง Store
   - **Logic จัดตู้:** ของที่อยู่ในตู้อยู่แล้ว สามารถลากเพื่อเปลี่ยนตำแหน่งได้
3. **ลบไอเทม:**
   - ในโหมดตกแต่ง ไอเทมที่วางไปแล้วจะมีปุ่ม `[x]` เพื่อถอดกลับเข้า Inventory

---

## Phase 5: การบันทึกและเชื่อมต่อ Backend API

**เป้าหมาย:** ให้ตำแหน่งการจัดตู้ปลาถูกบันทึกไว้อย่างถาวร

1. **บันทึก Layout:**
   - เมื่อกด `[Save Layout]` (หรือ Auto-save) ให้ส่ง Array ของ `layoutItems` กลับไปยัง Backend
   - Map ข้อมูลให้ตรงกับ Entity `AquariumLayout` ที่ออกแบบไว้
2. **การโหลดข้อมูลตอนเปิดแอป:**
   - เมื่อเข้าแอปพลิเคชัน ให้ยิง API เพื่อขอข้อมูล `AquariumLayout` ของผู้ใช้คนนั้น
   - นำข้อมูลมาเซ็ตเริ่มต้นใน `useAquariumStore`

---

## สรุปเช็กลิสต์การทำงานเบื้องต้น

- [x] 1. สร้าง `useAquariumStore` สำหรับจัดการ State ในส่วน Frontend
- [x] 2. สร้าง Component `<AquariumCanvas>` แทนที่ของเดิม
- [x] 3. ดึง Task ปัจจุบันมาโชว์รูปปลาใน Canvas แบบ Fix ตำแหน่งไปก่อน
- [x] 4. เพิ่ม CSS Transition ให้ปลาสุ่มขยับตำแหน่งได้
- [x] 5. สร้าง UI ปุ่มกดเปิด/ปิด โหมดตกแต่ง
- [x] 6. นำระบบ Drag and Drop เข้ามาใช้ย้ายตำแหน่งของตกแต่ง
- [x] 7. ต่อ API (Axios) เพื่อดึง/บันทึก Layout
