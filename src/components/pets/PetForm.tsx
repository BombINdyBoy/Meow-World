'use client';

import { useState } from 'react';
import { Pet, PetFormData } from '@/types/pet';

interface PetFormProps {
  pet?: Pet;
  onSubmit: (data: PetFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PetForm({ pet, onSubmit, onCancel, isLoading = false }: PetFormProps) {
  const [formData, setFormData] = useState<PetFormData>({
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    birth_date: pet?.birth_date ? pet.birth_date.substring(0, 10) : '',
    weight: pet?.weight || undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อสัตว์เลี้ยง *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เช่น เจ้าดำ, มิ้วมิ้ว"
        />
      </div>

      <div>
        <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
          ชนิดสัตว์ *
        </label>
        <input
          type="text"
          id="species"
          required
          value={formData.species}
          onChange={(e) => setFormData({ ...formData, species: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เช่น แมว, สุนัข"
        />
      </div>

      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
          สายพันธุ์
        </label>
        <input
          type="text"
          id="breed"
          value={formData.breed}
          onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เช่น เปอร์เซีย, โกลเด้น รีทรีฟเวอร์"
        />
      </div>

      <div>
        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">
          วันเกิด
        </label>
        <input
          type="date"
          id="birth_date"
          value={formData.birth_date}
          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
          น้ำหนัก (กก.)
        </label>
        <input
          type="number"
          id="weight"
          step="0.01"
          min="0"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เช่น 4.5"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'กำลังบันทึก...' : pet ? 'อัปเดต' : 'สร้าง'}
        </button>
      </div>
    </form>
  );
}
