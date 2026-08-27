"use client";

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Award, ArrowRight, Home, Lock, Mail, User } from 'lucide-react';

interface AuthScreenProps {
  onAuthenticate: (email: string, pass: string, mode: 'login' | 'signup', fullName?: string) => Promise<string | null>;
  onLoginDemo: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticate, onLoginDemo }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const errMsg = await onAuthenticate(email, password, authMode, fullName);
      if (errMsg) {
        setMessage(errMsg);
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#F3EFEA] to-[#EBF1E8] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E8E2D9] shadow-2xl overflow-hidden">
        {/* Left Side: Editorial Heart Edition Storytelling */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#1F1E1D] via-[#2A2723] to-[#38332E] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#E06D53]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-radial from-[#C89933]/15 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E06D53] to-[#C85338] flex items-center justify-center text-white text-xl shadow-md shadow-[#E06D53]/30">
                🐾
              </div>
              <div>
                <span className="font-serif font-bold text-xl tracking-tight text-[#FAF7F2]">Meow World</span>
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8D28A]/20 text-[#E8D28A] border border-[#E8D28A]/40 uppercase">
                  Heart Edition
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="text-[11px] font-mono tracking-widest text-[#E06D53] uppercase font-bold">
                A QUIET SANCTUARY FOR YOUR PET&apos;S JOURNEY
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                ทุกช่วงเวลาและทุกก้าวสำคัญ<br />
                <em className="text-[#E06D53] not-italic">มีคุณค่าเสมอ.</em>
              </h1>
              <p className="text-xs sm:text-sm text-[#BDB7AE] leading-relaxed">
                บันทึกไดอารี่ชีวิตสัตว์เลี้ยงอย่างเป็นส่วนตัว ออกใบรับรองดิจิทัล Meow World Digital Certificate ครอบทับเอกสารจริง และแชร์การดูแลร่วมกันในครอบครัวอย่างปลอดภัย
              </p>
            </div>
          </div>

          {/* Feature Badges List */}
          <div className="relative z-10 space-y-3 pt-8 border-t border-white/10 text-xs text-[#E8E2D9]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#E06D53] shrink-0">
                <Home className="w-3.5 h-3.5" />
              </div>
              <span><strong>Home Mode:</strong> ฟีดบันทึก Life Journey ไพรเวตเฉพาะคนในบ้าน</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#C89933] shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span><strong>Digital Certificate:</strong> ครอบทับและรับรองเอกสารจริงด้วยตรา QR ลิขสิทธิ์</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#6B8E68] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span><strong>Family QR Token:</strong> เชิญผู้เลี้ยงร่วมเข้าบ้านด้วย QR Code ปลอดภัย</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-2xl text-[#1F1E1D]">
                {authMode === 'login' ? 'ยินดีต้อนรับกลับบ้าน' : 'เริ่มต้นสร้างพาสปอร์ต'}
              </h2>
              <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'login' ? 'bg-white text-[#1F1E1D] shadow-2xs' : 'text-[#8C867E]'
                  }`}
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'signup' ? 'bg-white text-[#1F1E1D] shadow-2xs' : 'text-[#8C867E]'
                  }`}
                >
                  สมัครสมาชิก
                </button>
              </div>
            </div>

            {message && (
              <div className="p-3.5 rounded-2xl bg-[#FDEEEB] border border-[#E06D53]/30 text-xs text-[#C85338] font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">
                    ชื่อ-นามสกุล หรือชื่อเล่น:
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-[#8C867E] absolute left-3" />
                    <input
                      type="text"
                      placeholder="เช่น คุณแมวบอมบ์"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={authMode === 'signup'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] text-xs outline-none focus:border-[#E06D53]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1F1E1D] mb-1">อีเมล:</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#8C867E] absolute left-3" />
                  <input
                    type="email"
                    placeholder="name@meowworld.life"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] text-xs outline-none focus:border-[#E06D53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1D] mb-1">รหัสผ่าน:</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#8C867E] absolute left-3" />
                  <input
                    type="password"
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] text-xs outline-none focus:border-[#E06D53]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-2xl bg-[#1F1E1D] hover:bg-[#383532] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99] shadow-md"
              >
                <span>{busy ? 'กำลังดำเนินการ...' : authMode === 'login' ? 'เข้าสู่ระบบ Meow World' : 'สร้างบัญชีผู้ใช้งาน'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* 1-Click Demo Sandbox Option */}
          <div className="pt-6 mt-6 border-t border-[#E8E2D9] space-y-2">
            <div className="text-center">
              <span className="text-[11px] text-[#8C867E]">หรือทดลองใช้งานฟีเจอร์ทั้งหมดได้ทันที</span>
            </div>
            <button
              type="button"
              onClick={onLoginDemo}
              className="w-full py-3 rounded-2xl bg-[#FCF8EE] hover:bg-[#F9F0DB] border border-[#E8D28A] text-[#845E1B] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-[#C89933]" />
              <span>เข้าสู่ระบบเพื่อทดลองใช้งาน (Demo Exploration Mode)</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
