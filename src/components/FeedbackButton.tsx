'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [type, setType] = useState<'bug' | 'feature' | 'other'>('other');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submitFeedback() {
    if (!feedback.trim()) return;
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Store feedback in a simple table or send to email
      // For now, we'll just log it
      console.log('Feedback:', {
        type,
        message: feedback,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFeedback('');
      }, 2000);
    } catch (error) {
      console.error('Feedback error:', error);
    }

    setSubmitting(false);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition z-50"
        title="ส่ง Feedback"
      >
        💬
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-gray-900">ขอบคุณ!</h3>
                <p className="text-gray-500">เราได้รับ feedback ของคุณแล้ว</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">💬 ส่ง Feedback</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'bug', label: '🐛 Bug' },
                        { value: 'feature', label: '💡 Feature Request' },
                        { value: 'other', label: '📝 อื่นๆ' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setType(option.value as typeof type)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            type === option.value
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความ</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="เล่าให้เราฟัง..."
                    />
                  </div>

                  <button
                    onClick={submitFeedback}
                    disabled={!feedback.trim() || submitting}
                    className="w-full bg-orange-500 text-white py-2 rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50"
                  >
                    {submitting ? 'กำลังส่ง...' : 'ส่ง Feedback'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
