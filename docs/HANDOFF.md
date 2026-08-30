# 🐱 Meow World — Team Handoff Document

**Version:** Prototype V0 (ต้นแบบ)
**Date:** 2026-08-31
**Branch:** `qwen-prototype-v0` (main branch สำหรับ development)
**Repository:** https://github.com/BombINdyBoy/Meow-World

---

## ⚙️ Feature Flag System: ควบคุมการเปิด/ปิดฟีเจอร์

### แนวคิด

> "เปิดใช้งานฟีเจอร์ได้จาก UI โดยไม่ต้อง deploy ใหม่"

### Feature Flags

| Flag | Description | Default |
|---|---|---|
| `home_mode` | Home Mode - หน้าหลัก | ✅ ON |
| `nest_system` | Nest System - รังส่วนตัว | ❌ OFF |
| `decoration` | Decoration - ตกแต่งบ้าน | ❌ OFF |
| `community` | Community - ชุมชน | ❌ OFF |
| `vet_market` | Vet Market - ตลาดสัตวแพทย์ | ❌ OFF |
| `family_package` | Family Package - พื้นที่จัดเก็บ | ❌ OFF |

### วิธีใช้

```sql
-- เปิดฟีเจอร์
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'nest_system';

-- ปิดฟีเจอร์
UPDATE feature_flags SET is_enabled = false WHERE flag_name = 'community';

-- กำหนดให้ user เฉพาะ
UPDATE feature_flags SET target_users = ARRAY['uuid1', 'uuid2'] 
WHERE flag_name = 'decoration';
```

### แผนภาพ

```
┌─────────────────────────────────────────┐
│  ⚙️ Feature Flags Management            │
│                                         │
│  🏠 Home Mode          [ON ] ✅         │
│  🪺 Nest System        [OFF] ❌         │
│  🎨 Decoration         [OFF] ❌         │
│  🏘️ Community          [OFF] ❌         │
│  🏪 Vet Market         [OFF] ❌         │
│  💾 Family Package     [OFF] ❌         │
│                                         │
│  📊 Rollout: 100% of users              │
│  👥 Target: All users                   │
└─────────────────────────────────────────┘
```

---

## 🐾 Multi-Species Vision: "เลี้ยงร่วมกันภายใต้หลังคาเดียวกัน"

### แนวคิดหลัก

> "Meow World ไม่ได้มีแค่แมว แต่เป็นบ้านสำหรับสัตว์ทุกชนิด"

### หลักการออกแบบ

| หลัก | อธิบาย |
|---|---|
| **ชื่อ "Meow World"** | เป็น brand ไม่ใช่ข้อจำกัด |
| **ทุกสัตว์อยู่ใต้หลังคาเดียวกัน** | เลี้ยงร่วมกันได้ |
| **ฟีเจอร์เท่าเทียม** | สุนัข might have more features than cats! |
| **ไม่แยก species** | ไม่รู้สึกเป็น "บุคลากรชั้น 2" |

### Species Features

| Species | ฟีเจอร์พิเศษ |
|---|---| 
| 🐱 แมว | Passport, Life Journey, Certificate |
| 🐕 สุนัข | + Walk Tracker, Training Log, Vaccination |
| 🐰 กระต่าย | + Housing Setup, Diet Planner |
| 🐦 นก | + Flight Log, Cage Setup |
| 🐹 อื่นๆ | + Custom fields |

### แผนภาพ

```
Meow World
├── 🏠 Home (บ้านหลัก)
│   ├── 🪺 Nest 1 (arthur — 🐱)
│   ├── 🪺 Nest 2 (Lucky — 🐕)
│   ├── 🪺 Nest 3 (มอลต์ — 🐰)
│   └── 🪺 Nest 4 (เจ้าสี — 🐦)
│
├── 📋 Species Features
│   ├── 🐱 Cat Mode
│   ├── 🐕 Dog Mode (+ Walk, Training)
│   ├── 🐰 Rabbit Mode (+ Housing, Diet)
│   └── 🐦 Bird Mode (+ Flight, Cage)
│
└── 💾 Shared Storage (Family Package)
```

---

## 📌 สรุปสำหรับผู้บริหาร (30 วินาที)

Meow World คือ **Living Passport & Life Journey** สำหรับสัตว์เลี้ยง — ไม่ใช่แค่แอพบันทึกข้อมูล แต่เป็น **ที่เก็บความทรงจำ** ที่ออกแบบมาให้ผู้ใช้รู้สึก **ผูกพัน** กับสัตว์เลี้ยงของตัวเอง

**สถานะปัจจุบัน:** Prototype V0 — มี UI ครบ แต่ database layer ยังมี blocker (RLS infinite recursion)

**สิ่งที่ต้องทำต่อ:** Fix RLS → ให้ flow ทำงานได้จริง → ทดสอบกับผู้ใช้จริง → Launch

---

## 🎨 UX Philosophy: Emotional Design

### แนวคิดหลัก

> "Meow World ไม่ใช่แค่แอพ แต่เป็น **ที่เก็บความทรงจำ** ที่ออกแบบมาให้ผู้ใช้รู้สึก **อบอุ่น** และ **ผูกพัน**"

### Emotional Journey ของผู้ใช้

```
┌─────────────────────────────────────────────────────────┐
│  Login: "A QUIET PLACE FOR BIG MEMORIES"                │
│         "Every chapter matters."                         │
│  → สื่อว่า: นี่คือที่เก็บความทรงจำ ไม่ใช่แค่แอพ          │
├─────────────────────────────────────────────────────────┤
│  Empty State: "ยินดีต้อนรับสู่ Meow World"              │
│               "ระบบกำลังเตรียมพื้นที่ส่วนตัวให้คุณ..."    │
│  → สื่อว่า: เริ่มต้น journey ใหม่                        │
├─────────────────────────────────────────────────────────┤
│  Nesting: 📦 "บ้านหลังใหม่พร้อมแล้ว!"                  │
│           "มาต้อนรับสมาชิกขนฟูคนแรกกันเถอะ"              │
│  → สื่อว่า: ความตื่นเต้นในการต้อนรับสัตว์เลี้ยงตัวแรก     │
├─────────────────────────────────────────────────────────┤
│  Living: 🏠 "บ้านของเรา"                                │
│          "2 สมาชิกขนฟู • 5 เรื่องราว"                   │
│  → สื่อว่า: ชีวิตที่เต็มไปด้วยความทรงจำ                  │
└─────────────────────────────────────────────────────────┘
```

### Design System

| Token | Color | สื่อความหมาย |
|---|---|---|
| `--brand-coral` | #E06D53 | อบอุ่น เป็นมิตร |
| `--brand-sage` | #6B8E68 | ธรรมชาติ ผ่อนคลาย |
| `--gold-cert` | #C89933 | หรูหรา มีคุณค่า |
| `--ink-primary` | #1F1E1D | เข้ม ชัดเจน |
| `--bg-warm` | #FAF7F2 | พื้นหลังอบอุ่น |

| Font | ใช้กับ | สื่อความหมาย |
|---|---|---|
| Playfair Display | หัวข้อ | หรูหราวิจิตร |
| Plus Jakarta Sans | เนื้อหา | ทันสมัย อ่านง่าย |
| DM Mono | Code/Eyebrow | เทคโนโลยี แม่นยำ |

### UX Flow

```
User เปิดแอพ
    │
    ▼
Login (_email/password หรือ Google OAuth_)
    │
    ▼
Empty State → สร้างบ้านอัตโนมัติ
    │
    ▼
Nesting State → กด "รับน้องเข้าบ้าน"
    │
    ▼
Pets Page → เพิ่มสัตว์เลี้ยง
    │
    ▼
Pet Detail → เพิ่ม Life Journey Event
    │
    ▼
Living State → เห็น Feed ความทรงจำ
```

---

## 🏠 Home Mode Concept: "บ้านของทุกคน"

### แนวคิดหลัก

```
🐱 MEOW WORLD
      │
      ▼
┌──────────────┐
│  HOME MODE   │  ← ตอนนี้ทำตรงนี้
│  COMPLETE    │
└──────┬───────┘
       │
┌──────▼───────┐
│  LAND / UI   │
│  2 HOME      │
└──────┬───────┘
       │
  ┌────┼────┐
  ▼    ▼    ▼
FARM COMMUNITY OTHER
  │
  ▼
STORAGE
```

### สมมุติฐาน: ครอบครัว 4 คน

```
👨 พ่อ: "ซื้อ family package ให้ทั้งบ้าน"
👩 แม่: "ใช้พื้นที่ร่วมกัน"
👦 ลูกชาย (8 ขวบ): "ผมก็อยากมีบ้านสำหรับเจ้า小康 ของผม"
👧 ลูกสาว (5 ขวบ): "หนูอยากมีบ้านสำหรับเจ้า arthur ของหนู"
```

**Key Insight:**
- ทุกคนมี **บ้านของตัวเอง** (home ส่วนตัว)
- แต่ใช้ **พื้นที่จัดเก็บร่วมกัน** (shared storage)
- พ่อเป็นคนจ่ายเงิน → family package
- ลูกๆ ไม่ต้องจ่าย → แต่มีพื้นที่ของตัวเอง

### Architecture ที่ขยาย

```
Home Mode
├── 🏠 My Home (บ้านส่วนตัวของแต่ละคน)
│   ├── Pets (สัตว์เลี้ยงของฉัน)
│   ├── Life Journey (ความทรงจำของฉัน)
│   └── Certificates (ใบรับรองของฉัน)
│
├── 👨‍👩‍👧‍👦 Family Home (บ้านครอบครัว)
│   ├── Family Members (สมาชิก)
│   ├── Shared Pets (สัตว์เลี้ยงที่แชร์)
│   └── Family Feed (เรื่องราวของครอบครัว)
│
├── 🌾 Farm Mode
│   ├── Pet Profiles (ข้อมูลสัตว์เลี้ยง)
│   ├── Health Records (บันทึกสุขภาพ)
│   └── Vaccination Tracker
│
├── 🌐 Community Mode
│   ├── Pet Profiles (โปรไฟล์สาธารณะ)
│   ├── Events (กิจกรรม)
│   └── Marketplace (ซื้อขาย)
│
└── 💾 Storage (พื้นที่จัดเก็บ)
    ├── Family Package (จ่ายคนเดียว ใช้ทั้งบ้าน)
    ├── Shared Storage (พื้นที่ร่วม)
    └── Individual Quota (โควตาแต่ละคน)
```

### Database Schema ที่ต้องเพิ่ม

```sql
-- Family Storage Package
CREATE TABLE public.family_packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
  storage_limit bigint DEFAULT 5368709120, -- 5GB default
  storage_used bigint DEFAULT 0,
  plan_type text DEFAULT 'free', -- free, basic, premium
  created_at timestamptz DEFAULT NOW(),
  expires_at timestamptz
);

-- Individual Home (บ้านส่วนตัวของแต่ละคน)
CREATE TABLE public.user_homes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.families(id),
  home_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT NOW()
);

-- Shared Storage Usage
CREATE TABLE public.storage_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.families(id),
  file_type text NOT NULL, -- image, video, document
  file_size bigint NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT NOW()
);
```

### Flow ของ Family Package

```
พ่อสมัคร Family Package
    │
    ▼
สร้าง Family Home
    │
    ├── 👨 พ่อ → มีบ้านส่วนตัว
    ├── 👩 แม่ → มีบ้านส่วนตัว
    ├── 👦 ลูกชาย → มีบ้านส่วนตัว (for เจ้า小康)
    └── 👧 ลูกสาว → มีบ้านส่วนตัว (for เจ้า arthur)
    │
    ▼
ทุกคนใช้พื้นที่จัดเก็บร่วมกัน (5GB)
    │
    ├── รูปภาพสัตว์เลี้ยง
    ├── วิดีโอความทรงจำ
    └── เอกสาร (ใบรับรอง, ผลตรวจสุขภาพ)
```

### UX Flow สำหรับ Family Mode

```
Login → เลือกบ้าน
    │
    ├── "บ้านของฉัน" → My Home (ส่วนตัว)
    │   ├── 🐱 Pets ของฉัน
    │   ├── 📸 Memories ของฉัน
    │   └── 📜 Certificates ของฉัน
    │
    └── "บ้านครอบครัว" → Family Home
        ├── 👨‍👩‍👧‍👦 สมาชิก
        ├── 🐾 สัตว์เลี้ยงทั้งหมด
        └── ✨ เรื่องราวของครอบครัว
```

---

## 🏡 GUI Design: "บ้านที่มีชีวิต"

### แนวคิดหลัก

> "ไม่ใช่แค่เก็บข้อมูล แต่เป็นบ้านที่มีชีวิต ที่ผู้ใช้ตกแต่งตามสไตล์ของตัวเอง"

### หน้าจอหลัก: หมู่บ้าน

```
┌─────────────────────────────────────────────────────────┐
│                    🏘️ หมู่บ้านของเรา                     │
│                                                         │
│    🏠          🏠          🏠          🏠               │
│   บ้านA       บ้านB       บ้านC       บ้านD             │
│  (พ่อ)       (แม่)       (ลูกชาย)    (ลูกสาว)          │
│                                                         │
│    👨          👩          👦          👧                │
│   🐕          🐈          🐕小康       🐈arthur          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💾 พื้นที่จัดเก็บร่วม: 3.2 GB / 5 GB (64%)     │   │
│  │  ████████████████░░░░░░░░░░░░                     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### เมื่อกดเข้าบ้านตัวเอง: พื้นที่ส่วนตัว

```
┌─────────────────────────────────────────────────────────┐
│  🏠 บ้านของลูกสาว                                      │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 📚 ตู้   │  │ 🖼️ รูป  │  │ 🎄 ของ   │             │
│  │ เก็บ     │  │ ความ     │  │ ตกแต่ง   │             │
│  │ บันทึก   │  │ ทรงจำ    │  │ ตามเทศกาล│             │
│  │          │  │          │  │          │             │
│  │ ██████░░ │  │ ██░░░░░░ │  │ 🎃🎄🌸   │             │
│  │ 75%      │  │ 30%      │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  🐈 arthur                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📸 รูปภาพ: 45 รูป (1.2 GB)                      │   │
│  │ 🎬 วิดีโอ: 12 คลิป (800 MB)                     │   │
│  │ 📄 เอกสาร: 8 ไฟล์ (200 MB)                      │   │
│  │                                                   │   │
│  │ ใช้ไป: 2.2 GB / 5 GB (44%)                       │   │
│  │ ████████████░░░░░░░░░░░░░░░░                     │   │
│  │                                                   │   │
│  │ 💡 "เก็บบันทึกไว้เต็มแล้ว?"                      │   │
│  │    กดที่ตู้เก็บเพื่อเพิ่มพื้นที่                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### แสดงพื้นที่: ตู้เก็บบันทึก

```
┌─────────────────────────────────────────────────────────┐
│  📚 ตู้เก็บบันทึก                                       │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                   │   │
│  │   📸📸📸  🎬  📄📄                                │   │
│  │   รูปภาพ  วิดีโอ  เอกสาร                          │   │
│  │                                                   │   │
│  │   ████████████████████░░░░░░░░░░  64%            │   │
│  │   3.2 GB / 5 GB                                  │   │
│  │                                                   │   │
│  │   ┌─────────────────────────────────────────┐   │   │
│  │   │  🏪 กดเพิ่มพื้นที่                       │   │   │
│  │   │  (ไม่บังคับ ค่อยๆ เก็บเงินเอง)          │   │   │
│  │   └─────────────────────────────────────────┘   │   │
│  │                                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  💡 "เก็บบันทึกไว้เต็มแล้ว?"                           │
│     กดที่ตู้เก็บเพื่อดูตัวเลือก                         │
└─────────────────────────────────────────────────────────┘
```

### การตกแต่งบ้าน (ฟีเจอร์อนาคต)

```
┌─────────────────────────────────────────────────────────┐
│  🎨 ตกแต่งบ้าน                                          │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ตามเทศกาล:                                             │
│  ├── 🎃 ฮาโลวีน (ตุลาคม)                               │
│  ├── 🎄 คริสต์มาส (ธันวาคม)                             │
│  ├── 🌸 สงกรานต์ (เมษายน)                               │
│  └── 🎋 ลอยกระทง (พฤศจิกายน)                           │
│                                                         │
│  สไตล์ส่วนตัว:                                           │
│  ├── 🌿 ธรรมชาติ                                         │
│  ├── 🎨 ศิลปะ                                            │
│  ├── 🏖️ ชายหาด                                          │
│  └── 🌌 อวกาศ                                           │
│                                                         │
│  ไม่ใช่การแข่งขัน แต่เป็นการแสดงออกตัวตน                 │
│  "ตกแต่งโลกของเขาตามสไตล์ของเค้า"                      │
└─────────────────────────────────────────────────────────┘
```

### UX Flow: การจัดการพื้นที่

```
ผู้ใช้เปิดแอพ
    │
    ▼
เห็นหมู่บ้าน (GUI)
    │
    ├── กดเข้าบ้านตัวเอง → เห็นพื้นที่ส่วนตัว
    │   ├── ตู้เก็บบันทึก (แสดง % การใช้งาน)
    │   ├── รูปความทรงจำ
    │   └── ของตกแต่ง
    │
    └── กดเข้าบ้านครอบครัว → เห็นบ้านทุกคน
        ├── บ้านของพ่อ
        ├── บ้านของแม่
        ├── บ้านของลูกชาย
        └── บ้านของลูกสาว
```

### การแสดงพื้นที่: ไม่ยัดเยียด

| สถานะ | การแสดงผล | การทำงาน |
|---|---|---|
| 0-50% | 🟢 เขียว | ใช้งานปกติ |
| 50-80% | 🟡 เหลือง | เริ่มเตือนเบาๆ |
| 80-95% | 🟠 ส้ม | แจ้งเตือน |
| 95-100% | 🔴 แดง | กดเพิ่มพื้นที่ได้ |

**หลักการออกแบบ:**
- ❌ ไม่ popup บังคับซื้อ
- ❌ ไม่ข้อความ "พื้นที่เต็ม!" แบบน่ากลัว
- ✅ แสดงเป็น visual บนตู้เก็บ
- ✅ ให้ผู้ใช้กดเองเมื่อพร้อม
- ✅ "ค่อยๆ คำนวณการใช้งานและเก็บเงิน"

---

## 🏗️ Meow World Architecture: "ขยายได้โดยไม่ต้องรื้อ"

### แผนผังโครงสร้างทั้งหมด

```
Meow Town (อนาคต)
├── 🏘️ Community (กลุ่มผู้เลี้ยง)
│   ├── Vet Market (ตลาดสัตวแพทย์)
│   ├── Pet Profiles (โปรไฟล์สาธารณะ)
│   └── Events (กิจกรรม)
│
├── 🏠 Home (บ้านหลัก — ทุกบ้านมีเหมือนกัน)
│   │
│   ├── 🪺 Nest 1 (รังส่วนตัว — สำหรับลูกสาว)
│   │   ├── 🐈 arthur (สัตว์เลี้ยง)
│   │   ├── 📸 Memories (ความทรงจำ)
│   │   ├── 📚 Storage (ตู้เก็บบันทึก)
│   │   └── 🎨 Decoration (ตกแต่ง)
│   │
│   ├── 🪺 Nest 2 (รังส่วนตัว — สำหรับลูกชาย)
│   │   ├── 🐕小康 (สัตว์เลี้ยง)
│   │   ├── 📸 Memories
│   │   ├── 📚 Storage
│   │   └── 🎨 Decoration
│   │
│   ├── 🏡 Yard (พื้นที่ส่วนกลางของบ้าน)
│   │   ├── 🌳 ต้นไม้
│   │   ├── 🪑 ม้านั่ง
│   │   ├── 🐟 บ่อปลา
│   │   └── 🌸 สวนดอกไม้
│   │
│   └── 💾 Shared Storage (พื้นที่จัดเก็บร่วม)
│
└── 🏪 Vet Market (อนาคต — หลังเป็นที่รู้จัก)
```

### แผนภาพ SQL Schema ที่รองรับการขยาย

```sql
-- บ้านหลัก (ทุกบ้านมีเหมือนกัน)
CREATE TABLE public.homes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Extension fields (พร้อมใช้เมื่อพร้อม)
  theme text DEFAULT 'default',
  banner_url text,
  created_at timestamptz DEFAULT NOW()
);

-- รังส่วนตัว (Nest) — ย่อยจาก homes
CREATE TABLE public.nests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id uuid REFERENCES public.homes(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  nest_name text NOT NULL,
  description text,
  theme text DEFAULT 'default',
  banner_url text,
  created_at timestamptz DEFAULT NOW()
);

-- ของตกแต่ง (สำหรับรังและบ้าน)
CREATE TABLE public.decorations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nest_id uuid REFERENCES public.nests(id) ON DELETE CASCADE,
  home_id uuid REFERENCES public.homes(id) ON DELETE CASCADE,
  decoration_type text NOT NULL, -- tree, bench, pond, flower, etc.
  position_x int DEFAULT 0,
  position_y int DEFAULT 0,
  season text, -- null = ใช้ตลอด, 'christmas', 'halloween', etc.
  created_at timestamptz DEFAULT NOW()
);

-- พื้นที่จัดเก็บ (Family Package)
CREATE TABLE public.family_packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id uuid REFERENCES public.homes(id) ON DELETE CASCADE,
  storage_limit bigint DEFAULT 5368709120, -- 5GB
  storage_used bigint DEFAULT 0,
  plan_type text DEFAULT 'free',
  created_at timestamptz DEFAULT NOW(),
  expires_at timestamptz
);
```

### Flow การทำงาน

```
ขั้นที่ 1: สร้างบ้านหลัก (อัตโนมัติเมื่อ signup)
    │
    ▼
ขั้นที่ 2: เพิ่มรังส่วนตัว (แต่ละคนสร้างของตัวเอง)
    │
    ├── 👧 ลูกสาว → สร้างรังสำหรับ arthur
    ├── 👦 ลูกชาย → สร้างรังสำหรับ小康
    └── 👨 พ่อ → ซื้อของตกแต่งให้ลูกๆ
    │
    ▼
ขั้นที่ 3: ตกแต่งบ้าน (ปกติ + เทศกาล)
    │
    ├── 🌳 ต้นไม้ (ปกติ)
    ├── 🪑 ม้านั่ง (ปกติ)
    ├── 🐟 บ่อปลา (ปกติ)
    ├── 🎃 ฮาโลวีน (เฉพาะเดือนตุลาคม)
    └── 🎄 คริสต์มาส (เฉพาะเดือนธันวาคม)
    │
    ▼
ขั้นที่ 4: ขยายไป Community (อนาคต)
    │
    └── Meow Town → Vet Market
```

### หลักการออกแบบ: ขยายได้โดยไม่ต้องรื้อ

| หลัก | วิธีทำ |
|---|---| 
| **Schema พร้อมใช้** | เพิ่ม column ได้โดยไม่ต้อง drop table |
| **Decoration system** | เป็น table แยก ไม่ผูกกับ business logic |
| **Season layer** | เพิ่ม season ได้โดยไม่ต้องแก้ code หลัก |
| **Nest = ย่อยจาก Home** | ลบ nest ไม่กระทบ home |
| **Storage = Family Package** | ขยาย plan ได้โดยไม่ต้อง migrate ใหม่ |

### แผนภาพความสัมพันธ์

```
profiles
  │
  └── homes (บ้านหลัก)
        ├── nests (รังส่วนตัว)
        │     ├── pets (สัตว์เลี้ยง)
        │     ├── life_journey_events
        │     └── decorations (ของตกแต่ง)
        ├── home_members (สมาชิก)
        ├── family_packages (พื้นที่จัดเก็บ)
        └── decorations (ของตกแต่งส่วนกลาง)
```

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | Next.js (App Router) | 16.3.3 |
| **UI** | React | 19.2.8 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Language** | TypeScript | 5.x |
| **Database** | Supabase (PostgreSQL) | — |
| **Auth** | Supabase Auth (Email + Google OAuth) | — |
| **Hosting** | Vercel | Hobby plan |
| **Version Control** | Git + GitHub | — |

### Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (ไม่มี custom fonts)
│   ├── page.tsx                # 🏠 Home page (3 states: empty/nesting/living)
│   ├── globals.css             # Tailwind v3 + custom CSS
│   ├── login/page.tsx          # 🔐 Google OAuth login
│   ├── auth/callback/route.tsx # OAuth callback handler
│   └── pets/
│       ├── page.tsx            # 📋 Pet list (CRUD)
│       ├── [id]/page.tsx       # 🐱 Pet detail + Life Journey
│       └── [id]/edit/page.tsx  # ✏️ Edit pet
├── components/
│   └── pets/
│       ├── PetCard.tsx         # Pet card component
│       └── PetForm.tsx         # Pet create/edit form
├── types/
│   └── pet.ts                  # TypeScript interfaces
├── utils/supabase/
│   ├── client.ts               # Browser Supabase client
│   ├── server.ts               # Server Supabase client
│   └── middleware.ts           # Session refresh middleware
└── middleware.ts                # Next.js middleware wrapper
```

---

## 🗄️ Database Schema

### Tables (จาก migration จริง)

```
auth.users (Supabase managed)
    │
    ▼
profiles
├── id: uuid (PK, FK → auth.users)
├── display_name: text
├── avatar_url: text
└── created_at: timestamptz

homes
├── id: uuid (PK)
├── name: text
├── description: text
├── owner_id: uuid (FK → profiles)
└── created_at: timestamptz

home_members
├── id: uuid (PK)
├── home_id: uuid (FK → homes)
├── user_id: uuid (FK → profiles)
├── role: text (default: 'member')
├── joined_at: timestamptz
└── UNIQUE(home_id, user_id)

pets
├── id: uuid (PK)
├── home_id: uuid (FK → homes) ← ไม่ใช่ owner_id!
├── name: text
├── nickname: text
├── species: text (default: 'Cat')
├── breed: text
├── gender: text
├── birth_date: date
├── color: text
├── avatar_url: text
├── is_active: boolean (default: true)
└── created_at: timestamptz

life_journey_events
├── id: uuid (PK)
├── home_id: uuid (FK → homes)
├── pet_id: uuid (FK → pets, nullable)
├── author_id: uuid (FK → profiles, nullable)
├── content: text
├── event_type: text (default: 'memory')
├── media_urls: text[]
├── participant_ids: uuid[]
└── created_at: timestamptz
```

### Relationships

```
profiles ──< homes (owner_id)
homes ──< home_members
homes ──< pets (home_id)
homes ──< life_journey_events (home_id)
pets ──< life_journey_events (pet_id)
```

**สำคัญ:** ตารางใช้ `home_id` ไม่ใช่ `owner_id` สำหรับ pets และ events

---

## ⚠️ Known Issues (CRITICAL)

### 1. `home_members` RLS Infinite Recursion

**Error:** `infinite recursion detected in policy for relation "home_members"`

**Cause:** Original migration สร้าง policy ที่ query `home_members` ตัวเอง:
```sql
-- ❌ Policy นี้ cause infinite recursion
CREATE POLICY "Members can view members" ON public.home_members
  FOR SELECT USING (
    home_id IN (SELECT home_id FROM home_members WHERE user_id = auth.uid())
  );
```

**Impact:** ไม่สามารถ query `homes`, `home_members`, `pets`, หรือ `life_journey_events` ผ่าน API ได้

**วิธีแก้:**
```sql
-- Step 1: ดู policy ที่มีอยู่จริง
SELECT * FROM pg_policies WHERE tablename = 'home_members';

-- Step 2: Drop policy ที่ cause recursion (ใช้ชื่อจริงจาก step 1)
DROP POLICY IF EXISTS "Members can view members" ON public.home_members;

-- Step 3: Recreate ไม่มี self-reference
CREATE POLICY "Users see own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());

-- Step 4: Verify
SELECT * FROM pg_policies WHERE tablename = 'home_members';
```

### 2. `handle_new_user()` Trigger ไม่ทำงาน

**Cause:** User signup ก่อน apply migration

**Workaround:**
```sql
INSERT INTO public.profiles (id, display_name)
VALUES ('USER_UUID_HERE', 'Display Name')
ON CONFLICT (id) DO NOTHING;
```

### 3. Home Page ติด Empty State

**Flow ที่เกิดขึ้น:**
1. User login → session สำเร็จ
2. Query `homes` → ❌ fail (RLS infinite recursion)
3. Code จับ error → setViewMode("empty")
4. แสดง "ยินดีต้อนรับสู่ Meow World"
5. กด "รีเฟรช" → วน loop เดิม

---

## 🚀 Deployment

### URLs

| Environment | URL |
|---|---|
| **Production** | `meow-world-heart-edition.vercel.app` |
| **Preview** | `meow-world-heart-edition-61blnekzx-thdev8studio.vercel.app` |
| **GitHub** | `github.com/BombINdyBoy/Meow-World` |

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://eqemlaqgzzjilshrhgdo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

**Vercel Settings:** ต้องเปิดทั้ง Production + Preview + Development

### Git Workflow

```
Branch: qwen-prototype-v0 (development)
    │
    ├─ git push origin qwen-prototype-v0 → Vercel Preview
    │
    └─ merge to main → Vercel Production
```

---

## 📋 Roadmap

### Phase 1: MVP (ตอนนี้) ← We are here

- [x] Next.js project foundation
- [x] Supabase client/server utilities
- [x] Authentication flow (Email + Google OAuth)
- [x] Pet Passport CRUD UI
- [x] Life Journey timeline UI
- [x] Home / Family UI
- [x] Vercel deployment
- [x] Tailwind CSS styling
- [ ] **Fix RLS infinite recursion** ← BLOCKER
- [ ] Fix home page flow (empty → nesting → living)
- [ ] Test with real user data
- [ ] Launch to 10-50 beta users

### Phase 2: Growth

- [ ] Family sharing & permissions
- [ ] Pet avatars & photos
- [ ] Life Journey events with media
- [ ] Push notifications
- [ ] Multi-language support

### Phase 3: Monetization

- [ ] Premium features (Freemium model)
- [ ] Digital certificates
- [ ] QR sharing
- [ ] Marketplace integration

### Out of Scope (for now)

QR, Marketplace, Biometrics, Advanced Storage, Social, AI Features, Gamification, Subscription, Multi-species ecosystem, Graphic Engine

---

## 📁 Files Summary

### Configuration Files

| File | Purpose |
|---|---|
| `package.json` | Dependencies (Tailwind v3, Supabase, Next.js 16) |
| `tsconfig.json` | TypeScript config |
| `tailwind.config.js` | Tailwind v3 content paths |
| `postcss.config.js` | PostCSS with tailwindcss + autoprefixer |
| `.env.local` | Supabase credentials (not committed) |
| `.env.local.example` | Template for env vars |
| `.gitignore` | Git ignore rules |

### Source Files

| File | Purpose |
|---|---|
| `src/app/page.tsx` | Home page (3 states) |
| `src/app/login/page.tsx` | Login page (Google OAuth) |
| `src/app/pets/page.tsx` | Pet list (CRUD) |
| `src/app/pets/[id]/page.tsx` | Pet detail + Life Journey |
| `src/app/pets/[id]/edit/page.tsx` | Edit pet |
| `src/components/pets/PetForm.tsx` | Pet form component |
| `src/components/pets/PetCard.tsx` | Pet card component |
| `src/types/pet.ts` | TypeScript interfaces |
| `src/utils/supabase/client.ts` | Browser client |
| `src/utils/supabase/server.ts` | Server client |
| `src/utils/supabase/middleware.ts` | Session middleware |

### Database Migrations

| File | Purpose |
|---|---|
| `20260827130000_init_full_schema.sql` | Main schema (homes, home_members, pets, events) |
| `20260831000000_fix_rls_and_profile.sql` | Fix RLS + insert profile |
| `20260831100000_fix_rls_recursion.sql` | Fix recursion (incomplete) |
| `20260831200000_nuclear_rls_fix.sql` | Nuclear fix (incomplete) |

---

## 🎯 How to Start (สำหรับ developer ใหม่)

### Step 1: Clone & Setup

```bash
git clone -b qwen-prototype-v0 https://github.com/BombINdyBoy/Meow-World.git
cd Meow-World
npm install
cp .env.local.example .env.local
# ใส่ Supabase credentials ใน .env.local
npm run dev
```

### Step 2: Fix Database (BLOCKER)

ไปที่ Supabase SQL Editor แล้วรัน:

```sql
-- ดู policy ที่มีอยู่
SELECT * FROM pg_policies WHERE tablename = 'home_members';

-- Drop ตัวที่ cause recursion (ใช้ชื่อจริงจากผลลัพธ์ข้างบน)
-- DROP POLICY IF EXISTS "ชื่อpolicyจริง" ON public.home_members;

-- Recreate
CREATE POLICY "Users see own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());
```

### Step 3: Test

```bash
npm run build    # ตรวจสอบ build สำเร็จ
npm run dev      # รัน local
# เปิด http://localhost:3000
# Login → ควรเห็น Home state
```

### Step 4: Deploy

```bash
git push origin qwen-prototype-v0
# Vercel auto-deploy Preview
# Merge to main → Production
```

---

## 📞 Contact

- **Repository:** https://github.com/BombINdyBoy/Meow-World
- **Branch:** `qwen-prototype-v0`

---

*เอกสารนี้สร้างขึ้นเมื่อ 2026-08-31 โดย AI Codebuff*
*สำหรับทีมพัฒนา Meow World V4.1 Heart Edition*
