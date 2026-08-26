ผมแนบไฟล์ `MVP V4.1 Heart Edition.md` ให้ครับ

**ขอให้ยึดหลักสำคัญดังนี้:**

ไฟล์นี้มีทั้ง Vision, Architecture และ Roadmap สำหรับอนาคต เพื่อให้คุณเห็นว่าโครงการต้องการเดินไปทางไหน

แต่ **ตอนนี้ยังไม่ต้องสร้างทั้งหมดตามไฟล์**

### Scope ที่ต้องทำตอนนี้เท่านั้น

ทำเฉพาะ **Roadmap 1 — Passport + Life Journey**

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

### สิ่งที่ยังไม่ต้องทำ

ยังไม่ต้องสร้าง:

* Home
* Shared Home
* Family
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
**3. ระบุสิ่งที่ตั้งใจเผื่อไว้สำหรับอนาคต**
**4. ระบุสิ่งที่ยังไม่ทำในรอบนี้**
**5. เสนอแผนการทำงานเป็น Step เล็ก ๆ**

แล้ว **รอผมตรวจสอบและยืนยันก่อนเริ่มสร้างจริง**

ผมต้องการพัฒนาแบบ:

> Plan → Review → Build → Test → Use → Learn → Next Step

ไม่ต้องพยายามสร้างทั้ง Meow World ในครั้งเดียวครับ
