"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { HomeMode } from '@/components/home/HomeMode';
import { PassportView } from '@/components/passport/PassportView';
import { CertificateListView } from '@/components/certificate/CertificateListView';
import { FamilyMembersModal } from '@/components/home/FamilyMembersModal';
import { QRInviteModal } from '@/components/home/QRInviteModal';
import { DigitalCertificateModal } from '@/components/certificate/DigitalCertificateModal';
import { CertificateViewerModal } from '@/components/certificate/CertificateViewerModal';
import { AddPetModal } from '@/components/passport/AddPetModal';
import { JourneyComposer } from '@/components/home/JourneyComposer';
import {
  DigitalCertificate,
  EventCategory,
  Family,
  FamilyMember,
  JourneyEvent,
  Pet,
  UserProfile,
  UserRole,
} from '@/types';
import {
  CURRENT_USER,
  MOCK_CERTIFICATES,
  MOCK_EVENTS,
  MOCK_FAMILIES,
  MOCK_FAMILY_MEMBERS,
  MOCK_PETS,
} from '@/utils/mockData';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Core Application State
  const [activeFamily, setActiveFamily] = useState<Family | null>(MOCK_FAMILIES[0]);
  const [members, setMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [events, setEvents] = useState<JourneyEvent[]>(MOCK_EVENTS);
  const [certificates, setCertificates] = useState<DigitalCertificate[]>(MOCK_CERTIFICATES);
  const [selectedPetId, setSelectedPetId] = useState<string>(MOCK_PETS[0]?.id || '');

  // Modals & Drawers
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isQRInviteModalOpen, setIsQRInviteModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isNewCertModalOpen, setIsNewCertModalOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [viewingCert, setViewingCert] = useState<DigitalCertificate | null>(null);
  const [certTargetPetId, setCertTargetPetId] = useState<string | undefined>(undefined);

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const supabase = isConfigured ? createClient() : null;

  // Supabase Auth Listener
  useEffect(() => {
    if (!isConfigured || !supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'คุณผู้ดูแล',
          avatarUrl: data.user.user_metadata?.avatar_url,
        });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'คุณผู้ดูแล',
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      } else if (!isDemoMode) {
        setUser(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [isConfigured, isDemoMode, supabase]);

  // Load Real Supabase Data if logged in and configured
  const loadSupabaseData = useCallback(async () => {
    if (!user || isDemoMode || !supabase) return;

    try {
      const [petsRes, eventsRes, familiesRes, membersRes, certsRes] = await Promise.all([
        supabase.from('pets').select('*').order('created_at', { ascending: false }),
        supabase.from('life_journey_events').select('*').order('event_date', { ascending: false }),
        supabase.from('families').select('*').order('created_at', { ascending: false }),
        supabase.from('family_members').select('*'),
        supabase.from('digital_certificates').select('*').order('created_at', { ascending: false }),
      ]);

      if (petsRes.data && petsRes.data.length > 0) {
        setPets(petsRes.data as Pet[]);
        if (!selectedPetId) setSelectedPetId(petsRes.data[0].id);
      }
      if (eventsRes.data && eventsRes.data.length > 0) {
        setEvents(eventsRes.data as JourneyEvent[]);
      }
      if (familiesRes.data && familiesRes.data.length > 0) {
        setActiveFamily(familiesRes.data[0] as Family);
      }
      if (membersRes.data && membersRes.data.length > 0) {
        setMembers(membersRes.data as FamilyMember[]);
      }
      if (certsRes.data && certsRes.data.length > 0) {
        setCertificates(certsRes.data as DigitalCertificate[]);
      }
    } catch (err) {
      console.warn('Using local store fallback', err);
    }
  }, [user, isDemoMode, selectedPetId, supabase]);

  useEffect(() => {
    if (user && !isDemoMode) {
      const timer = window.setTimeout(() => {
        void loadSupabaseData();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [user, isDemoMode, loadSupabaseData]);

  // Auth Handlers
  const handleAuthenticate = async (
    email: string,
    pass: string,
    mode: 'login' | 'signup',
    fullName?: string
  ): Promise<string | null> => {
    if (!isConfigured || !supabase) {
      setUser({
        id: 'usr-local-01',
        email,
        displayName: fullName || email.split('@')[0],
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      return null;
    }

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { full_name: fullName } },
      });
      if (error) return error.message;
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return error.message;
    }
    return null;
  };

  const handleLoginDemo = () => {
    setIsDemoMode(true);
    setUser(CURRENT_USER);
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsDemoMode(false);
    setUser(null);
  };

  // Determine current user's role in active family
  const currentMember = members.find((m) => m.user_id === user?.id);
  const userRole: UserRole = activeFamily?.owner_id === user?.id ? 'owner' : currentMember?.role || 'owner';

  // State Handlers: Add Post / Journey Event
  const handleAddEvent = (eventData: {
    pet_id?: string;
    tagged_pet_ids?: string[];
    tagged_user_ids?: string[];
    event_date: string;
    event_type: EventCategory;
    title: string;
    description: string;
    image_url?: string;
    video_url?: string;
    location?: string;
  }) => {
    const newEvt: JourneyEvent = {
      id: `evt-${Date.now()}`,
      ...eventData,
      author_id: user?.id,
      author_name: user?.displayName || 'คุณผู้ดูแล',
      author_avatar: user?.avatarUrl,
      likes_count: 0,
      is_liked: false,
      comments: [],
      created_at: new Date().toISOString(),
    };

    setEvents([newEvt, ...events]);
    setIsNewPostModalOpen(false);

    // Save to Supabase if connected
    if (supabase && user && !isDemoMode) {
      supabase.from('life_journey_events').insert({
        pet_id: eventData.pet_id || (pets[0]?.id ?? null),
        event_date: eventData.event_date,
        event_type: eventData.event_type,
        title: eventData.title,
        description: eventData.description,
      });
    }
  };

  // Toggle Heart Like
  const handleToggleLike = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const isLiked = !evt.is_liked;
          return {
            ...evt,
            is_liked: isLiked,
            likes_count: isLiked ? (evt.likes_count || 0) + 1 : Math.max(0, (evt.likes_count || 0) - 1),
          };
        }
        return evt;
      })
    );
  };

  // Add Comment
  const handleAddComment = (eventId: string, content: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const newComment = {
            id: `cmt-${Date.now()}`,
            event_id: eventId,
            user_id: user?.id || 'usr-guest',
            user_name: user?.displayName || 'ผู้ร่วมดูแล',
            user_avatar: user?.avatarUrl,
            content,
            created_at: new Date().toISOString(),
          };
          return {
            ...evt,
            comments: [...(evt.comments || []), newComment],
          };
        }
        return evt;
      })
    );
  };

  // Delete Post
  const handleDeleteEvent = (eventId: string) => {
    if (confirm('คุณต้องการลบโพสต์นี้ใช่หรือไม่?')) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (supabase && !isDemoMode) {
        supabase.from('life_journey_events').delete().eq('id', eventId);
      }
    }
  };

  // Save Generated Digital Certificate & Auto-Log Milestone Event
  const handleSaveCertificate = (cert: DigitalCertificate) => {
    setCertificates([cert, ...certificates]);

    const autoEvent: JourneyEvent = {
      id: `evt-cert-${Date.now()}`,
      pet_id: cert.pet_id,
      tagged_pet_ids: [cert.pet_id],
      tagged_user_ids: [user?.id || 'usr-heart-001'],
      author_id: user?.id,
      author_name: user?.displayName || 'ระบบ Meow World',
      author_avatar: user?.avatarUrl,
      event_date: cert.issue_date,
      event_type: 'certificate',
      title: `👑 ได้รับใบรับรองดิจิทัล: ${cert.title} ✨`,
      description: `ถ่ายภาพเอกสารจริงและ Generate Meow World Digital Certificate เลขที่ ${cert.certificate_no} ครอบทับเอกสารจริงเรียบร้อยแล้ว มีตราประทับ Hologram และ QR Code ตรวจสอบความแท้จริง`,
      image_url: cert.original_doc_url,
      certificate_id: cert.id,
      likes_count: 1,
      is_liked: true,
      comments: [],
      created_at: new Date().toISOString(),
    };
    setEvents([autoEvent, ...events]);

    if (supabase && !isDemoMode) {
      supabase.from('digital_certificates').insert(cert);
    }
  };

  // Add Pet & Auto-Log Birth & Passport Milestones
  const handleAddPet = (petData: Omit<Pet, 'id' | 'created_at'>) => {
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      ...petData,
      created_at: new Date().toISOString(),
    };
    setPets([newPet, ...pets]);
    setSelectedPetId(newPet.id);

    const newMilestones: JourneyEvent[] = [];

    // 1. If birth_date is provided, create a birth celebration memory
    if (petData.birth_date) {
      newMilestones.push({
        id: `evt-birth-${Date.now()}`,
        pet_id: newPet.id,
        tagged_pet_ids: [newPet.id],
        tagged_user_ids: [user?.id || 'usr-heart-001'],
        author_id: user?.id,
        author_name: user?.displayName || 'เจ้าของบ้าน',
        author_avatar: user?.avatarUrl,
        event_date: petData.birth_date,
        event_type: 'birth',
        title: `🐣 บันทึกแรกเกิด: ยินดีต้อนรับ ${newPet.name} สู่โลกใบนี้ 🍼`,
        description: `น้องเกิดเมื่อวันที่ ${petData.birth_date} สายพันธุ์ ${petData.breed || petData.species} เป็นจุดเริ่มต้นของ Life Journey`,
        image_url: newPet.avatar_url,
        likes_count: 5,
        is_liked: true,
        comments: [],
        created_at: new Date().toISOString(),
      });
    }

    // 2. Passport registration event
    newMilestones.push({
      id: `evt-passport-${Date.now() + 1}`,
      pet_id: newPet.id,
      tagged_pet_ids: [newPet.id],
      tagged_user_ids: [user?.id || 'usr-heart-001'],
      author_id: user?.id,
      author_name: user?.displayName || 'เจ้าของบ้าน',
      author_avatar: user?.avatarUrl,
      event_date: new Date().toISOString().split('T')[0],
      event_type: 'passport',
      title: `📘 เปิด Living Passport ประจำตัวของ ${newPet.name} อย่างเป็นทางการ`,
      description: `สร้างบัตรพาสปอร์ตประจำตัวและเริ่มบันทึกการเดินทางของชีวิตใน Meow World Heart Edition`,
      image_url: newPet.avatar_url,
      likes_count: 4,
      is_liked: true,
      comments: [],
      created_at: new Date().toISOString(),
    });

    setEvents([...newMilestones, ...events]);

    if (supabase && !isDemoMode) {
      supabase.from('pets').insert(newPet);
    }
  };

  // Update Pet
  const handleUpdatePet = (updatedPet: Pet) => {
    setPets((prev) => prev.map((p) => (p.id === updatedPet.id ? updatedPet : p)));
    if (supabase && !isDemoMode) {
      supabase.from('pets').update(updatedPet).eq('id', updatedPet.id);
    }
  };

  // Co-owner Member Management
  const handleUpdateMemberRole = (memberUserId: string, newRole: UserRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.user_id === memberUserId ? { ...m, role: newRole } : m))
    );
  };

  const handleRemoveMember = (memberUserId: string) => {
    if (confirm('คุณต้องการลบผู้เลี้ยงร่วมท่านนี้ออกจากบ้านใช่หรือไม่?')) {
      setMembers((prev) => prev.filter((m) => m.user_id !== memberUserId));
    }
  };

  const handleAddMemberDirectly = (name: string, email: string, role: UserRole) => {
    const newMember: FamilyMember = {
      family_id: activeFamily?.id || 'fam-meow-villa',
      user_id: `usr-${Date.now()}`,
      display_name: name,
      email,
      role,
      joined_at: new Date().toISOString(),
    };
    setMembers([...members, newMember]);
    alert(`เพิ่ม ${name} เป็นผู้ร่วมดูแลเรียบร้อยแล้ว!`);
  };

  // Join House with QR Token
  const handleJoinWithToken = (token: string): boolean => {
    if (token.toUpperCase().includes('MW-FAM')) {
      const newMember: FamilyMember = {
        family_id: activeFamily?.id || 'fam-meow-villa',
        user_id: user?.id || `usr-${Date.now()}`,
        display_name: user?.displayName || 'ผู้ร่วมดูแลใหม่',
        email: user?.email,
        role: 'editor',
        joined_at: new Date().toISOString(),
      };
      setMembers([...members, newMember]);
      return true;
    }
    return false;
  };

  const handleViewCertById = (certId: string) => {
    const targetCert = certificates.find((c) => c.id === certId);
    if (targetCert) {
      setViewingCert(targetCert);
    }
  };

  // If not logged in, show polished Auth screen
  if (!user) {
    return <AuthScreen onAuthenticate={handleAuthenticate} onLoginDemo={handleLoginDemo} />;
  }

  const viewingPet = pets.find((p) => p.id === viewingCert?.pet_id);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] flex flex-col selection:bg-[#E06D53]/20 selection:text-[#E06D53]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        activeFamily={activeFamily}
        pets={pets}
        onOpenNewPost={() => setIsNewPostModalOpen(true)}
        onOpenNewCert={() => {
          setCertTargetPetId(selectedPetId || pets[0]?.id);
          setIsNewCertModalOpen(true);
        }}
        onSignOut={handleSignOut}
        onOpenFamilyModal={() => setIsMembersModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {currentTab === 'home' && (
          <HomeMode
            family={activeFamily || MOCK_FAMILIES[0]}
            members={members}
            pets={pets}
            events={events}
            currentUser={user}
            userRole={userRole}
            onOpenMembersModal={() => setIsMembersModalOpen(true)}
            onOpenQRInviteModal={() => setIsQRInviteModalOpen(true)}
            onSelectPet={(id) => {
              setSelectedPetId(id);
              setCurrentTab('passport');
            }}
            onAddNewPet={() => setIsAddPetModalOpen(true)}
            onAddEvent={handleAddEvent}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onDeleteEvent={handleDeleteEvent}
            onViewCertById={handleViewCertById}
          />
        )}

        {currentTab === 'passport' && (
          <PassportView
            pets={pets}
            selectedPetId={selectedPetId}
            onSelectPet={setSelectedPetId}
            certificates={certificates}
            events={events}
            currentUser={user}
            userRole={userRole}
            onAddNewPet={() => setIsAddPetModalOpen(true)}
            onUpdatePet={handleUpdatePet}
            onOpenNewCert={(petId) => {
              setCertTargetPetId(petId);
              setIsNewCertModalOpen(true);
            }}
            onViewCert={(cert) => setViewingCert(cert)}
            onOpenNewPost={() => setIsNewPostModalOpen(true)}
          />
        )}

        {currentTab === 'certificates' && (
          <CertificateListView
            certificates={certificates}
            pets={pets}
            userRole={userRole}
            onOpenNewCert={(petId) => {
              setCertTargetPetId(petId || selectedPetId || pets[0]?.id);
              setIsNewCertModalOpen(true);
            }}
            onViewCert={(cert) => setViewingCert(cert)}
          />
        )}
      </main>

      {/* Global Floating Modals */}
      {/* 1. Co-owners & Family Members Modal */}
      {activeFamily && (
        <FamilyMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => setIsMembersModalOpen(false)}
          family={activeFamily}
          members={members}
          currentUserId={user.id}
          onUpdateRole={handleUpdateMemberRole}
          onRemoveMember={handleRemoveMember}
          onAddMemberDirectly={handleAddMemberDirectly}
          onOpenQRInvite={() => {
            setIsMembersModalOpen(false);
            setIsQRInviteModalOpen(true);
          }}
        />
      )}

      {/* 2. QR Token Invite Modal */}
      {activeFamily && (
        <QRInviteModal
          isOpen={isQRInviteModalOpen}
          onClose={() => setIsQRInviteModalOpen(false)}
          family={activeFamily}
          currentUserName={user.displayName}
          onJoinWithToken={handleJoinWithToken}
        />
      )}

      {/* 3. Meow World Digital Certificate Generator Modal */}
      <DigitalCertificateModal
        isOpen={isNewCertModalOpen}
        onClose={() => setIsNewCertModalOpen(false)}
        pets={pets}
        selectedPetId={certTargetPetId}
        user={user}
        onSaveCertificate={handleSaveCertificate}
      />

      {/* 4. Certificate Full Viewer Modal */}
      <CertificateViewerModal
        isOpen={Boolean(viewingCert)}
        onClose={() => setViewingCert(null)}
        cert={viewingCert}
        pet={viewingPet}
      />

      {/* 5. Add Pet to Household Modal */}
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onAddPet={handleAddPet}
        ownerId={user.id}
      />

      {/* 6. Life Journey Post Creator Modal */}
      {isNewPostModalOpen && (
        <JourneyComposer
          pets={pets}
          members={members}
          user={user}
          onAddEvent={handleAddEvent}
          isOpenModal={true}
          onCloseModal={() => setIsNewPostModalOpen(false)}
        />
      )}
    </div>
  );
}
