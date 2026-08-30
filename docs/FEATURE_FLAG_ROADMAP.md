# 📈 Feature Flag Roadmap: ขั้นบันไดการเปิดใช้งาน

**เป้าหมาย:** เปิดฟีเจอร์ทีละ step ลดต้นทุน ใช้ Thai AI Pass ให้คุ้มค่าที่สุด

---

## 🗓️ แผนผัง 30 วัน (Thai AI Pass Period)

### Week 1: Foundation (วันที่ 1-7)
```
วันที่ 1: ลงทะเบียน Thai AI Pass + Fix RLS
วันที่ 2-3: ทดสอบ Core Flow (Login → Home → Pets → Journey)
วันที่ 4-5: ให้ 5 คนใกล้ตัวทดลองใช้
วันที่ 6-7: รวบรวม feedback + แก้ไข
```

**Flags ที่เปิด:** `home_mode` ✅
**Flags ที่ปิด:** ทุกอย่างอื่น ❌

---

### Week 2: Nest System (วันที่ 8-14)
```
วันที่ 8: เปิด nest_system flag
วันที่ 9-10: ทดสอบสร้างรัง + เพิ่มสัตว์ในรัง
วันที่ 11-12: ให้ผู้ใช้ทดลองสร้างรังของตัวเอง
วันท️ี่ 13-14: รวบรวม feedback + ปรับปรุง
```

**Flags ที่เปิด:** `home_mode` ✅, `nest_system` ✅
**Flags ที่ปิด:** ทุกอย่างอื่น ❌

---

### Week 3: Decoration + Storage (วันที่ 15-21)
```
วันที่ 15: เปิด decoration + family_package flags
วันที่ 16-17: ทดสอบตกแต่งบ้าน + ดูพื้นที่จัดเก็บ
วันที่ 18-19: ให้ผู้ใช้ทดลองตกแต่ง
วันที่ 20-21: รวบรวม feedback + ปรับปรุง
```

**Flags ที่เปิด:** `home_mode` ✅, `nest_system` ✅, `decoration` ✅, `family_package` ✅
**Flags ที่ปิด:** `community` ❌, `vet_market` ❌

---

### Week 4: Community + Market (วันที่ 22-30)
```
วันที่ 22: เปิด community + vet_market flags
วันที่ 23-24: ทดสอบโพสต์ชุมชน + ดูสินค้า
วันที่ 25-26: ให้ผู้ใช้ทดลองโพสต์
วันที่ 27-28: รวบรวม feedback สุดท้าย
วันที่ 29-30: Final polish + Launch!
```

**Flags ที่เปิด:** ทุกอย่าง ✅

---

## 📊 ตารางเปิด Flag

| Week | home_mode | nest_system | decoration | family_package | community | vet_market |
|---|---|---|---|---|---|---|
| 1 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 2 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| 3 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 💰 แผนการเงิน (30 วัน)

```
วันที่ 1-7:   ฟรี (Thai AI Pass)
วันที่ 8-14:  ฟรี (Thai AI Pass)
วันที่ 15-21: ฟรี (Thai AI Pass)
วันที่ 22-30: ฟรี (Thai AI Pass)

รวม: 0 บาท ตลอด 30 วัน! 🔥
```

**หลัง 30 วัน:**
- Supabase Free: 500MB, 50K MAU → พอสำหรับ 100-500 ผู้ใช้
- Vercel Hobby: 100GB bandwidth → พอสำหรับ 1000+ visits/เดือน
- ต้นทุนจริง: ~300 บาท/ปี (domain เท่านั้น)

---

## 🎯 Milestone แต่ละ Week

### Week 1 Milestone
- [x] Fix RLS infinite recursion
- [x] Home page ทำงานได้จริง
- [x] Login → Home → Pets → Journey flow สมบูรณ์
- [x] 5 คนทดลองใช้สำเร็จ

### Week 2 Milestone
- [ ] Nest system ทำงานได้จริง
- [ ] ผู้ใช้สร้างรังได้
- [ ] สัตว์เลี้ยงอยู่ในรังถูกต้อง

### Week 3 Milestone
- [ ] Decoration ทำงานได้จริง
- [ ] Family Package แสดงพื้นที่ถูกต้อง
- [ ] ผู้ใช้ตกแต่งบ้านได้

### Week 4 Milestone
- [ ] Community โพสต์ได้จริง
- [ ] Vet Market แสดงสินค้าได้
- [ ] พร้อม launch อย่างเป็นทางการ

---

## 📝 วิธีเปิด Flag

### ทาง SQL (เร็วที่สุด)
```sql
-- เปิดทีละ flag ตาม schedule
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'nest_system';
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'decoration';
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'family_package';
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'community';
UPDATE feature_flags SET is_enabled = true WHERE flag_name = 'vet_market';
```

### ทาง Admin Dashboard (ง่ายที่สุด)
1. เปิด `/admin/flags`
2. กด toggle แต่ละ flag
3. เปลี่ยนทันที ไม่ต้อง deploy ใหม่

---

## 🔄 Rollback Plan

ถ้าฟีเจอร์ไหนมีปัญหา:
```sql
-- ปิด flag ทันที
UPDATE feature_flags SET is_enabled = false WHERE flag_name = 'xxx';
```

หรือ:
1. เปิด `/admin/flags`
2. กด toggle ปิด
3. ผู้ใช้จะไม่เห็นฟีเจอร์นั้นอีก

---

## 📊 Metrics ที่ต้องติดตาม

| Week | Metrics ที่ดู |
|---|---|
| 1 | Login success rate, Home page load time |
| 2 | Nest creation rate, Pet per nest ratio |
| 3 | Decoration usage, Storage usage % |
| 4 | Community posts, Market transactions |

---

*สร้างเมื่อ: 2026-08-31*
*สำหรับ: Thai AI Pass 30-day period*
