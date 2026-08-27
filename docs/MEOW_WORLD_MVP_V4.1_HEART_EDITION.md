ผมแนบไฟล์ `MVP V4.1 Heart Edition.md` ให้ครับ

**ขอให้ยึดหลักสำคัญดังนี้:**

ไฟล์นี้มีทั้ง Vision, Architecture และ Roadmap สำหรับอนาคต เพื่อให้คุณเห็นว่าโครงการต้องการเดินไปทางไหน

แต่ **ตอนนี้ยังไม่ต้องสร้างทั้งหมดตามไฟล์**

### Scope ที่ต้องทำตอนนี้เท่านั้น

ทำ **Roadmap 1 — Passport + Life Journey** เป็นแกนหลัก และเพิ่มพื้นที่การใช้งานระดับระบบสำหรับ **Home, Shared Home และ Family** โดยเริ่มจาก foundation ที่ใช้งานได้จริงและไม่ปิดทางต่อยอด

ผู้ใช้ต้องสามารถ:

1. สร้างบัญชี
2. สร้าง Passport ของสัตว์เลี้ยง
3. แก้ไข/ดู Passport
4. สร้าง Life Journey Event
5. แก้ไข/ดู Timeline
6. Login กลับมาแล้วข้อมูลเดิมยังอยู่
7. มี Database ที่เก็บข้อมูลจริงอย่างเป็นระบบ
8. มี Migration สำหรับ Schema
9. มี Backup/Recovery ขั้นพื้นฐาน
10. สามารถให้ผมเริ่มใช้งานกับข้อมูลจริงได้

สำหรับพื้นที่การใช้งานที่เพิ่มเข้ามา ผู้ใช้ต้องสามารถ:

11. เข้าสู่ Home เพื่อเห็นภาพรวมของสัตว์เลี้ยงและกิจกรรมล่าสุด
12. เปิด Shared Home เพื่อดูข้อมูลที่สมาชิกในครอบครัวได้รับอนุญาตให้เข้าถึง
13. จัดการ Family และบทบาท/สิทธิ์ของสมาชิกได้อย่างชัดเจน

การทำงานของ Home, Shared Home และ Family ในรอบนี้ให้เริ่มจากโครงสร้างข้อมูล, ownership,
permission boundary และหน้าจอพื้นฐานที่จำเป็นต่อการใช้งาน โดยยังไม่รวมฟีเจอร์ social,
marketplace หรือ automation ขั้นสูง

### Roadmap 1 Implementation Sequence

1. **Foundation:** ตั้งค่า Supabase, ใช้ migration ของ profiles, pets, Life Journey, families, family_members และ pet_shares พร้อมเปิด RLS
2. **Authentication:** สร้างบัญชี, login, logout และตรวจ session ที่กลับมาใช้งานได้
3. **Home:** แสดงจำนวน Passport, กิจกรรมล่าสุด และทางลัดไปยังสัตว์เลี้ยงแต่ละตัว
4. **Passport:** สร้าง, ดู และแก้ไขข้อมูลสัตว์เลี้ยง โดยข้อมูลเป็น private ของเจ้าของเป็นค่าเริ่มต้น
5. **Life Journey:** เพิ่ม, ดู, แก้ไข และจัดเรียง event ตามวันที่
6. **Family:** สร้างกลุ่ม, เพิ่มสมาชิก และกำหนด role เป็น owner, editor หรือ viewer
7. **Shared Home:** เจ้าของเลือกแชร์ Passport ให้ Family ด้วยสิทธิ์ view หรือ edit; สมาชิกเห็นเฉพาะข้อมูลที่ได้รับอนุญาต
8. **Verification:** ทดสอบ owner/member isolation, backup เบื้องต้น และใช้งานด้วยข้อมูลจริง

### Acceptance Criteria For Added Areas

- Home แสดง pets และ events ที่ผู้ใช้มีสิทธิ์เข้าถึงเท่านั้น
- Family owner จัดการสมาชิกและ role ได้; viewer ไม่สามารถแก้ไขข้อมูล
- Shared Home ไม่เปิดเผย Passport ที่ไม่ได้ share และสิทธิ์ edit ต้องผ่านทั้ง pet share และ family role
- การลบสมาชิกหรือยกเลิก share ต้องหยุดการเข้าถึงข้อมูลในการ request ถัดไป

### สิ่งที่ยังไม่ต้องทำ

ยังไม่ต้องสร้าง:

* QR
* Marketplace
* Biometrics
* Advanced Storage
* Social
* AI Features
* Gamification
* Subscription
* Multi-species ecosystem
* Graphic Engine เต็มรูปแบบ

สิ่งเหล่านี้ให้ **เตรียม Architecture และ Data Model ไม่ให้ปิดทางในอนาคต** แต่ยังไม่ต้อง implement

### หลักสำคัญ

ผมต้องการให้ระบบ **เล็กใน Feature แต่ไม่เล็กใน Foundation**

กล่าวคือ ผมต้องการเริ่มใช้งานเร็ว แต่ไม่ต้องการสร้างแบบชั่วคราวแล้วรื้อ Database ภายหลัง

ข้อมูลที่ผมบันทึกตั้งแต่วันแรกต้องสามารถเดินทางต่อไปยัง Version ในอนาคตได้โดยไม่สูญหาย

ดังนั้นก่อนเริ่ม Coding:

**1. ช่วยสรุป Architecture ที่คุณจะใช้**
**2. ระบุ Database Schema ที่จำเป็นสำหรับ Roadmap 1**
**3. ระบุ Database และ permission model ที่จำเป็นสำหรับ Home, Shared Home และ Family**
**4. ระบุสิ่งที่ตั้งใจเผื่อไว้สำหรับอนาคต**
**5. ระบุสิ่งที่ยังไม่ทำในรอบนี้**
**6. เสนอแผนการทำงานเป็น Step เล็ก ๆ**

การ implement ใช้ migration แยก `20260826100000_home_shared_home_family.sql` โดยมี `families` เป็นกลุ่ม,
`family_members` เป็นสมาชิกและ role, และ `pet_shares` เป็นความสัมพันธ์ระหว่าง Passport กับกลุ่ม
ที่แชร์ ข้อมูลยังคงผูกกับ `owner_id` และใช้ RLS เป็นชั้นบังคับสิทธิ์ ไม่พึ่งการซ่อนปุ่มในหน้าเว็บ

แล้ว **รอผมตรวจสอบและยืนยันก่อนเริ่มสร้างจริง**

ผมต้องการพัฒนาแบบ:

> Plan → Review → Build → Test → Use → Learn → Next Step

ไม่ต้องพยายามสร้างทั้ง Meow World ในครั้งเดียวครับ
