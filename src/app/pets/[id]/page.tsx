'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pet, LifeJourneyEvent, LifeJourneyEventFormData } from '@/types/pet';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { createClient } from '@/utils/supabase/client';

const EVENT_TYPES = [
  { value: 'medical', label: 'การรักษาพยาบาล', color: 'bg-red-100 text-red-800' },
  { value: 'vaccine', label: 'วัคซีน', color: 'bg-blue-100 text-blue-800' },
  { value: 'milestone', label: 'พัฒนาการ', color: 'bg-green-100 text-green-800' },
  { value: 'memory', label: 'ความทรงจำ', color: 'bg-purple-100 text-purple-800' },
];

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [events, setEvents] = useState<LifeJourneyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchPetData();
  }, [petId]);

  async function fetchPetData() {
    try {
      setLoading(true);
      
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();

      if (petError) throw petError;
      setPet(petData);

      const { data: eventsData, error: eventsError } = await supabase
        .from('life_journey_events')
        .select('*')
        .eq('pet_id', petId)
        .order('event_date', { ascending: false });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEvent(data: LifeJourneyEventFormData) {
    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('life_journey_events')
        .insert({
          ...data,
          pet_id: petId,
        });

      if (error) throw error;

      setShowEventForm(false);
      fetchPetData();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    if (!confirm('คุณต้องการลบเหตุการณ์นี้ใช่หรือไม่?')) return;

    try {
      const { error } = await supabase
        .from('life_journey_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      fetchPetData();
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

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">เกิดข้อผิดพลาด: {error || 'ไม่พบข้อมูล'}</div>
      </div>
    );
  }

  const age = pet.birth_date ? calculateAge(pet.birth_date) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/pets')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← กลับไปหน้ารายชื่อ
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-600 mt-1">
                {pet.species}{pet.breed && ` - ${pet.breed}`}
                {age && ` • ${age}`}
              </p>
            </div>
            <button
              onClick={() => router.push(`/pets/${petId}/edit`)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              แก้ไขข้อมูล
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            {pet.birth_date && (
              <div>
                <p className="text-sm text-gray-500">วันเกิด</p>
                <p className="font-medium">
                  {format(new Date(pet.birth_date), 'd MMM yyyy', { locale: th })}
                </p>
              </div>
            )}
            {pet.weight && (
              <div>
                <p className="text-sm text-gray-500">น้ำหนัก</p>
                <p className="font-medium">{pet.weight} กก.</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">สร้างเมื่อ</p>
              <p className="font-medium">
                {format(new Date(pet.created_at), 'd MMM yyyy', { locale: th })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">อัปเดตล่าสุด</p>
              <p className="font-medium">
                {format(new Date(pet.updated_at), 'd MMM yyyy HH:mm', { locale: th })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Life Journey</h2>
            <button
              onClick={() => setShowEventForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + เพิ่มเหตุการณ์
            </button>
          </div>

          {showEventForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">เพิ่มเหตุการณ์ใหม่</h3>
                <EventForm
                  onSubmit={handleAddEvent}
                  onCancel={() => setShowEventForm(false)}
                  isLoading={submitting}
                />
              </div>
            </div>
          )}

          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีเหตุการณ์ใน Life Journey
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const eventType = EVENT_TYPES.find(e => e.value === event.event_type);
                return (
                  <div
                    key={event.id}
                    className="border-l-4 border-blue-500 pl-4 py-2 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${eventType?.color || 'bg-gray-100 text-gray-800'}`}>
                            {eventType?.label || event.event_type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(event.event_date), 'd MMM yyyy', { locale: th })}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        {event.description && (
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800 text-sm ml-4"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: LifeJourneyEventFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<LifeJourneyEventFormData>({
    event_date: new Date().toISOString().substring(0, 10),
    event_type: 'memory',
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          วันที่ *
        </label>
        <input
          type="date"
          required
          value={formData.event_date}
          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ประเภทเหตุการณ์ *
        </label>
        <select
          required
          value={formData.event_type}
          onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          หัวข้อ *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เช่น ฉีดวัคซีนเข็มแรก, เดินได้ก้าวแรก"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          รายละเอียด
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="เพิ่มเติมรายละเอียด..."
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
          {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>
    </form>
  );
}

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (years > 0) {
    return `${years} ปี`;
  } else if (months > 0) {
    return `${months} เดือน`;
  } else {
    return 'แรกเกิด';
  }
}
