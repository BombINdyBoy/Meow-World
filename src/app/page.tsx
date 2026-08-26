"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Pet = { id: string; name: string; species: string; breed: string | null; birth_date: string | null; weight: number | null };
type JourneyEvent = { id: string; pet_id: string; event_date: string; event_type: string; title: string; description: string | null };
type Family = { id: string; name: string; owner_id: string };
type Member = { family_id: string; user_id: string; role: string };

export default function Home() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<JourneyEvent[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tab, setTab] = useState("home");
  const [selectedPet, setSelectedPet] = useState("");
  const [message, setMessage] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabase = configured ? createClient() : null;

  const loadData = useCallback(async () => {
    if (!user) return;
    const [petResult, eventResult, familyResult, memberResult] = await Promise.all([
      supabase!.from("pets").select("id,name,species,breed,birth_date,weight").order("created_at", { ascending: false }),
      supabase!.from("life_journey_events").select("id,pet_id,event_date,event_type,title,description").order("event_date", { ascending: false }),
      supabase!.from("families").select("id,name,owner_id").order("created_at", { ascending: false }),
      supabase!.from("family_members").select("family_id,user_id,role"),
    ]);
    if (petResult.error) setMessage(petResult.error.message);
    setPets((petResult.data as Pet[]) || []);
    setEvents((eventResult.data as JourneyEvent[]) || []);
    setFamilies((familyResult.data as Family[]) || []);
    setMembers((memberResult.data as Member[]) || []);
    if (!selectedPet && petResult.data?.[0]) setSelectedPet(petResult.data[0].id);
  }, [user, selectedPet]);

  useEffect(() => {
    if (!configured) return;
    supabase!.auth.getUser().then(({ data }) => setUser(data.user ? { id: data.user.id, email: data.user.email } : null));
    const { data } = supabase!.auth.onAuthStateChange((_event, session) => setUser(session?.user ? { id: session.user.id, email: session.user.email } : null));
    return () => data.subscription.unsubscribe();
  }, [configured]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")); const password = String(form.get("password"));
    const result = authMode === "login" ? await supabase!.auth.signInWithPassword({ email, password }) : await supabase!.auth.signUp({ email, password });
    setMessage(result.error?.message || (authMode === "signup" ? "Account created. Check your email if confirmation is enabled." : "Welcome back."));
    setBusy(false);
  }

  async function addPet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user) return; setBusy(true);
    const form = new FormData(event.currentTarget);
    const result = await supabase!.from("pets").insert({ owner_id: user.id, name: form.get("name"), species: form.get("species"), breed: form.get("breed") || null, birth_date: form.get("birth_date") || null, weight: form.get("weight") || null });
    setMessage(result.error?.message || "Passport created."); event.currentTarget.reset(); await loadData(); setBusy(false);
  }

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user || !selectedPet) return; setBusy(true);
    const form = new FormData(event.currentTarget);
    const result = await supabase!.from("life_journey_events").insert({ pet_id: selectedPet, event_date: form.get("event_date"), event_type: form.get("event_type"), title: form.get("title"), description: form.get("description") || null });
    setMessage(result.error?.message || "Life Journey event added."); event.currentTarget.reset(); await loadData(); setBusy(false);
  }

  async function addFamily(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!user) return; setBusy(true);
    const name = String(new FormData(event.currentTarget).get("name"));
    const familyResult = await supabase!.from("families").insert({ name, owner_id: user.id }).select().single();
    if (!familyResult.error && familyResult.data) await supabase!.from("family_members").insert({ family_id: familyResult.data.id, user_id: user.id, role: "owner" });
    setMessage(familyResult.error?.message || "Family created."); event.currentTarget.reset(); await loadData(); setBusy(false);
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const form = new FormData(event.currentTarget);
    const result = await supabase!.from("family_members").insert({ family_id: form.get("family_id"), user_id: form.get("user_id"), role: form.get("role") });
    setMessage(result.error?.message || "Family member added."); event.currentTarget.reset(); await loadData(); setBusy(false);
  }

  async function sharePet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const form = new FormData(event.currentTarget);
    const result = await supabase!.from("pet_shares").insert({ pet_id: form.get("pet_id"), family_id: form.get("family_id"), permission: form.get("permission") });
    setMessage(result.error?.message || "Pet shared with family."); setBusy(false);
  }

  if (!configured) return <main className="setup"><span className="eyebrow">MEOW WORLD / V4.1</span><h1>Your pet&apos;s life, kept close.</h1><p>Connect Supabase to unlock Home, Passport, Life Journey, and family sharing.</p><code>Copy .env.local.example to .env.local, then add your Supabase URL and anon key.</code></main>;
  if (!user) return <main className="auth"><div className="auth-copy"><span className="eyebrow">A QUIET PLACE FOR BIG MEMORIES</span><h1>Every chapter<br /><em>matters.</em></h1><p>Keep the details, milestones, and everyday magic of your pet in one living passport.</p></div><form className="auth-form" onSubmit={authenticate}><div className="brand-mark">MW</div><h2>{authMode === "login" ? "Welcome home" : "Start your passport"}</h2><label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" minLength={6} required /></label><button disabled={busy}>{authMode === "login" ? "Log in" : "Create account"}</button><button type="button" className="text-button" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>{authMode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}</button>{message && <p className="notice">{message}</p>}</form></main>;

  const selected = pets.find((pet) => pet.id === selectedPet);
  return <div className="app-shell"><aside><div className="brand"><span>MW</span><strong>Meow World</strong></div><nav>{[["home", "Overview"], ["passport", "Passports"], ["journey", "Life Journey"], ["family", "Family"]].map(([value, label]) => <button key={value} className={tab === value ? "active" : ""} onClick={() => setTab(value)}>{label}</button>)}</nav><div className="account"><small>Signed in as</small><strong>{user.email}</strong><button className="text-button" onClick={() => supabase!.auth.signOut()}>Sign out</button></div></aside><main className="workspace"><header><div><span className="eyebrow">{tab === "home" ? "YOUR PET UNIVERSE" : tab.toUpperCase()}</span><h1>{tab === "home" ? "Good to see you." : tab === "passport" ? "Pet Passports" : tab === "journey" ? "Life Journey" : "Your family circle"}</h1></div><div className="header-dot" /></header>{message && <div className="notice">{message}</div>}{tab === "home" && <HomeView pets={pets} events={events} onSelect={(id) => { setSelectedPet(id); setTab("passport"); }} />}{tab === "passport" && <PassportView pets={pets} selectedPet={selectedPet} setSelectedPet={setSelectedPet} addPet={addPet} busy={busy} />}{tab === "journey" && <JourneyView events={events} selectedPet={selectedPet} addEvent={addEvent} busy={busy} selected={selected} />}{tab === "family" && <FamilyView families={families} members={members} pets={pets} addFamily={addFamily} addMember={addMember} sharePet={sharePet} busy={busy} />}</main></div>;
}

function HomeView({ pets, events, onSelect }: { pets: Pet[]; events: JourneyEvent[]; onSelect: (id: string) => void }) { return <><section className="hero-band"><div><span className="eyebrow">HOME / OVERVIEW</span><h2>A home for every<br /><em>little story.</em></h2><p>{pets.length ? `${pets.length} passport${pets.length > 1 ? "s" : ""} and ${events.length} memories are here.` : "Create your first passport to begin."}</p></div><div className="orbit">{pets.length || "0"}<small>PETS</small></div></section><div className="section-heading"><h2>Your passports</h2><span>{pets.length} total</span></div><div className="pet-grid">{pets.map((pet) => <button className="pet-tile" key={pet.id} onClick={() => onSelect(pet.id)}><span className="pet-avatar">{pet.name.slice(0, 1).toUpperCase()}</span><strong>{pet.name}</strong><small>{pet.species}{pet.breed ? ` / ${pet.breed}` : ""}</small></button>)}{!pets.length && <div className="empty">Your first passport is waiting to be created.</div>}</div><div className="section-heading"><h2>Recent memories</h2><span>{events.length} events</span></div><div className="memory-list">{events.slice(0, 4).map((event) => <div className="memory" key={event.id}><time>{event.event_date}</time><div><strong>{event.title}</strong><p>{event.description || event.event_type}</p></div></div>)}</div></> }

function PassportView({ pets, selectedPet, setSelectedPet, addPet, busy }: { pets: Pet[]; selectedPet: string; setSelectedPet: (id: string) => void; addPet: (event: FormEvent<HTMLFormElement>) => void; busy: boolean }) { const pet = pets.find((item) => item.id === selectedPet); return <div className="split"><section className="panel passport-card"><span className="eyebrow">IDENTITY CARD</span>{pet ? <><span className="large-avatar">{pet.name.slice(0, 1).toUpperCase()}</span><h2>{pet.name}</h2><p>{pet.species}{pet.breed ? ` / ${pet.breed}` : ""}</p><dl><div><dt>Born</dt><dd>{pet.birth_date || "Not added"}</dd></div><div><dt>Weight</dt><dd>{pet.weight ? `${pet.weight} kg` : "Not added"}</dd></div></dl></> : <div className="empty">Choose a passport or create one beside it.</div>}</section><section className="panel"><div className="section-heading"><h2>New passport</h2><span>Private by default</span></div><form onSubmit={addPet} className="form-grid"><label>Name<input name="name" required placeholder="Mochi" /></label><label>Species<input name="species" required placeholder="Cat" /></label><label>Breed<input name="breed" placeholder="British Shorthair" /></label><label>Birth date<input name="birth_date" type="date" /></label><label>Weight (kg)<input name="weight" type="number" step="0.01" min="0" /></label><button disabled={busy}>Create passport</button></form><div className="section-heading select-heading"><h2>Switch passport</h2></div><select value={selectedPet} onChange={(event) => setSelectedPet(event.target.value)}><option value="">Select a pet</option>{pets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></section></div> }

function JourneyView({ events, selectedPet, addEvent, busy, selected }: { events: JourneyEvent[]; selectedPet: string; addEvent: (event: FormEvent<HTMLFormElement>) => void; busy: boolean; selected?: Pet }) { const petEvents = events.filter((event) => event.pet_id === selectedPet); return <div className="split"><section className="panel"><span className="eyebrow">LIFE JOURNEY</span><h2>{selected?.name || "Choose a pet"}</h2><form onSubmit={addEvent} className="form-grid"><label>Event title<input name="title" required placeholder="First day home" /></label><label>Date<input name="event_date" type="date" required /></label><label>Type<select name="event_type"><option>memory</option><option>milestone</option><option>medical</option><option>vaccine</option></select></label><label className="wide">Description<textarea name="description" rows={4} placeholder="What made this day special?" /></label><button disabled={busy || !selectedPet}>Add to timeline</button></form></section><section className="panel timeline"><div className="section-heading"><h2>Timeline</h2><span>{petEvents.length} moments</span></div>{petEvents.map((event) => <div className="timeline-item" key={event.id}><span className="timeline-dot" /><time>{event.event_date}</time><strong>{event.title}</strong><small>{event.description || event.event_type}</small></div>)}{!petEvents.length && <div className="empty">No moments recorded yet.</div>}</section></div> }

function FamilyView({ families, members, pets, addFamily, addMember, sharePet, busy }: { families: Family[]; members: Member[]; pets: Pet[]; addFamily: (event: FormEvent<HTMLFormElement>) => void; addMember: (event: FormEvent<HTMLFormElement>) => void; sharePet: (event: FormEvent<HTMLFormElement>) => void; busy: boolean }) { return <><section className="family-intro"><span className="eyebrow">SHARED HOME</span><h2>Care works better<br /><em>together.</em></h2><p>Invite trusted people, assign a role, and share only the passports they need.</p></section><div className="split"><section className="panel"><div className="section-heading"><h2>Families</h2><span>{families.length} circles</span></div>{families.map((family) => <div className="family-row" key={family.id}><span className="family-icon">+</span><div><strong>{family.name}</strong><small>{members.filter((member) => member.family_id === family.id).length} members</small></div></div>)}<form onSubmit={addFamily} className="inline-form"><input name="name" required placeholder="Family name" /><button disabled={busy}>Create</button></form></section><section className="panel"><div className="section-heading"><h2>Access controls</h2><span>Owner managed</span></div><form onSubmit={addMember} className="form-grid"><label>Family<select name="family_id" required><option value="">Choose family</option>{families.map((family) => <option key={family.id} value={family.id}>{family.name}</option>)}</select></label><label>Member user ID<input name="user_id" required placeholder="Supabase user UUID" /></label><label>Role<select name="role"><option value="viewer">Viewer</option><option value="editor">Editor</option></select></label><button disabled={busy}>Add member</button></form><form onSubmit={sharePet} className="form-grid share-form"><label>Share passport<select name="pet_id" required><option value="">Choose pet</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label><label>With family<select name="family_id" required><option value="">Choose family</option>{families.map((family) => <option key={family.id} value={family.id}>{family.name}</option>)}</select></label><label>Permission<select name="permission"><option value="view">View</option><option value="edit">Edit</option></select></label><button disabled={busy}>Share passport</button></form></section></div></> }
