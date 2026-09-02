"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { QRScannerModal } from "@/components/qr/QRScannerModal";

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
// ============================================================
// STORYBOOK SCENE — SVG Illustration Components
// ============================================================

function Sun({ cx = 540, cy = 55 }: { cx?: number; cy?: number }) {
  return (
    <g className="origin-[540px_55px]" style={{ animation: "sunPulse 8s ease-in-out infinite" }}>
      {/* Sun glow */}
      <circle cx={cx} cy={cy} r="48" fill="url(#sunGlow)" opacity="0.45" />
      {/* Sun body */}
      <circle cx={cx} cy={cy} r="28" fill="url(#sunGrad)" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos((angle * Math.PI) / 180) * 44}
          y2={cy + Math.sin((angle * Math.PI) / 180) * 44}
          stroke="#FBBF24"
          strokeWidth="1.8"
          opacity="0.6"
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
      style={{ animation: `cloudDrift 45s linear ${delay}s infinite` }}
      opacity="0.65"
    >
      <ellipse cx="0" cy="0" rx="32" ry="13" fill="white" />
      <ellipse cx="-18" cy="2" rx="19" ry="11" fill="white" />
      <ellipse cx="18" cy="2" rx="22" ry="11" fill="white" />
      <ellipse cx="8" cy="-5" rx="17" ry="11" fill="white" />
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
      <rect x="-4" y="-5" width="8" height="26" rx="3" fill="#8B6F5E" />
      {/* Foliage layers */}
      <ellipse cx="0" cy="-18" rx="22" ry="17" fill="#5B8C5A" />
      <ellipse cx="-9" cy="-14" rx="15" ry="13" fill="#6BA368" />
      <ellipse cx="9" cy="-14" rx="15" ry="13" fill="#6BA368" />
      <ellipse cx="0" cy="-27" rx="13" ry="11" fill="#7BC47A" />
      {/* Leaf shimmer */}
      <ellipse cx="5" cy="-22" rx="5" ry="3.5" fill="#8FD88E" opacity="0.65"
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

function House({ x, y, onClick }: { x: number; y: number; onClick: () => void }) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      className="cursor-pointer group"
      role="button"
      aria-label="เข้าสู่บ้านของฉัน"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      {/* House glow (subtle aura) */}
      <ellipse cx="60" cy="98" rx="80" ry="14" fill="#FBBF24" opacity="0.2"
        style={{ animation: "houseGlow 4s ease-in-out infinite" }} />

      {/* Chimney */}
      <rect x="88" y="10" width="16" height="26" rx="2" fill="#8B6F5E" />
      {/* Chimney Smoke */}
      <circle cx="96" cy="0" r="4.5" fill="#D4C5B5" opacity="0.3"
        style={{ animation: "smokeRise 5s ease-in-out infinite" }} />
      <circle cx="100" cy="-12" r="3.5" fill="#D4C5B5" opacity="0.2"
        style={{ animation: "smokeRise 5s ease-in-out 1.5s infinite" }} />
      <circle cx="95" cy="-22" r="2.5" fill="#D4C5B5" opacity="0.1"
        style={{ animation: "smokeRise 5s ease-in-out 3s infinite" }} />

      {/* House Body */}
      <rect x="10" y="44" width="100" height="56" rx="4" fill="#FAF2E8" stroke="#E2D0BE" strokeWidth="1" />
      <rect x="10" y="44" width="100" height="56" rx="4" fill="url(#houseShadow)" />

      {/* Cozy Roof with Cat-Ear Silhouette Accent */}
      <polygon points="0,46 60,6 120,46" fill="#C85A48" />
      <polygon points="0,46 60,6 120,46" fill="url(#roofGrad)" />
      {/* Cat Ears on Roof Ridge */}
      <polygon points="28,26 38,4 52,20" fill="#C85A48" />
      <polygon points="28,26 38,4 52,20" fill="url(#roofGrad)" />
      <polygon points="32,24 39,9 49,19" fill="#FFAAA6" opacity="0.85" />
      <polygon points="68,20 82,4 92,26" fill="#C85A48" />
      <polygon points="68,20 82,4 92,26" fill="url(#roofGrad)" />
      <polygon points="71,19 81,9 88,24" fill="#FFAAA6" opacity="0.85" />
      {/* Roof Edge Trim */}
      <line x1="-2" y1="47" x2="60" y2="5" stroke="#E57362" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="5" x2="122" y2="47" stroke="#E57362" strokeWidth="2.5" strokeLinecap="round" />

      {/* Attic Round Window */}
      <circle cx="60" cy="27" r="9" fill="#FDE68A" stroke="#8B5E3C" strokeWidth="1.5" />
      <circle cx="60" cy="27" r="7" fill="url(#windowGlow)" style={{ animation: "windowFlicker 5s ease-in-out 1s infinite" }} />
      <line x1="60" y1="20" x2="60" y2="34" stroke="#8B5E3C" strokeWidth="1" />
      <line x1="53" y1="27" x2="67" y2="27" stroke="#8B5E3C" strokeWidth="1" />

      {/* Front Door */}
      <rect x="46" y="62" width="28" height="38" rx="14" fill="#8B5E3C" />
      <rect x="48" y="65" width="24" height="34" rx="12" fill="#A0704E" />
      {/* Doorknob */}
      <circle cx="66" cy="82" r="2.2" fill="#FBBF24" />
      {/* Doorstep */}
      <rect x="41" y="98" width="38" height="5" rx="2.5" fill="#D4A574" />

      {/* Left Window */}
      <rect x="18" y="54" width="20" height="19" rx="3" fill="#FDE68A" stroke="#8B5E3C" strokeWidth="1" />
      <rect x="18" y="54" width="20" height="19" rx="3" fill="url(#windowGlow)" style={{ animation: "windowFlicker 6s ease-in-out infinite" }} />
      <line x1="28" y1="54" x2="28" y2="73" stroke="#8B5E3C" strokeWidth="1" />
      <line x1="18" y1="63" x2="38" y2="63" stroke="#8B5E3C" strokeWidth="1" />
      {/* Left Window Flower Box */}
      <rect x="16" y="72" width="24" height="4" rx="1.5" fill="#8B5E3C" />
      <circle cx="20" cy="71" r="2" fill="#F472B6" />
      <circle cx="28" cy="70" r="2" fill="#FB923C" />
      <circle cx="36" cy="71" r="2" fill="#F472B6" />

      {/* Right Window */}
      <rect x="82" y="54" width="20" height="19" rx="3" fill="#FDE68A" stroke="#8B5E3C" strokeWidth="1" />
      <rect x="82" y="54" width="20" height="19" rx="3" fill="url(#windowGlow)" style={{ animation: "windowFlicker 6s ease-in-out 2s infinite" }} />
      <line x1="92" y1="54" x2="92" y2="73" stroke="#8B5E3C" strokeWidth="1" />
      <line x1="82" y1="63" x2="102" y2="63" stroke="#8B5E3C" strokeWidth="1" />
      {/* Right Window Flower Box */}
      <rect x="80" y="72" width="24" height="4" rx="1.5" fill="#8B5E3C" />
      <circle cx="84" cy="71" r="2" fill="#C084FC" />
      <circle cx="92" cy="70" r="2" fill="#FBBF24" />
      <circle cx="100" cy="71" r="2" fill="#C084FC" />

      {/* Sparkles dancing around house */}
      <circle cx="-5" cy="35" r="2" fill="#FBBF24" style={{ animation: "sparkle 3s ease-in-out 0s infinite" }} />
      <circle cx="125" cy="40" r="2" fill="#FBBF24" style={{ animation: "sparkle 3s ease-in-out 1s infinite" }} />
      <circle cx="5" cy="70" r="1.5" fill="#FBBF24" style={{ animation: "sparkle 3s ease-in-out 2s infinite" }} />
      <circle cx="120" cy="75" r="1.5" fill="#FBBF24" style={{ animation: "sparkle 3s ease-in-out 0.5s infinite" }} />
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
  const [homeName, setHomeName] = useState("บ้านของเรา");
  const [isEditingName, setIsEditingName] = useState(false);
  const prevViewModeRef = useRef<"empty" | "nesting" | "living" | null>(null);
  const [transitionPhase, setTransitionPhase] = useState<"none" | "exiting" | "entering">("none");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

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

  // --- Re-fetch data when user returns to the page (e.g. after adding first pet) ---
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && user) {
        loadData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user, loadData]);

  // --- Sync homeName with DB when home loads ---
  useEffect(() => {
    if (home && !isEditingName) {
      setHomeName(home.name);
    }
  }, [home, isEditingName]);

  // --- Transition animation: nesting → living ---
  useEffect(() => {
    if (prevViewModeRef.current === null) {
      prevViewModeRef.current = viewMode;
      return;
    }
    const prev = prevViewModeRef.current;
    prevViewModeRef.current = viewMode;

    if (prev === "nesting" && viewMode === "living") {
      setTransitionPhase("exiting");
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setTransitionPhase("entering");
        const timer2 = setTimeout(() => setTransitionPhase("none"), 600);
        return () => clearTimeout(timer2);
      }, 400);
      const timer3 = setTimeout(() => setShowConfetti(false), 3000);
      return () => { clearTimeout(timer); clearTimeout(timer3); };
    }
  }, [viewMode]);

  // --- Save home name to DB ---
  const saveHomeName = useCallback(async () => {
    if (!home || !homeName.trim()) return;
    const trimmed = homeName.trim();
    if (trimmed === home.name) {
      setIsEditingName(false);
      return;
    }
    try {
      await supabase.from("homes").update({ name: trimmed }).eq("id", home.id);
      setHome({ ...home, name: trimmed });
    } catch (err) {
      console.error("Failed to save home name:", err);
    }
    setIsEditingName(false);
  }, [home, homeName, supabase]);

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #FDE8C8 0%, #F9D5A0 40%, #E8C99B 100%)" }}>
        <div className="text-center" style={{ animation: "fadeInUp 1s ease-out" }}>
          {/* Cat Logo from Passport */}
          <div className="mb-5" style={{ animation: "gentleBounce 2s ease-in-out infinite" }}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ears */}
              <polygon points="32,42 22,12 48,34" fill="#F5A623" />
              <polygon points="88,42 98,12 72,34" fill="#F5A623" />
              <polygon points="35,40 27,18 46,35" fill="#FFB8C6" />
              <polygon points="85,40 93,18 74,35" fill="#FFB8C6" />
              {/* Face */}
              <circle cx="60" cy="62" r="32" fill="#F5A623" />
              {/* Eyes */}
              <ellipse cx="48" cy="57" rx="4.5" ry="5.5" fill="#2D2D2D" />
              <ellipse cx="72" cy="57" rx="4.5" ry="5.5" fill="#2D2D2D" />
              <circle cx="50" cy="55.5" r="1.5" fill="white" />
              <circle cx="74" cy="55.5" r="1.5" fill="white" />
              {/* Nose */}
              <ellipse cx="60" cy="64" rx="3" ry="2" fill="#FF8FA3" />
              {/* Mouth */}
              <path d="M57,67 Q60,71 63,67" fill="none" stroke="#D4856A" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M60,64 L60,67" fill="none" stroke="#D4856A" strokeWidth="1" />
              {/* Whiskers */}
              <line x1="30" y1="60" x2="46" y2="63" stroke="#D4856A" strokeWidth="1" />
              <line x1="28" y1="66" x2="45" y2="66" stroke="#D4856A" strokeWidth="1" />
              <line x1="74" y1="63" x2="90" y2="60" stroke="#D4856A" strokeWidth="1" />
              <line x1="75" y1="66" x2="92" y2="66" stroke="#D4856A" strokeWidth="1" />
              {/* Blush */}
              <ellipse cx="40" cy="67" rx="5" ry="3" fill="#FFB8C6" opacity="0.4" />
              <ellipse cx="80" cy="67" rx="5" ry="3" fill="#FFB8C6" opacity="0.4" />
              {/* Body */}
              <ellipse cx="60" cy="98" rx="22" ry="16" fill="#F5A623" />
              {/* Paws */}
              <ellipse cx="48" cy="110" rx="8" ry="5" fill="#F5A623" />
              <ellipse cx="72" cy="110" rx="8" ry="5" fill="#F5A623" />
              <ellipse cx="48" cy="110" rx="6" ry="3.5" fill="#FFD9A0" />
              <ellipse cx="72" cy="110" rx="6" ry="3.5" fill="#FFD9A0" />
              {/* Tail */}
              <path d="M82,95 Q100,80 95,60" fill="none" stroke="#F5A623" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-amber-900 font-bold text-lg tracking-wide">กำลังเข้าสู่โลกของ Meow World</p>
          <div className="mt-4 flex justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600/40" style={{ animation: "sparkle 1.5s ease-in-out 0s infinite" }} />
            <span className="w-2 h-2 rounded-full bg-amber-600/40" style={{ animation: "sparkle 1.5s ease-in-out 0.3s infinite" }} />
            <span className="w-2 h-2 rounded-full bg-amber-600/40" style={{ animation: "sparkle 1.5s ease-in-out 0.6s infinite" }} />
          </div>
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
        @keyframes fadeSlideOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.95); }
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(30px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes petalBurst {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-60px) rotate(180deg); }
        }
        @keyframes confettiFall {
          0% {
            opacity: 1;
            transform: translateY(-20vh) rotate(0deg) scale(1);
          }
          25% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg) scale(0.5);
          }
        }
        @keyframes confettiSway {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(15px); }
          75% { transform: translateX(-15px); }
        }
      `}</style>

      {/* ===== WELCOME / ENTRY SCREEN (Nesting Mode — Storybook Scene) ===== */}
      {viewMode === "nesting" && (
        <div
          className="min-h-screen relative overflow-hidden flex flex-col justify-between"
          style={{
            background: "linear-gradient(180deg, #FDE8C8 0%, #F9D5A0 30%, #E8C99B 60%, #D4B896 100%)",
            animation: transitionPhase === "exiting"
              ? "fadeSlideOut 0.4s ease-in forwards"
              : "fadeInUp 0.8s ease-out",
          }}
        >
          {/* ===== SKY & SCENE (Right-focused Asymmetrical 16:9 Illustration) ===== */}
          <div className="absolute inset-0">
            <svg
              viewBox="0 0 640 360"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.65" />
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
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background rolling hills */}
              <ellipse cx="160" cy="320" rx="260" ry="70" fill="#C5D4A0" opacity="0.5" />
              <ellipse cx="480" cy="310" rx="240" ry="60" fill="#B8C993" opacity="0.4" />

              {/* Sun (Right Top) */}
              <Sun cx={540} cy={55} />

              {/* Clouds drifting */}
              <Cloud x={100} y={35} scale={0.75} delay={0} />
              <Cloud x={380} y={25} scale={0.6} delay={8} />

              {/* Birds flying */}
              <Bird x={220} y={45} delay={0} />
              <Bird x={480} y={35} delay={3} />

              {/* Background Trees framing village */}
              <Tree x={310} y={245} scale={0.9} />
              <Tree x={600} y={225} scale={1.15} />
              <Tree x={440} y={180} scale={0.7} />

              {/* Ground & Grass */}
              <ellipse cx="360" cy="305" rx="360" ry="65" fill="#A8C686" />
              <ellipse cx="360" cy="312" rx="340" ry="55" fill="#96B878" />

              {/* Winding stone path to house */}
              <path d="M380,340 Q430,295 485,250" fill="none" stroke="#D4B896" strokeWidth="8" strokeLinecap="round" opacity="0.6" />

              {/* Midground Flowers & Grass */}
              <Flower x={140} y={300} color="#F472B6" delay={0} />
              <Flower x={170} y={305} color="#FB923C" delay={1} />
              <Flower x={330} y={292} color="#C084FC" delay={0.5} />
              <Flower x={580} y={298} color="#F472B6" delay={1.5} />
              <Flower x={230} y={308} color="#FBBF24" delay={2} />

              <GrassBlade x={130} y={308} height={10} delay={0} />
              <GrassBlade x={160} y={310} height={8} delay={0.3} />
              <GrassBlade x={320} y={300} height={11} delay={0.6} />
              <GrassBlade x={590} y={304} height={9} delay={0.9} />

              {/* HOUSE — Primary Call-To-Action (Interactive Hotspot) */}
              <House x={425} y={150} onClick={handleEnterHouse} />

              {/* Cat near front door looking at user */}
              <CatNearDoor x={515} y={250} />

              {/* Foreground Flowers (Depth layer) */}
              <Flower x={40} y={340} color="#F472B6" delay={0.8} />
              <Flower x={75} y={346} color="#FB923C" delay={1.8} />
              <Flower x={580} y={338} color="#C084FC" delay={1.2} />
              <Flower x={610} y={344} color="#FBBF24" delay={2.2} />

              {/* Foreground Grass (Depth layer) */}
              <GrassBlade x={30} y={348} height={14} delay={0.4} />
              <GrassBlade x={65} y={350} height={12} delay={0.7} />
              <GrassBlade x={570} y={346} height={13} delay={1.0} />
              <GrassBlade x={620} y={349} height={11} delay={1.3} />
            </svg>
          </div>

          {/* ===== LEFT SIDE: Brand & Welcome Text ===== */}
          <div className="relative z-10 pt-8 px-6 md:pt-14 md:px-12 lg:px-20 max-w-lg pointer-events-auto"
            style={{ animation: "fadeInUp 1s ease-out" }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-900 tracking-tight mb-2"
              style={{ textShadow: "0 2px 10px rgba(139,69,19,0.12)" }}>
              MEOW WORLD
            </h1>
            <p className="text-base md:text-lg text-amber-900/80 font-medium leading-relaxed">
              ยินดีต้อนรับสู่โลกของเจ้าเหมียว
            </p>
          </div>

          {/* ===== BOTTOM NAVIGATION — Minimal Translucent Glass ===== */}
          <div className="relative z-30 pb-6 px-6 pointer-events-auto">
            <div className="mx-auto max-w-sm">
              <div
                className="flex items-center justify-around py-2.5 px-4 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.28)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 8px 32px rgba(139, 69, 19, 0.08)",
                }}
              >
                <button
                  onClick={() => router.push("/pets/birth")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition hover:bg-white/30 active:scale-95 text-amber-900/80 font-bold text-xs md:text-sm"
                >
                  <span className="text-base font-extrabold leading-none">＋</span>
                  <span>เพิ่มสมาชิก</span>
                </button>

                <div className="w-px h-6 bg-amber-900/15" />

                <button
                  onClick={() => setShowQRScanner(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition hover:bg-white/30 active:scale-95 text-amber-900/80 font-bold text-xs md:text-sm"
                >
                  <svg className="w-4 h-4 text-amber-900/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>สแกน QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== LIVING MODE — Storybook Scene ===== */}
      {viewMode === "living" && (
        <div
          className="min-h-screen relative overflow-hidden flex flex-col justify-between"
          style={{
            background: "linear-gradient(180deg, #FDE8C8 0%, #F9D5A0 30%, #E8C99B 60%, #D4B896 100%)",
            animation: transitionPhase === "entering"
              ? "fadeSlideIn 0.6s ease-out"
              : undefined,
          }}
        >
          {/* ===== SKY & SCENE (Living Village Scene) ===== */}
          <div className="absolute inset-0">
            <svg
              viewBox="0 0 640 360"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.65" />
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
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background rolling hills */}
              <ellipse cx="160" cy="320" rx="260" ry="70" fill="#C5D4A0" opacity="0.5" />
              <ellipse cx="480" cy="310" rx="240" ry="60" fill="#B8C993" opacity="0.4" />

              {/* Sun */}
              <Sun cx={540} cy={55} />

              {/* Clouds */}
              <Cloud x={100} y={35} scale={0.75} delay={0} />
              <Cloud x={380} y={25} scale={0.6} delay={8} />

              {/* Birds */}
              <Bird x={220} y={45} delay={0} />
              <Bird x={480} y={35} delay={3} />

              {/* Trees */}
              <Tree x={310} y={245} scale={0.9} />
              <Tree x={600} y={225} scale={1.15} />
              <Tree x={440} y={180} scale={0.7} />

              {/* Ground */}
              <ellipse cx="360" cy="305" rx="360" ry="65" fill="#A8C686" />
              <ellipse cx="360" cy="312" rx="340" ry="55" fill="#96B878" />

              {/* Winding path to house */}
              <path d="M380,340 Q430,295 485,250" fill="none" stroke="#D4B896" strokeWidth="8" strokeLinecap="round" opacity="0.6" />

              {/* Midground Flowers */}
              <Flower x={140} y={300} color="#F472B6" delay={0} />
              <Flower x={170} y={305} color="#FB923C" delay={1} />
              <Flower x={330} y={292} color="#C084FC" delay={0.5} />
              <Flower x={580} y={298} color="#F472B6" delay={1.5} />
              <Flower x={230} y={308} color="#FBBF24" delay={2} />

              {/* Grass */}
              <GrassBlade x={130} y={308} height={10} delay={0} />
              <GrassBlade x={160} y={310} height={8} delay={0.3} />
              <GrassBlade x={320} y={300} height={11} delay={0.6} />
              <GrassBlade x={590} y={304} height={9} delay={0.9} />

              {/* HOUSE — Interactive Hotspot */}
              <House x={425} y={150} onClick={handleEnterHouse} />

              {/* Family near house */}
              <Family x={365} y={265} />

              {/* Cat near door looking at user */}
              <CatNearDoor x={515} y={250} />

              {/* Playful Cat in yard */}
              <Cat x={565} y={275} delay={0} />

              {/* Foreground Flowers (Depth layer) */}
              <Flower x={40} y={340} color="#F472B6" delay={0.8} />
              <Flower x={75} y={346} color="#FB923C" delay={1.8} />
              <Flower x={580} y={338} color="#C084FC" delay={1.2} />
              <Flower x={610} y={344} color="#FBBF24" delay={2.2} />

              {/* Foreground Grass (Depth layer) */}
              <GrassBlade x={30} y={348} height={14} delay={0.4} />
              <GrassBlade x={65} y={350} height={12} delay={0.7} />
              <GrassBlade x={570} y={346} height={13} delay={1.0} />
              <GrassBlade x={620} y={349} height={11} delay={1.3} />
            </svg>
          </div>

          {/* ===== LEFT SIDE: Brand & Welcome Text ===== */}
          <div className="relative z-10 pt-8 px-6 md:pt-14 md:px-12 lg:px-20 max-w-lg pointer-events-auto"
            style={{ animation: "fadeInUp 1s ease-out" }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-900 tracking-tight mb-1"
              style={{ textShadow: "0 2px 10px rgba(139,69,19,0.12)" }}>
              MEOW WORLD
            </h1>
            {home && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 text-xs md:text-sm font-semibold text-amber-900 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {home.name}
              </div>
            )}
            <p className="text-base md:text-lg text-amber-900/80 font-medium leading-relaxed">
              ยินดีต้อนรับสู่โลกของเจ้าเหมียว
            </p>

            {/* Pet avatars summary */}
            {pets.length > 0 && (
              <div className="mt-5 flex items-center gap-3" style={{ animation: "fadeInUp 1.2s ease-out 0.2s both" }}>
                <div className="flex -space-x-2.5">
                  {pets.slice(0, 5).map((pet, i) => (
                    <div
                      key={pet.id}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-lg overflow-hidden bg-amber-100"
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
                  <p className="text-xs text-amber-800/70 font-medium">{events.length} เรื่องราว</p>
                </div>
              </div>
            )}
          </div>

          {/* ===== BOTTOM NAVIGATION — Minimal Translucent Glass ===== */}
          <div className="relative z-30 pb-6 px-6 pointer-events-auto">
            <div className="mx-auto max-w-sm">
              <div
                className="flex items-center justify-around py-2.5 px-4 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.28)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 8px 32px rgba(139, 69, 19, 0.08)",
                }}
              >
                <button
                  onClick={() => router.push("/pets/birth")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition hover:bg-white/30 active:scale-95 text-amber-900/80 font-bold text-xs md:text-sm"
                >
                  <span className="text-base font-extrabold leading-none">＋</span>
                  <span>เพิ่มสมาชิก</span>
                </button>

                <div className="w-px h-6 bg-amber-900/15" />

                <button
                  onClick={() => setShowQRScanner(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition hover:bg-white/30 active:scale-95 text-amber-900/80 font-bold text-xs md:text-sm"
                >
                  <svg className="w-4 h-4 text-amber-900/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>สแกน QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CELEBRATION CONFETTI ===== */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => {
            const colors = ["#E06D53", "#F5A623", "#FFB8C6", "#6B8E68", "#C89933", "#FBBF24", "#FF8FA3", "#7BC47A"];
            const shapes = ["rounded-full", "rounded-sm", "rounded-none"];
            const left = Math.random() * 100;
            const delay = Math.random() * 1.5;
            const duration = 2 + Math.random() * 1.5;
            const size = 6 + Math.random() * 8;
            const color = colors[i % colors.length];
            const shape = shapes[i % shapes.length];
            const swayDelay = Math.random() * 2;

            return (
              <div
                key={i}
                className={`absolute ${shape}`}
                style={{
                  left: `${left}%`,
                  top: 0,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `confettiFall ${duration}s ease-in ${delay}s forwards, confettiSway ${1 + swayDelay}s ease-in-out ${delay}s infinite`,
                  opacity: 0,
                }}
              />
            );
          })}
          {/* Paw print particles */}
          {Array.from({ length: 8 }).map((_, i) => {
            const left = 15 + Math.random() * 70;
            const delay = 0.3 + Math.random() * 1.2;
            const duration = 2.5 + Math.random() * 1;
            const size = 16 + Math.random() * 12;

            return (
              <div
                key={`paw-${i}`}
                className="absolute text-center pointer-events-none select-none"
                style={{
                  left: `${left}%`,
                  top: 0,
                  fontSize: `${size}px`,
                  animation: `confettiFall ${duration}s ease-in ${delay}s forwards, confettiSway ${1.5 + Math.random()}s ease-in-out ${delay}s infinite`,
                  opacity: 0,
                }}
              >
                🐾
              </div>
            );
          })}
        </div>
      )}

      {/* ===== EMPTY MODE ===== */}
      {viewMode === "empty" && (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #FDE8C8 0%, #F9D5A0 40%, #E8C99B 100%)" }}>
          <div className="text-center space-y-4" style={{ animation: "fadeInUp 0.8s ease-out" }}>
            <div className="text-5xl">😿</div>
            <h2 className="text-xl font-bold text-amber-900">เกิดข้อผิดพลาด</h2>
            <p className="text-sm text-amber-800/60">ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่อีกครั้ง</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-amber-800 text-white text-sm font-bold"
            >
              ลองใหม่
            </button>            </div>
          </div>
        )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
      />
      </>
    );
  }
