"use client";

import React, { useState } from 'react';
import { X, Users, Shield, ShieldCheck, Eye, Edit3, UserPlus, Trash2 } from 'lucide-react';
import { Family, FamilyMember, UserRole } from '@/types';

interface FamilyMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: Family;
  members: FamilyMember[];
  currentUserId: string;
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onRemoveMember: (userId: string) => void;
  onAddMemberDirectly: (name: string, email: string, role: UserRole) => void;
  onOpenQRInvite: () => void;
}

export const FamilyMembersModal: React.FC<FamilyMembersModalProps> = ({
  isOpen,
  onClose,
  family,
  members,
  currentUserId,
  onUpdateRole,
  onRemoveMember,
  onAddMemberDirectly,
  onOpenQRInvite,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('editor');

  if (!isOpen) return null;

  const isOwner = family.owner_id === currentUserId;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    onAddMemberDirectly(newName.trim(), newEmail.trim(), newRole);
    setNewName('');
    setNewEmail('');
    setShowAddForm(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FDEEEB] text-[#E06D53] border border-[#E06D53]/20">
            <ShieldCheck className="w-3 h-3" />
            เจ้าของบ้าน (Owner)
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E7F0E6] text-[#6B8E68] border border-[#6B8E68]/20">
            <Edit3 className="w-3 h-3" />
            ผู้ดูแลร่วม (Caretaker)
          </span>
        );
      case 'viewer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F3EFEA] text-[#8C867E] border border-[#E8E2D9]">
            <Eye className="w-3 h-3" />
            ผู้เข้าชม (Viewer)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF1E8] text-[#6B8E68] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">ผู้เลี้ยงร่วมในบ้าน (Co-owners)</h3>
              <p className="text-xs text-[#8C867E]">{family.name} • สมาชิกทั้งหมด {members.length} ท่าน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C867E] hover:text-[#1F1E1D] hover:bg-[#E8E2D9]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Permissions Explanation Card */}
          <div className="p-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E2D9] text-xs space-y-2">
            <div className="font-bold text-[#1F1E1D] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#C89933]" />
              <span>ระดับสิทธิ์การเข้าถึงข้อมูลในบ้าน</span>
            </div>
            <ul className="space-y-1 text-[#59554F] list-disc list-inside">
              <li><strong className="text-[#1F1E1D]">เจ้าของ (Owner):</strong> สิทธิ์เต็มทุกส่วน จัดการบ้าน สัตว์เลี้ยง สมาชิก และออก Digital Certificates</li>
              <li><strong className="text-[#1F1E1D]">ผู้ดูแลร่วม (Caretaker):</strong> สามารถบันทึก Life Journey, อัปเดตข้อมูลสุขภาพ และตรวจดูพาสปอร์ตได้</li>
              <li><strong className="text-[#1F1E1D]">ผู้เข้าชม (Viewer):</strong> เข้าชมพาสปอร์ต ไทม์ไลน์ และใบรับรองดิจิทัลได้โดยไม่สามารถแก้ไข</li>
            </ul>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C867E]">
                รายชื่อผู้ดูแล ({members.length})
              </h4>
              <button
                onClick={onOpenQRInvite}
                className="text-xs font-bold text-[#E06D53] hover:underline"
              >
                + เชิญด้วย QR Token
              </button>
            </div>

            {members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9] hover:border-[#D8E4D3] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E8E2D9] border border-white shadow-xs shrink-0">
                    {member.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.avatarUrl} alt={member.display_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#59554F]">
                        {member.display_name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1F1E1D] truncate">
                        {member.display_name}
                      </span>
                      {member.user_id === currentUserId && (
                        <span className="text-[10px] bg-[#E8E2D9] px-1.5 py-0.2 rounded text-[#59554F]">
                          คุณ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8C867E] truncate">{member.email || 'ผู้ใช้งานในระบบ'}</p>
                  </div>
                </div>

                {/* Role Switcher or Badge */}
                <div className="flex items-center gap-2">
                  {isOwner && member.role !== 'owner' ? (
                    <select
                      value={member.role}
                      onChange={(e) => onUpdateRole(member.user_id, e.target.value as UserRole)}
                      className="text-xs font-bold rounded-xl border border-[#E8E2D9] bg-white px-2.5 py-1.5 text-[#1F1E1D] focus:border-[#E06D53] outline-none"
                    >
                      <option value="editor">ผู้ดูแลร่วม (Caretaker)</option>
                      <option value="viewer">ผู้เข้าชม (Viewer)</option>
                    </select>
                  ) : (
                    getRoleBadge(member.role)
                  )}

                  {isOwner && member.role !== 'owner' && (
                    <button
                      onClick={() => onRemoveMember(member.user_id)}
                      className="p-1.5 text-[#8C867E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="ลบออกจากบ้าน"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Direct Add Member Form */}
          {showAddForm ? (
            <form onSubmit={handleAddSubmit} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E06D53]/30 space-y-3">
              <h5 className="font-bold text-xs text-[#1F1E1D]">เพิ่มสมาชิกโดยตรงด้วยอีเมล</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="ชื่อผู้เลี้ยง / สมาชิก"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E8E2D9] outline-none focus:border-[#E06D53]"
                />
                <input
                  type="email"
                  placeholder="อีเมล (เช่น fam@meowworld.life)"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="px-3 py-2 text-xs rounded-xl bg-white border border-[#E8E2D9] outline-none focus:border-[#E06D53]"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#59554F]">สิทธิ์:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="px-2 py-1 text-xs rounded-lg bg-white border border-[#E8E2D9] outline-none"
                  >
                    <option value="editor">ผู้ดูแลร่วม (Caretaker)</option>
                    <option value="viewer">ผู้เข้าชม (Viewer)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-[#8C867E] hover:text-[#1F1E1D]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-bold bg-[#6B8E68] text-white rounded-xl hover:bg-[#567554]"
                  >
                    บันทึกสมาชิก
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-dashed border-[#BDB7AE] hover:border-[#6B8E68] text-xs font-bold text-[#59554F] hover:text-[#6B8E68] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>เพิ่มผู้เลี้ยงร่วมด้วยอีเมล</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E8E2D9] flex items-center justify-between">
          <span className="text-xs text-[#8C867E]">
            ปลอดภัยด้วย Row-Level Security (RLS)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1F1E1D] text-white text-xs font-bold hover:bg-[#383532] transition-colors"
          >
            เรียบร้อย
          </button>
        </div>
      </div>
    </div>
  );
};
