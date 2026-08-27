"use client";

import React, { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { Pet } from '@/types';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (petData: Omit<Pet, 'id' | 'created_at'>) => void;
  ownerId: string;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  onAddPet,
  ownerId,
}) => {
  const [name, setName] = useState('');
  const species = 'แมว (Cat)';
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [microchipId, setMicrochipId] = useState('');
  const [colorMarking, setColorMarking] = useState('');
  const [isSpayed, setIsSpayed] = useState(false);
  const [notes, setNotes] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddPet({
      owner_id: ownerId,
      name: name.trim(),
      species,
      breed: breed.trim() || null,
      gender,
      birth_date: birthDate || null,
      weight: weight ? Number(weight) : null,
      microchip_id: microchipId.trim() || undefined,
      color_marking: colorMarking.trim() || undefined,
      is_spayed: isSpayed,
      notes: notes.trim() || undefined,
      avatar_url:
        avatarUrl ||
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
    });

    // Reset & close
    setName('');
    setBreed('');
    setAvatarUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDEEEB] text-[#E06D53] flex items-center justify-center font-bold">
              🐾
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">เพิ่มสัตว์เลี้ยงเข้าบ้าน</h3>
              <p className="text-xs text-[#8C867E]">สร้างบัตรประจำตัวพาสปอร์ตของน้อง</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C867E] hover:text-[#1F1E1D] hover:bg-[#E8E2D9]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-3xl overflow-hidden bg-[#FAF7F2] border-2 border-dashed border-[#E8E2D9] hover:border-[#E06D53] flex items-center justify-center cursor-pointer group shrink-0"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-[#8C867E] group-hover:text-[#E06D53]">
                  <Camera className="w-5 h-5" />
                  <span className="text-[9px] mt-1 font-bold">เพิ่มรูป</span>
                </div>
              )}
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#1F1E1D] block">รูปถ่ายของน้อง</span>
              <span className="text-[#8C867E]">รูปหน้าชัดๆ สำหรับบัตร Passport</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">ชื่อสัตว์เลี้ยง:</label>
              <input
                type="text"
                placeholder="เช่น น้องโมจิ, ถุงเงิน"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">สายพันธุ์:</label>
              <input
                type="text"
                placeholder="เช่น บริติช ช็อตแฮร์, ขาวมณี"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">เพศ:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
              >
                <option value="female">เพศเมีย (Female ♀)</option>
                <option value="male">เพศผู้ (Male ♂)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">วันเกิด:</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">น้ำหนัก (kg):</label>
              <input
                type="number"
                step="0.01"
                placeholder="เช่น 4.2"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">หมายเลขไมโครชิป (ถ้ามี):</label>
              <input
                type="text"
                placeholder="เช่น 90018200..."
                value={microchipId}
                onChange={(e) => setMicrochipId(e.target.value)}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1E1D] mb-1">สี / ลวดลายเด่น:</label>
            <input
              type="text"
              placeholder="เช่น ขาวล้วน ตาสองสี, ส้มลายเสือ"
              value={colorMarking}
              onChange={(e) => setColorMarking(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="spayed-check"
              checked={isSpayed}
              onChange={(e) => setIsSpayed(e.target.checked)}
              className="rounded text-[#E06D53] focus:ring-[#E06D53]"
            />
            <label htmlFor="spayed-check" className="text-xs text-[#1F1E1D] font-medium cursor-pointer">
              น้องทำหมันเรียบร้อยแล้ว (Spayed / Neutered)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1E1D] mb-1">บันทึกเพิ่มเติม:</label>
            <textarea
              placeholder="นิสัย ความชอบ หรือข้อมูลที่คนในบ้านควรรู้..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#59554F] hover:bg-[#FAF7F2]"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E06D53] hover:bg-[#CC573C] text-white text-xs font-bold shadow-md shadow-[#E06D53]/20"
            >
              สร้าง Passport ประจำตัว
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
