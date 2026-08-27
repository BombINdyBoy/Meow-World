"use client";

import React from 'react';
import { Home, Award, BookOpen, LogOut, Sparkles, PlusCircle } from 'lucide-react';
import { Family, UserProfile, Pet } from '@/types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile | null;
  activeFamily: Family | null;
  pets: Pet[];
  onOpenNewPost: () => void;
  onOpenNewCert: () => void;
  onSignOut: () => void;
  onOpenFamilyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  activeFamily,
  pets,
  onOpenNewPost,
  onOpenNewCert,
  onSignOut,
  onOpenFamilyModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E2D9] px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Active Family House */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E06D53] to-[#C85338] flex items-center justify-center text-white shadow-md shadow-[#E06D53]/25 group-hover:shadow-lg transition-all">
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg text-[#1F1E1D] tracking-tight">Meow World</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FDEEEB] text-[#E06D53] uppercase tracking-wider border border-[#E06D53]/20">
                  Heart
                </span>
              </div>
              <p className="text-[11px] text-[#8C867E] hidden sm:block">A gentle sanctuary for your pet&apos;s life journey</p>
            </div>
          </button>

          {/* Current House Chip */}
          {activeFamily && (
            <button
              onClick={onOpenFamilyModal}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF1E8] border border-[#6B8E68]/20 text-[#2D452B] text-xs font-medium hover:bg-[#E2ECE0] transition-colors"
              title="คลิกเพื่อจัดการผู้เลี้ยงร่วมในบ้าน"
            >
              <span className="w-2 h-2 rounded-full bg-[#6B8E68] animate-pulse"></span>
              <span className="truncate max-w-[140px]">{activeFamily.name}</span>
              <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded-full text-[#59554F] font-mono">
                {pets.length} ตัว
              </span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-[#1F1E1D] text-white shadow-sm'
                : 'text-[#59554F] hover:bg-[#F3EFEA] hover:text-[#1F1E1D]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home Mode</span>
          </button>

          <button
            onClick={() => setCurrentTab('passport')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'passport'
                ? 'bg-[#1F1E1D] text-white shadow-sm'
                : 'text-[#59554F] hover:bg-[#F3EFEA] hover:text-[#1F1E1D]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Passports</span>
            {pets.length > 0 && (
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                currentTab === 'passport' ? 'bg-white/20 text-white' : 'bg-[#E8E2D9] text-[#59554F]'
              }`}>
                {pets.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('certificates')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'certificates'
                ? 'bg-[#C89933] text-white shadow-sm'
                : 'text-[#59554F] hover:bg-[#FCF8EE] hover:text-[#C89933]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Digital</span>
            <span>Certificates</span>
          </button>
        </nav>

        {/* Action Buttons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Certificate Button */}
          <button
            onClick={onOpenNewCert}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCF8EE] border border-[#C89933]/40 text-[#A4781E] text-xs font-semibold hover:bg-[#F9F0DB] transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ออก Certificate</span>
          </button>

          {/* Quick Post Button */}
          <button
            onClick={onOpenNewPost}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E06D53] text-white text-xs sm:text-sm font-bold hover:bg-[#CC573C] shadow-md shadow-[#E06D53]/20 hover:shadow-lg transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">บันทึกเรื่องราว</span>
            <span className="sm:hidden">บันทึก</span>
          </button>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E8E2D9]">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E2D9] bg-[#E8E2D9] shrink-0">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#59554F]">
                    {user.displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-[#8C867E] hover:text-[#E06D53] hover:bg-[#FDEEEB] transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
