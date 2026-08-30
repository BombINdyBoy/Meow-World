# 🔧 Continue from Prototype V0: พัฒนาต่อจากต้นแบบ

**สำหรับ:** ทีมที่รับช่วงต่อจาก Prototype V0
**สถานะ:** Prototype V0 (มี UI ครบ แต่ RLS ยังมีปัญหา)

---

## 📊 สถานะปัจจุบัน

### ✅ สิ่งที่ทำเสร็จแล้ว
| รายการ | สถานะ |
|---|---|
| Next.js 16 + React 19 | ✅ |
| Supabase client/server | ✅ |
| Authentication (Email + Google OAuth) | ✅ |
| Pet Passport CRUD | ✅ |
| Life Journey Timeline | ✅ |
| Home Page (3 states) | ✅ |
| Nest System (UI + Schema) | ✅ |
| Decoration System (Schema) | ✅ |
| Family Package (Schema) | ✅ |
| Community (Schema) | ✅ |
| Vet Market (Schema) | ✅ |
| Multi-Species Support | ✅ |
| Feature Flags System | ✅ |
| Admin Dashboard | ✅ |
| Landing Page | ✅ |
| Password Reset | ✅ |
| Error Boundary | ✅ |
| Loading Components | ✅ |
| Feedback Button | ✅ |
| Backup Procedure | ✅ |
| Tailwind CSS | ✅ |
| Vercel Deployment | ✅ |

### ⚠️ สิ่งที่ยังเป็น Blocker
| Blocker | วิธีแก้ |
|---|---|
| **RLS Infinite Recursion** | Drop policy ด้วยชื่อจริง |
| **Home page ติด Empty State** | แก้ RLS แล้ว flow จะทำงาน |

---

## 🎯 Priority: สิ่งที่ต้องทำเป็นอันดับแรก

### Priority 1: Fix RLS (BLOCKER)

```sql
-- Step 1: ดู policy ที่มีอยู่จริง
SELECT * FROM pg_policies WHERE tablename = 'home_members';

-- Step 2: Drop policy ที่ cause recursion
-- (ใช้ชื่อจริงจากผลลัพธ์ step 1)
-- DROP POLICY IF EXISTS "ชื่อpolicyจริง" ON public.home_members;

-- Step 3: Recreate
CREATE POLICY "Users see own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());

-- Step 4: Verify
SELECT * FROM pg_policies WHERE tablename = 'home_members';
```

### Priority 2: Test Core Flow

```
1. Login → สร้าง profile
2. Home → สร้าง home อัตโนมัติ
3. Nest → สร้างรัง
4. Pets → เพิ่มสัตว์เลี้ยง
5. Journey → เพิ่มความทรงจำ
6. Home → เห็น Feed
```

### Priority 3: ให้ผู้ใช้ทดลอง

```
1. ให้ 5-10 คนใกล้ตัวลองใช้
2. รวบรวม feedback
3. แก้ไขตาม feedback
4. ทดสอบอีกครั้ง
```

---

## 📁 สิ่งที่ต้องรู้

### Database Schema จริง

```
profiles → homes → home_members
                → nests → pets → life_journey_events
                → decorations
                → family_packages
```

**สำคัญ:** ตารางใช้ `home_id` ไม่ใช่ `owner_id`

### Feature Flags

```sql
-- เปิด flag ทีละตัว
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'nest_system';
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'decoration';
-- ... ตาม schedule ใน FEATURE_FLAG_ROADMAP.md
```

### Admin Pages

| URL | หน้าที่ |
|---|---|
| `/admin/dashboard` | ดูสถิติผู้ใช้ |
| `/admin/flags` | จัดการ Feature Flags |

---

## 🗺️ Roadmap สำหรับทีมใหม่

### Phase 1: Fix & Test (สัปดาห์ที่ 1)
- [ ] Fix RLS infinite recursion
- [ ] ทดสอบ core flow ทั้งหมด
- [ ] แก้ bug ที่พบ

### Phase 2: Polish (สัปดาห์ที่ 2)
- [ ] ปรับ UI ให้สวยขึ้น
- [ ] เพิ่ม loading states
- [ ] ปรับ error messages

### Phase 3: Expand (สัปดาห์ที่ 3-4)
- [ ] เปิด flag ทีละตัวตาม schedule
- [ ] ทดสอบแต่ละฟีเจอร์
- [ ] รวบรวม feedback

### Phase 4: Launch (สัปดาห์ที่ 4)
- [ ] Final polish
- [ ] เปิดให้ใช้งานจริง
- [ ] ติดตาม metrics

---

## 🔧 วิธีรัน

```bash
# Clone
git clone -b qwen-prototype-v0 https://github.com/BombINdyBoy/Meow-World.git
cd Meow-World

# Install
npm install

# Environment
cp .env.local.example .env.local
# ใส่ Supabase credentials

# Run
npm run dev
# เปิด http://localhost:3000
```

---

## 📚 เอกสารที่เกี่ยวข้อง

| เอกสาร | ที่อยู่ | ใช้ทำอะไร |
|---|---|---|
| HANDOFF.md | `docs/HANDOFF.md` | ภาพรวมทั้งหมด |
| FEATURE_FLAG_ROADMAP.md | `docs/FEATURE_FLAG_ROADMAP.md` | แผนเปิด flag |
| BACKUP_PROCEDURE.md | `docs/BACKUP_PROCEDURE.md` | คู่มือ backup |
| NEW_TEAM_GUIDE.md | `docs/NEW_TEAM_GUIDE.md` | เริ่มต้นใหม่ |
| TRACKING.md | `TRACKING.md` | ติดตามความคืบหน้า |

---

## 🚨 สิ่งที่ต้องระวัง

1. **อย่า drop table ที่มี data** — ใช้ soft delete แทน
2. **อย่าแก้ RLS policy โดยไม่เข้าใจ** — อาจ cause recursion
3. **ทดสอบทุกครั้งก่อน push** — `npm run build` ต้องผ่าน
4. **อย่า commit .env.local** — ใช้ .env.local.example แทน

---

## 📞 ติดต่อ

- **Repository:** https://github.com/BombINdyBoy/Meow-World
- **Branch:** `qwen-prototype-v0`
- **Documentation:** `docs/` folder

---

*สร้างเมื่อ: 2026-08-31*
*สำหรับ: ทีมที่รับช่วงต่อจาก Prototype V0*
