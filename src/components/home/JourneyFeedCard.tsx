"use client";

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  MapPin,
  Trash2,
  Send,
  Video,
  Award,
  Users,
  ExternalLink,
} from 'lucide-react';
import { EventCategory, FamilyMember, JourneyEvent, Pet, UserProfile } from '@/types';

interface JourneyFeedCardProps {
  event: JourneyEvent;
  pets: Pet[];
  members?: FamilyMember[];
  currentUser: UserProfile;
  canEdit: boolean;
  onToggleLike: (eventId: string) => void;
  onAddComment: (eventId: string, commentText: string) => void;
  onDeleteEvent?: (eventId: string) => void;
  onViewCertById?: (certId: string) => void;
}

export const JourneyFeedCard: React.FC<JourneyFeedCardProps> = ({
  event,
  pets,
  members = [],
  currentUser,
  canEdit,
  onToggleLike,
  onAddComment,
  onDeleteEvent,
  onViewCertById,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showFullImage, setShowFullImage] = useState(false);

  // Find all tagged pets
  const taggedPets = pets.filter((p) =>
    event.tagged_pet_ids ? event.tagged_pet_ids.includes(p.id) : event.pet_id === p.id
  );

  // Find all tagged co-owners
  const taggedMembers = members.filter((m) =>
    event.tagged_user_ids ? event.tagged_user_ids.includes(m.user_id) : false
  );

  const getCategoryBadge = (category: EventCategory) => {
    switch (category) {
      case 'birth':
        return { label: 'แรกเกิด & วัยเด็ก', icon: '🐣', bg: 'bg-orange-50 text-orange-900 border-orange-200' };
      case 'passport':
        return { label: 'สร้างพาสปอร์ต', icon: '📘', bg: 'bg-sky-50 text-sky-900 border-sky-200' };
      case 'certificate':
        return { label: 'ใบรับรองดิจิทัล', icon: '👑', bg: 'bg-yellow-50 text-yellow-900 border-yellow-200' };
      case 'vaccine':
        return { label: 'วัคซีน & ถ่ายพยาธิ', icon: '💉', bg: 'bg-blue-50 text-blue-900 border-blue-200' };
      case 'medical':
        return { label: 'ตรวจสุขภาพ', icon: '🩺', bg: 'bg-purple-50 text-purple-900 border-purple-200' };
      case 'milestone':
        return { label: 'ก้าวสำคัญ', icon: '🏠', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
      case 'birthday':
        return { label: 'วันเกิด / ฉลอง', icon: '🎂', bg: 'bg-pink-50 text-pink-900 border-pink-200' };
      case 'grooming':
        return { label: 'กรูมมิ่ง', icon: '✂️', bg: 'bg-teal-50 text-teal-900 border-teal-200' };
      case 'memory':
      default:
        return { label: 'ความทรงจำ', icon: '🌟', bg: 'bg-amber-50 text-amber-900 border-amber-200' };
    }
  };

  const badge = getCategoryBadge(event.event_type);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(event.id, commentText.trim());
    setCommentText('');
  };

  const primaryPet = taggedPets[0] || pets[0];

  return (
    <article className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Card Header: Author, Tagged Pets, Category Badge */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-[#F0EAE2]">
        <div className="flex items-center gap-3 min-w-0">
          {/* Author Avatar & Pet Avatars */}
          <div className="relative shrink-0 flex items-center">
            {/* Primary Pet Avatar */}
            <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F3EFEA] border-2 border-white shadow-xs">
              {primaryPet?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={primaryPet.avatar_url} alt={primaryPet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#E06D53]">
                  🐾
                </div>
              )}
            </div>
            {/* Author Bubble */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full overflow-hidden border border-white bg-[#E06D53] text-white text-[9px] font-bold flex items-center justify-center shadow-2xs">
              {event.author_name ? event.author_name.slice(0, 1) : 'Me'}
            </div>
          </div>

          <div className="min-w-0">
            {/* Tagged Pets List */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-[#1F1E1D]">
                {taggedPets.length > 0
                  ? taggedPets.map((p) => p.name).join(', ')
                  : 'สัตว์เลี้ยงในบ้าน'}
              </span>
              <span className="text-[11px] text-[#8C867E]">
                • บันทึกโดย <strong className="text-[#59554F]">{event.author_name || currentUser.displayName}</strong>
              </span>
            </div>

            {/* Date & Location */}
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8C867E]">
              <span className="font-mono">{event.event_date}</span>
              {event.location && (
                <span className="flex items-center gap-0.5 truncate max-w-[140px]">
                  <MapPin className="w-3 h-3 text-[#E06D53]" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Pill & Actions */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </span>

          {canEdit && onDeleteEvent && (
            <button
              onClick={() => onDeleteEvent(event.id)}
              className="p-1.5 text-[#BDB7AE] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="ลบโพสต์"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tagged Co-owners Strip (if any) */}
      {taggedMembers.length > 0 && (
        <div className="px-5 py-1.5 bg-[#FAF7F2]/80 border-b border-[#F0EAE2] flex items-center gap-2 text-[11px] text-[#59554F]">
          <Users className="w-3 h-3 text-[#6B8E68]" />
          <span>ผู้ร่วมช่วงเวลา:</span>
          <div className="flex flex-wrap gap-1">
            {taggedMembers.map((m) => (
              <span key={m.user_id} className="font-bold text-[#1F1E1D]">
                @{m.display_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Card Content & Text */}
      <div className="p-4 sm:p-5 space-y-3">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F1E1D] leading-snug">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-xs sm:text-sm text-[#59554F] leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        )}

        {/* If certificate milestone, show quick action */}
        {event.event_type === 'certificate' && event.certificate_id && onViewCertById && (
          <button
            onClick={() => onViewCertById(event.certificate_id!)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCF8EE] border border-[#E8D28A] text-[#845E1B] text-xs font-bold hover:bg-[#F9F0DB] transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-[#C89933]" />
            <span>ตรวจดูใบรับรองดิจิทัล Meow World ฉบับเต็ม</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>

      {/* Card Video Player (if video URL attached) */}
      {event.video_url && (
        <div className="relative bg-black rounded-2xl mx-4 mb-4 overflow-hidden shadow-inner">
          <video
            src={event.video_url}
            controls
            playsInline
            className="w-full max-h-[380px] object-cover"
          >
            Your browser does not support video playback.
          </video>
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
            <Video className="w-3 h-3 text-purple-400" />
            <span>VIDEO MOMENT</span>
          </div>
        </div>
      )}

      {/* Card Image (if photo attached and not already video) */}
      {!event.video_url && event.image_url && (
        <div
          className="relative overflow-hidden bg-[#F3EFEA] max-h-[460px] cursor-pointer group"
          onClick={() => setShowFullImage(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-2xs">
            คลิกเพื่อดูภาพขนาดเต็ม
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showFullImage && event.image_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image_url} alt={event.title} className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Social Action Bar (Like, Comment) */}
      <div className="px-4 sm:px-5 py-3 border-t border-[#F0EAE2] bg-[#FAF7F2]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Heart Like Button */}
          <button
            onClick={() => onToggleLike(event.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90 ${
              event.is_liked
                ? 'bg-[#FDEEEB] text-[#E06D53]'
                : 'text-[#59554F] hover:bg-[#F3EFEA] hover:text-[#E06D53]'
            }`}
          >
            <Heart className={`w-4 h-4 ${event.is_liked ? 'fill-[#E06D53] text-[#E06D53]' : ''}`} />
            <span>{event.likes_count || 0}</span>
          </button>

          {/* Comment Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              showComments
                ? 'bg-[#EBF1E8] text-[#6B8E68]'
                : 'text-[#59554F] hover:bg-[#F3EFEA] hover:text-[#1F1E1D]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{event.comments?.length || 0} ความคิดเห็น</span>
          </button>
        </div>

        <span className="text-[11px] text-[#8C867E]">
          Meow Life Story
        </span>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#F0EAE2] space-y-3">
          <div className="space-y-2.5">
            {event.comments && event.comments.length > 0 ? (
              event.comments.map((cmt) => (
                <div key={cmt.id} className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-[#E8E2D9]/70">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-[#E8E2D9] shrink-0 border border-white shadow-2xs">
                    {cmt.user_avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cmt.user_avatar} alt={cmt.user_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-[#59554F]">
                        {cmt.user_name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-[#1F1E1D]">{cmt.user_name}</span>
                      <time className="text-[10px] text-[#8C867E] font-mono">
                        {new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                    <p className="text-xs text-[#59554F] mt-0.5">{cmt.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-[#8C867E] py-2">
                ยังไม่มีบันทึกพูดคุย เริ่มต้นให้กำลังใจผู้ร่วมดูแลคนแรกได้เลย!
              </p>
            )}
          </div>

          {/* Comment Input Box */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="เขียนบันทึกหรือความเห็นถึงผู้เลี้ยงร่วม..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D9] outline-none focus:border-[#6B8E68]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-[#6B8E68] text-white hover:bg-[#567554] disabled:opacity-50 text-xs font-bold transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
