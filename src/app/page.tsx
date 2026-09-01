"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// --- Types matching actual DB schema ---
interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  nickname?: string | null;
  avatar_url?: string | null;
}

interface JourneyEvent {
  id: string;
  pet_id: string | null;
  home_id: string;
  event_type: string;
  content?: string | null;
  media_urls?: string[] | null;
  created_at: string;
}

interface Home {
  id: string;
  name: string;
  owner_id: string;
}

// ============================================================
// STORYBOOK SCENE — SVG Illustration Components
// ============================================================

function Sun() {
  return (
    <g className="origin-[380px_60px]" style={{ animation: "sunPulse 8s ease-in-out infinite" }}>
      {/* Sun glow */}
      <circle cx="380" cy="60" r="45" fill="url(#sunGlow)" opacity="0.4" />
      {/* Sun body */}
      <circle cx="380" cy="60" r="28" fill="url(#sunGrad)" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="380"
          y1="60"
          x2={380 + Math.cos((angle * Math.PI) / 180) * 42}
          y2={60 + Math.sin((angle * Math.PI) / 180) * 42}
          stroke="#FBBF24"
          strokeWidth="1.5"
          opacity="0.5"
          strokeLinecap="round"
          style={{ animation: `rayPulse 4s ease-in-out ${i * 0.5}s infinite` }}
        />
      ))}
    </g>
  );
}

function Cloud({ x, y, scale = 1, delay = 0 }: { x: number; y: number; scale?: number; delay?: number }) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ animation: `cloudDrift 40s linear ${delay}s infinite` }}
      opacity="0.6"
    >
      <ellipse cx="0" cy="0" rx="30" ry="12" fill="white" />
      <ellipse cx="-18" cy="2" rx="18" ry="10" fill="white" />
      <ellipse cx="18" cy="2" rx="20" ry="10" fill="white" />
      <ellipse cx="8" cy="-4" rx="16" ry="10" fill="white" />
    </g>
  );
}

function Bird({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ animation: `birdFly 12s ease-in-out ${delay}s infinite` }}
    >
      <path
        d="M0,0 Q4,-6 8,0 M0,0 Q-4,-6 -8,0"
        fill="none"
        stroke="#8B6F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ animation: `birdWing 1.2s ease-in-out ${delay}s infinite` }}
      />
    </g>
  );
}

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Trunk */}
      <rect x="-4" y="-5" width="8" height="25" rx="3" fill="#8B6F5E" />
      {/* Foliage layers */}
      <ellipse cx="0" cy="-18" rx="20" ry="16" fill="#5B8C5A" />
      <ellipse cx="-8" cy="-14" rx="14" ry="12" fill="#6BA368" />
      <ellipse cx="8" cy="-14" rx="14" ry="12" fill="#6BA368" />
      <ellipse cx="0" cy="-26" rx="12" ry="10" fill="#7BC47A" />
      {/* Leaf shimmer */}
      <ellipse cx="5" cy="-22" rx="4" ry="3" fill="#8FD88E" opacity="0.6"
        style={{ animation: "leafShimmer 3s ease-in-out infinite" }} />
    </g>
  );
}

function Flower({ x, y, color = "#F472B6", delay = 0 }: { x: number; y: number; color?: string; delay?: number }) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ animation: `flowerSway 4s ease-in-out ${delay}s infinite`, transformOrigin: `${x}px ${y + 10}px` }}
    >
      <line x1="0" y1="0" x2="0" y2="12" stroke="#6BA368" strokeWidth="1.5" />
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx={Math.cos((angle * Math.PI) / 180) * 4}
          cy={Math.sin((angle * Math.PI) / 180) * 4 - 2}
          rx="3"
          ry="2"
          fill={color}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="-2" r="2" fill="#FBBF24" />
    </g>
  );
}

function GrassBlade({ x, y, height = 12, delay = 0 }: { x: number; y: number; height?: number; delay?: number }) {
  return (
    <path
      d={`M${x},${y} Q${x + 2},${y - height * 0.6} ${x + 1},${y - height}`}
      fill="none"
      stroke="#7BC47A"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ animation: `grassSway 3s ease-in-out ${delay}s infinite`, transformOrigin: `${x}px ${y}px` }}
    />
  );
}

function House({ onClick }: { onClick: () => void }) {
  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      aria-label="เข้าสู่บ้านของฉัน"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      {/* House glow (subtle) */}
      <ellipse cx="200" cy="248" rx="75" ry="12" fill="#FBBF24" opacity="0.15"
        style={{ animation: "houseGlow 4s ease-in-out infinite" }} />

      {/* House body */}
      <rect x="155" y="195" width="90" height="55" rx="3" fill="#F5E6D3" />
      <rect x="155" y="195" width="90" height="55" rx="3" fill="url(#houseShadow)" />

      {/* Roof */}
      <polygon points="145,195 200,158 255,195" fill="#C0564B" />
      <polygon points="145,195 200,158 255,195" fill="url(#roofGrad)" />
      {/* Roof shadow */}
      <polygon points="150,195 200,162 250,195" fill="#A84439" opacity="0.3" />

      {/* Chimney */}
      <rect x="225" y="165" width="14" height="22" rx="2" fill="#8B6F5E" />
      {/* Smoke */}
      <circle cx="232" cy="155" r="4" fill="#D4C5B5" opacity="0.3"
        style={{ animation: "smokeRise 5s ease-in-out infinite" }} />
      <circle cx="236" cy="145" r="3" fill="#D4C5B5" opacity="0.2"
        style={{ animation: "smokeRise 5s ease-in-out 1.5s infinite" }} />

      {/* Door */}
      <rect x="188" y="218" width="24" height="32" rx="12" fill="#8B5E3C" />
      <rect x="190" y="220" width="20" height="28" rx="10" fill="#A0704E" />
      <circle cx="204" cy="234" r="2" fill="#FBBF24" />

      {/* Windows */}
      <rect x="163" y="205" width="18" height="16" rx="2" fill="#FBBF24" opacity="0.8" />
      <rect x="163" y="205" width="18" height="16" rx="2" fill="url(#windowGlow)"
        style={{ animation: "windowFlicker 6s ease-in-out infinite" }} />
      <line x1="172" y1="205" x2="172" y2="221" stroke="#D4A574" strokeWidth="1.5" />
      <line x1="163" y1="213" x2="181" y2="213" stroke="#D4A574" strokeWidth="1.5" />

      <rect x="219" y="205" width="18" height="16" rx="2" fill="#FBBF24" opacity="0.8" />
      <rect x="219" y="205" width="18" height="16" rx="2" fill="url(#windowGlow)"
        style={{ animation: "windowFlicker 6s ease-in-out 2s infinite" }} />
      <line x1="228" y1="205" x2="228" y2="221" stroke="#D4A574" strokeWidth="1.5" />
      <line x1="219" y1="213" x2="237" y2="213" stroke="#D4A574" strokeWidth="1.5" />

      {/* Doorstep */}
      <rect x="184" y="248" width="32" height="4" rx="2" fill="#D4A574" />

      {/* Sparkles around house */}
      <circle cx="145" cy="185" r="1.5" fill="#FBBF24"
        style={{ animation: "sparkle 3s ease-in-out 0s infinite" }} />
      <circle cx="260" cy="190" r="1.5" fill="#FBBF24"
        style={{ animation: "sparkle 3s ease-in-out 1s infinite" }} />
      <circle cx="150" cy="210" r="1" fill="#FBBF24"
        style={{ animation: "sparkle 3s ease-in-out 2s infinite" }} />
      <circle cx="258" cy="220" r="1" fill="#FBBF24"
        style={{ animation: "sparkle 3s ease-in-out 0.5s infinite" }} />
    </g>
  );
}

function Cat({ x, y, flip = false, delay = 0 }: { x: number; y: number; flip?: boolean; delay?: number }) {
  return (
    <g
      transform={`translate(${x}, ${y}) ${flip ? "scale(-1,1)" : ""}`}
      style={{ animation: `catIdle 4s ease-in-out ${delay}s infinite` }}
    >
      {/* Body */}
      <ellipse cx="0" cy="0" rx="10" ry="7" fill="#F5A623" />
      {/* Head */}
      <circle cx="10" cy="-5" r="7" fill="#F5A623" />
      {/* Ears */}
      <polygon points="6,-10 4,-17 10,-11" fill="#F5A623" />
      <polygon points="13,-10 11,-17 16,-11" fill="#F5A623" />
      <polygon points="7,-11 5.5,-15 9,-11" fill="#FFB8C6" />
      <polygon points="13,-11 11.5,-15 15,-11" fill="#FFB8C6" />
      {/* Eyes */}
      <ellipse cx="8" cy="-5" rx="1.5" ry="2" fill="#2D2D2D" />
      <ellipse cx="13" cy="-5" rx="1.5" ry="2" fill="#2D2D2D" />
      <circle cx="8.5" cy="-5.5" r="0.5" fill="white" />
      <circle cx="13.5" cy="-5.5" r="0.5" fill="white" />
      {/* Nose */}
      <ellipse cx="10.5" cy="-3" rx="1" ry="0.7" fill="#FF8FA3" />
      {/* Mouth */}
      <path d="M10,-2 Q9,-1 10.5,-0.5 Q12,-1 10,-2" fill="none" stroke="#D4856A" strokeWidth="0.5" />
      {/* Tail */}
      <path
        d="M-10,0 Q-18,-8 -14,-16"
        fill="none"
        stroke="#F5A623"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ animation: `tailWag 3s ease-in-out ${delay}s infinite` }}
      />
      {/* Whiskers */}
      <line x1="6" y1="-4" x2="0" y2="-5" stroke="#D4856A" strokeWidth="0.4" />
      <line x1="6" y1="-3" x2="0" y2="-2.5" stroke="#D4856A" strokeWidth="0.4" />
      <line x1="15" y1="-4" x2="21" y2="-5" stroke="#D4856A" strokeWidth="0.4" />
      <line x1="15" y1="-3" x2="21" y2="-2.5" stroke="#D4856A" strokeWidth="0.4" />
    </g>
  );
}

function Family({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Adult 1 */}
      <circle cx="0" cy="-20" r="6" fill="#F5CBA7" />
      <rect x="-5" y="-14" width="10" height="18" rx="5" fill="#7C9EB2" />
      {/* Adult 2 */}
      <circle cx="16" cy="-20" r="6" fill="#F5CBA7" />
      <rect x="11" y="-14" width="10" height="18" rx="5" fill="#E8879C" />
      {/* Child */}
      <circle cx="8" cy="-12" r="4.5" fill="#F5CBA7" />
      <rect x="4" y="-7" width="8" height="12" rx="4" fill="#F9D56E" />
    </g>
  );
}

function CatNearDoor({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Sitting cat looking at user */}
      <ellipse cx="0" cy="0" rx="7" ry="5" fill="#8B8B8B" />
      <circle cx="6" cy="-6" r="5" fill="#8B8B8B" />
      {/* Ears */}
      <polygon points="3,-9 2,-14 6,-9" fill="#8B8B8B" />
      <polygon points="8,-9 7,-14 11,-9" fill="#8B8B8B" />
      <polygon points="4,-10 3,-13 5.5,-10" fill="#FFB8C6" />
      <polygon points="8.5,-10 7.5,-13 10.5,-10" fill="#FFB8C6" />
      {/* Eyes (looking at user) */}
      <ellipse cx="4" cy="-6" rx="1.5" ry="2" fill="#4CAF50" />
      <ellipse cx="8" cy="-6" rx="1.5" ry="2" fill="#4CAF50" />
      <circle cx="4" cy="-5.5" r="0.6" fill="#1A1A1A" />
      <circle cx="8" cy="-5.5" r="0.6" fill="#1A1A1A" />
      {/* Nose */}
      <ellipse cx="6" cy="-4" rx="0.8" ry="0.5" fill="#FF8FA3" />
      {/* Tail curled */}
      <path d="M-7,2 Q-14,-2 -10,-10" fill="none" stroke="#8B8B8B" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [home, setHome] = useState<Home | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<JourneyEvent[]>([]);

  const [viewMode, setViewMode] = useState<"empty" | "nesting" | "living">("empty");

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const { data: ownedHomes } = await supabase
        .from("homes")
        .select("id, name, owner_id")
        .eq("owner_id", user.id)
        .limit(1);

      let currentHome: Home | null = null;

      if (ownedHomes && ownedHomes.length > 0) {
        currentHome = ownedHomes[0] as Home;
      }

      if (!currentHome) {
        const { data: newHome } = await supabase
          .from("homes")
          .insert({ name: "บ้านของเรา", owner_id: user.id })
          .select()
          .single();

        if (newHome) {
          await supabase.from("home_members").insert({
            home_id: newHome.id,
            user_id: user.id,
            role: "owner",
          });
          currentHome = newHome as Home;
        }
      }

      setHome(currentHome);

      if (!currentHome) {
        setViewMode("empty");
        setIsLoading(false);
        return;
      }

      const { data: petsData } = await supabase
        .from("pets")
        .select("id, name, species, breed, nickname, avatar_url")
        .eq("home_id", currentHome.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      setPets((petsData as Pet[]) || []);

      if (!petsData || petsData.length === 0) {
        setViewMode("nesting");
        setIsLoading(false);
        return;
      }

      const { data: eventsData } = await supabase
        .from("life_journey_events")
        .select("id, pet_id, home_id, event_type, content, media_urls, created_at")
        .eq("home_id", currentHome.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setEvents((eventsData as JourneyEvent[]) || []);
      setViewMode("living");
    } catch (error) {
      console.error("Init Error:", error);
      setViewMode("empty");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser({ id: session.user.id, email: session.user.email });
    }
    initAuth();
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #FDE8C8 0%, #F9D5A0 40%, #E8C99B 100%)" }}>
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-amber-800 font-medium">กำลังเตรียมบ้าน...</p>
        </div>
      </div>
    );
  }

  const handleEnterHouse = () => {
    if (viewMode === "nesting") {
      router.push("/pets");
    } else if (viewMode === "living" && pets.length > 0) {
      router.push(`/pets/${pets[0].id}`);
    } else {
      router.push("/pets");
    }
  };

  return (
    <>
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(60px); }
        }
        @keyframes birdFly {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -8px); }
          50% { transform: translate(60px, -4px); }
          75% { transform: translate(30px, -10px); }
        }
        @keyframes birdWing {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
        @keyframes leafShimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes flowerSway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes grassSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes houseGlow {
          0%, 100% { opacity: 0.1; r: 75; }
          50% { opacity: 0.25; r: 80; }
        }
        @keyframes windowFlicker {
          0%, 100% { opacity: 0.7; }
          30% { opacity: 0.9; }
          60% { opacity: 0.6; }
        }
        @keyframes smokeRise {
          0% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-8px); opacity: 0.15; }
          100% { transform: translateY(-16px); opacity: 0; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; r: 1; }
          50% { opacity: 0.8; r: 2; }
        }
        @keyframes tailWag {
          0%, 100% { d: path("M-10,0 Q-18,-8 -14,-16"); }
          50% { d: path("M-10,0 Q-20,-4 -16,-14"); }
        }
        @keyframes catIdle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FDE8C8 0%, #F9D5A0 30%, #E8C99B 60%, #D4B896 100%)" }}>

        {/* ===== SKY & SCENE ===== */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            viewBox="0 0 480 360"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sunGrad" cx="40%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#FBBF24" />
              </radialGradient>
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4604E" />
                <stop offset="100%" stopColor="#A84439" />
              </linearGradient>
              <linearGradient id="houseShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
              </linearGradient>
              <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background hills */}
            <ellipse cx="120" cy="310" rx="200" ry="60" fill="#C5D4A0" opacity="0.5" />
            <ellipse cx="380" cy="320" rx="180" ry="50" fill="#B8C993" opacity="0.4" />

            {/* Sun */}
            <Sun />

            {/* Clouds */}
            <Cloud x={60} y={40} scale={0.8} delay={0} />
            <Cloud x={300} y={25} scale={0.6} delay={8} />

            {/* Birds */}
            <Bird x={100} y={50} delay={0} />
            <Bird x={320} y={35} delay={3} />

            {/* Trees background */}
            <Tree x={50} y={275} scale={0.9} />
            <Tree x={420} y={270} scale={1.1} />
            <Tree x={350} y={280} scale={0.7} />

            {/* Ground */}
            <ellipse cx="240" cy="310" rx="280" ry="55" fill="#A8C686" />
            <ellipse cx="240" cy="315" rx="260" ry="45" fill="#96B878" />

            {/* Path to house */}
            <path d="M200,310 Q195,290 198,260" fill="none" stroke="#D4B896" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

            {/* Flowers */}
            <Flower x={80} y={300} color="#F472B6" delay={0} />
            <Flower x={100} y={305} color="#FB923C" delay={1} />
            <Flower x={340} y={298} color="#C084FC" delay={0.5} />
            <Flower x={370} y={303} color="#F472B6" delay={1.5} />
            <Flower x={150} y={308} color="#FBBF24" delay={2} />

            {/* Grass */}
            <GrassBlade x={70} y={308} height={10} delay={0} />
            <GrassBlade x={90} y={310} height={8} delay={0.3} />
            <GrassBlade x={350} y={306} height={11} delay={0.6} />
            <GrassBlade x={380} y={309} height={9} delay={0.9} />
            <GrassBlade x={130} y={312} height={7} delay={1.2} />
            <GrassBlade x={400} y={307} height={10} delay={1.5} />

            {/* HOUSE — Interactive Hotspot */}
            <House onClick={handleEnterHouse} />

            {/* Family near house */}
            <Family x={130} y={275} />

            {/* Cat near door (looking at user) */}
            <CatNearDoor x={268} y={268} />

            {/* Cat sitting on grass */}
            <Cat x={320} y={285} delay={0} />

            {/* Foreground flowers (depth) */}
            <Flower x={30} y={340} color="#F472B6" delay={0.8} />
            <Flower x={55} y={345} color="#FB923C" delay={1.8} />
            <Flower x={440} y={338} color="#C084FC" delay={1.2} />
            <Flower x={460} y={343} color="#FBBF24" delay={2.2} />

            {/* Foreground grass (depth) */}
            <GrassBlade x={20} y={348} height={14} delay={0.4} />
            <GrassBlade x={40} y={350} height={12} delay={0.7} />
            <GrassBlade x={445} y={346} height={13} delay={1.0} />
            <GrassBlade x={465} y={349} height={11} delay={1.3} />
          </svg>
        </div>

        {/* ===== LEFT SIDE: Brand & Welcome Text ===== */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="px-6 pt-16 pb-40 md:px-12 lg:px-20 max-w-lg"
              style={{ animation: "fadeInUp 1s ease-out" }}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900 mb-3"
                style={{ textShadow: "0 2px 8px rgba(139,69,19,0.1)" }}>
                MEOW WORLD
              </h1>
              <p className="text-base md:text-lg text-amber-800/80 leading-relaxed font-medium">
                ยินดีต้อนรับสู่โลกของเจ้าเหมียว
              </p>

              {/* Pet avatars (living mode) */}
              {viewMode === "living" && pets.length > 0 && (
                <div className="mt-8 flex items-center gap-3" style={{ animation: "fadeInUp 1.2s ease-out 0.3s both" }}>
                  <div className="flex -space-x-3">
                    {pets.slice(0, 5).map((pet, i) => (
                      <div
                        key={pet.id}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-lg overflow-hidden"
                        style={{ backgroundColor: ["#FDE8C8", "#E8D5C4", "#D4E8D0", "#E8D0E0", "#D0E0E8"][i % 5] }}
                      >
                        {pet.avatar_url ? (
                          <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                          "🐱"
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900">{pets.length} สมาชิก</p>
                    <p className="text-xs text-amber-700/60">{events.length} เรื่องราว</p>
                  </div>
                </div>
              )}

              {/* Nesting mode hint */}
              {viewMode === "nesting" && (
                <div className="mt-8" style={{ animation: "fadeInUp 1.2s ease-out 0.3s both" }}>
                  <p className="text-sm text-amber-800/60 italic">
                    แตะบ้านเพื่อเริ่มต้น...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ===== BOTTOM NAVIGATION — Glass Style ===== */}
          <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe">
            <div className="mx-auto max-w-md px-6 pb-6">
              <div
                className="flex items-center justify-around py-3 px-4 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 24px rgba(139, 69, 19, 0.08)",
                }}
              >
                <button
                  onClick={() => router.push("/pets/birth")}
                  className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition hover:bg-white/20 active:scale-95"
                >
                  <span className="text-xl">+</span>
                  <span className="text-[11px] font-semibold text-amber-900/70">เพิ่มสมาชิก</span>
                </button>

                <div className="w-px h-8 bg-amber-900/10" />

                <button
                  onClick={() => router.push("/pets")}
                  className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition hover:bg-white/20 active:scale-95"
                >
                  <svg className="w-5 h-5 text-amber-900/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span className="text-[11px] font-semibold text-amber-900/70">สัตว์เลี้ยง</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
