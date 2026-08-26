'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pet, PetFormData } from '@/types/pet';
import { PetCard } from '@/components/pets/PetCard';
import { PetForm } from '@/components/pets/PetForm';
import { createClient } from '@/utils/supabase/client';

export default function PetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchPets();
  }, []);

  async function fetchPets() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: PetFormData) {
    try {
      setSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('ไม่พบข้อมูลผู้ใช้');

      const { error } = await supabase.from('pets').insert({
        ...data,
        owner_id: user.id,
      });

      if (error) throw error;

      setShowForm(false);
      fetchPets();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(data: PetFormData) {
    if (!editingPet) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('pets')
        .update(data)
        .eq('id', editingPet.id);

      if (error) throw error;

      setEditingPet(undefined);
      fetchPets();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(pet: Pet) {
    if (!confirm(`คุณต้องการลบ "${pet.name}" ใช่หรือไม่?`)) return;

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', pet.id);

      if (error) throw error;

      fetchPets();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">เกิดข้อผิดพลาด: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pet Passport</h1>
            <p className="text-gray-600 mt-1">จัดการข้อมูลสัตว์เลี้ยงของคุณ</p>
          </div>
          {!showForm && !editingPet && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + เพิ่มสัตว์เลี้ยง
            </button>
          )}
        </div>

        {/* Form Modal */}
        {(showForm || editingPet) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingPet ? 'แก้ไขข้อมูลสัตว์เลี้ยง' : 'เพิ่มสัตว์เลี้ยงใหม่'}
              </h2>
              <PetForm
                pet={editingPet}
                onSubmit={editingPet ? handleUpdate : handleCreate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPet(undefined);
                }}
                isLoading={submitting}
              />
            </div>
          </div>
        )}

        {/* Pet List */}
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              ยังไม่มีสัตว์เลี้ยง
            </h3>
            <p className="text-gray-500 mb-6">
              เริ่มสร้าง Passport ให้สัตว์เลี้ยงของคุณกันเลย
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + เพิ่มสัตว์เลี้ยงแรก
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onView={(pet) => router.push(`/pets/${pet.id}`)}
                onEdit={(pet) => setEditingPet(pet)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
