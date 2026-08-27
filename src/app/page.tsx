"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Family, FamilyMember, JourneyEvent, Pet, UserProfile, UserRole } from "@/types";
import { HomeMode } from "@/components/home/HomeMode";
import { FamilyMembersModal } from "@/components/home/FamilyMembersModal";
import { QRInviteModal } from "@/components/home/QRInviteModal";

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  // Core States - Meow World Home Foundation
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Family & Home Data
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<JourneyEvent[]>([]);
  
  // Current User Context
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  
  // Modal States
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  // UI State for Empty/Living Mode (Psychological States)
  const [viewState, setViewState] = useState<'loading' | 'nesting' | 'living'>('loading');

  // 1. Initialize Home Experience on Mount
  useEffect(() => {
    async function initHomeExperience() {
      try {
        // ดึง Session ผู้ใช้ปัจจุบัน
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }
        setSession(session);

        // สร้าง UserProfile จาก Session
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'เพื่อนแมว',
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        setCurrentUser(userProfile);

        // ค้นหาบ้าน/ครอบครัว ของผู้ใช้
        const { data: memberData } = await supabase
          .from("home_members")
          .select("homes(id, name, owner_id), role")
          .eq("user_id", session.user.id)
          .single();

        let currentFamily: Family | null = null;
        let currentRole: UserRole = 'viewer';

        if (memberData && memberData.homes) {
          // กรณีที่ 1: มีบ้านอยู่แล้ว
          currentFamily = {
            id: memberData.homes.id,
            name: memberData.homes.name,
            owner_id: memberData.homes.owner_id,
            created_at: new Date().toISOString(),
          };
          currentRole = memberData.role as UserRole;
          setFamily(currentFamily);
          setUserRole(currentRole);

          // โหลดข้อมูลทั้งหมดแบบ Parallel
          await Promise.all([
            fetchMembers(currentFamily.id),
            fetchPets(currentFamily.id),
            fetchEvents(currentFamily.id),
          ]);
        } else {
          // กรณีที่ 2: First Time User - สร้างบ้านอัตโนมัติ
          const newFamily = await createHomeForUser(session.user);
          currentFamily = newFamily;
          currentRole = 'owner';
          setFamily(newFamily);
          setUserRole('owner');
        }

        // กำหนด View State ตามสถานะทางจิตวิทยา
        setViewState(currentFamily && events.length > 0 ? 'living' : 'nesting');
      } catch (error) {
        console.error("Error initializing home experience:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initHomeExperience();
  }, []);

  // สร้างบ้านใหม่สำหรับผู้ใช้แรก
  async function createHomeForUser(user: any): Promise<Family> {
    const homeName = "บ้านของเรา";
    const displayName = user.user_metadata?.full_name || "เจ้าของบ้าน";

    // อัปเดต Profile
    await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);

    // สร้างบ้าน
    const { data: newHome, error: homeError } = await supabase
      .from("homes")
      .insert({ name: homeName, owner_id: user.id })
      .select()
      .single();

    if (homeError || !newHome) throw homeError;

    // เพิ่มเจ้าของบ้านเป็นสมาชิก
    await supabase.from("home_members").insert({
      home_id: newHome.id,
      user_id: user.id,
      role: "owner",
    });

    return { 
      id: newHome.id, 
      name: newHome.name, 
      owner_id: user.id,
      created_at: new Date().toISOString()
    };
  }

  // Fetch Members (Co-owners)
  async function fetchMembers(homeId: string) {
    const { data, error } = await supabase
      .from("home_members")
      .select("user_id, role, joined_at, profiles(display_name, avatar_url)")
      .eq("home_id", homeId);

    if (!error && data) {
      const formattedMembers: FamilyMember[] = data.map((item: any) => ({
        family_id: homeId,
        user_id: item.user_id,
        display_name: item.profiles?.display_name || 'สมาชิก',
        email: '',
        avatar_url: item.profiles?.avatar_url,
        role: item.role as UserRole,
        joined_at: item.joined_at,
      }));
      setMembers(formattedMembers);
    }
  }

  // Fetch Pets in this Home
  async function fetchPets(homeId: string) {
    // TODO: ใช้ pet_shares table เพื่อหา pets ที่แชร์ในบ้านนี้
    // ตอนนี้ดึง pets ทั้งหมดของผู้ใช้ที่เป็น owner หรือ editor
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPets(data as Pet[]);
    }
  }

  // Fetch Life Journey Events
  async function fetchEvents(homeId: string) {
    const { data, error } = await supabase
      .from("life_journey_events")
      .select("*")
      .eq("home_id", homeId)
      .order("event_date", { ascending: false })
      .limit(50);

    if (!error && data) {
      const formattedEvents: JourneyEvent[] = data.map((item: any) => ({
        id: item.id,
        pet_id: item.pet_id,
        tagged_pet_ids: item.tagged_pet_ids || [],
        tagged_user_ids: item.tagged_user_ids || [],
        author_id: item.author_id,
        author_name: item.author_name || 'สมาชิก',
        event_date: item.event_date,
        event_type: item.event_type,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        video_url: item.video_url,
        certificate_id: item.certificate_id,
        likes_count: item.likes_count || 0,
        is_liked: false, // TODO: เช็คจาก user_likes
        comments: [], // TODO: โหลด comments
        location: item.location,
        created_at: item.created_at,
      }));
      setEvents(formattedEvents);
    }
  }

  // Handle Add New Event (Life Journey Post)
  const handleAddEvent = async (eventData: {
    pet_id?: string;
    tagged_pet_ids?: string[];
    tagged_user_ids?: string[];
    event_date: string;
    event_type: any;
    title: string;
    description: string;
    image_url?: string;
    video_url?: string;
    location?: string;
  }) => {
    if (!family || !currentUser) return;

    try {
      const { data: newEvent, error } = await supabase
        .from("life_journey_events")
        .insert({
          home_id: family.id,
          pet_id: eventData.pet_id,
          tagged_pet_ids: eventData.tagged_pet_ids,
          tagged_user_ids: eventData.tagged_user_ids,
          author_id: currentUser.id,
          author_name: currentUser.displayName,
          event_date: eventData.event_date,
          event_type: eventData.event_type,
          title: eventData.title,
          description: eventData.description,
          image_url: eventData.image_url,
          video_url: eventData.video_url,
          location: eventData.location,
        })
        .select()
        .single();

      if (!error && newEvent) {
        // เพิ่ม event ใหม่ vàoด้านบนของ list
        const formattedEvent: JourneyEvent = {
          id: newEvent.id,
          pet_id: newEvent.pet_id,
          tagged_pet_ids: newEvent.tagged_pet_ids || [],
          tagged_user_ids: newEvent.tagged_user_ids || [],
          author_id: newEvent.author_id,
          author_name: newEvent.author_name || currentUser.displayName,
          event_date: newEvent.event_date,
          event_type: newEvent.event_type,
          title: newEvent.title,
          description: newEvent.description,
          image_url: newEvent.image_url,
          video_url: newEvent.video_url,
          certificate_id: newEvent.certificate_id,
          likes_count: 0,
          is_liked: false,
          comments: [],
          location: newEvent.location,
          created_at: newEvent.created_at,
        };
        setEvents([formattedEvent, ...events]);
        setViewState('living');
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Handle Toggle Like
  const handleToggleLike = async (eventId: string) => {
    // TODO: Implement like/unlike logic with Supabase
    setEvents(events.map(evt => 
      evt.id === eventId 
        ? { ...evt, is_liked: !evt.is_liked, likes_count: (evt.likes_count || 0) + (evt.is_liked ? -1 : 1) }
        : evt
    ));
  };

  // Handle Add Comment
  const handleAddComment = async (eventId: string, commentText: string) => {
    // TODO: Implement comment logic with Supabase
    console.log(`Comment on ${eventId}: ${commentText}`);
  };

  // Handle Delete Event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('คุณต้องการลบเรื่องราวนี้หรือไม่?')) return;
    
    const { error } = await supabase
      .from("life_journey_events")
      .delete()
      .eq("id", eventId);

    if (!error) {
      setEvents(events.filter(evt => evt.id !== eventId));
    }
  };

  // Handle Navigate to Pet Detail
  const handleSelectPet = (petId: string) => {
    router.push(`/pets/${petId}`);
  };

  // Handle Add New Pet
  const handleAddNewPet = () => {
    router.push('/pets?page=create');
  };

  // Loading State - Psychological Warm Welcome
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">🏠</div>
          <p className="text-[#59554F] font-medium">กำลังเปิดประตูบ้าน...</p>
          <p className="text-xs text-[#8C867E] mt-2">Meow World กำลังเตรียมพื้นที่ความทรงจำของคุณ</p>
        </div>
      </div>
    );
  }

  // Nesting State - Empty Home, Waiting for Stories
  if (viewState === 'nesting' || !family) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pb-24">
        <header className="px-6 pt-12 pb-6 bg-white shadow-sm">
          <h1 className="text-2xl font-serif font-bold text-[#1F1E1D]">บ้านของเรา</h1>
          <p className="text-sm text-[#59554F]">พื้นที่ความทรงจำร่วมกัน</p>
        </header>

        <main className="px-4 mt-8">
          <div className="max-w-md mx-auto text-center py-20 space-y-6">
            <div className="w-24 h-24 rounded-full bg-[#EBF1E8] flex items-center justify-center text-5xl mx-auto mb-4">
              📦
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1F1E1D]">
              บ้านพร้อมแล้ว... ขาดแค่เรื่องราว!
            </h2>
            <p className="text-[#59554F] text-sm leading-relaxed">
              มาบันทึกโมเมนต์แรกของน้องกันเถอะ ไม่ว่าจะเป็นวันแรกที่พบกัน 
              ฉีดวัคซีนครั้งแรก หรือภาพถ่ายน่ารักๆ
            </p>
            <button 
              onClick={() => setIsMembersModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#E06D53] hover:bg-[#CC573C] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#E06D53]/20 hover:scale-105 transition-all"
            >
              <span>✨</span> เริ่มสร้างเรื่องราวแรก
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Living State - Full Home Experience with HomeMode Component
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 relative">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1F1E1D]">{family.name}</h1>
            <p className="text-sm text-[#59554F]">พื้นที่ความทรงจำร่วมกัน • {members.length} สมาชิก • {pets.length} น้องแมว</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#6B8E68] to-[#4F6D4C] rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-md">
            🏠
          </div>
        </div>
      </header>

      <main className="px-4 mt-6 max-w-5xl mx-auto">
        {/* --- HOME MODE: Complete Experience --- */}
        {currentUser && (
          <HomeMode
            family={family}
            members={members}
            pets={pets}
            events={events}
            currentUser={currentUser}
            userRole={userRole}
            onOpenMembersModal={() => setIsMembersModalOpen(true)}
            onOpenQRInviteModal={() => setIsQRModalOpen(true)}
            onSelectPet={handleSelectPet}
            onAddNewPet={handleAddNewPet}
            onAddEvent={handleAddEvent}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
      </main>

      {/* --- MODALS --- */}
      {family && currentUser && (
        <>
          <FamilyMembersModal
            isOpen={isMembersModalOpen}
            onClose={() => setIsMembersModalOpen(false)}
            family={family}
            members={members}
            currentUser={currentUser}
            userRole={userRole}
          />
          
          <QRInviteModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            family={family}
            createdBy={currentUser}
          />
        </>
      )}
    </div>
  );
}