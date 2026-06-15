import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import logo from "@/assets/fetrue-logo.jpg.asset.json";
import sunrise from "@/assets/gallery-sunrise.jpg";
import growth from "@/assets/gallery-growth.jpg";
import horizon from "@/assets/gallery-horizon.jpg";
import mountain from "@/assets/gallery-mountain.jpg";

import { quotes, reflections, challenges, pickByDay } from "@/data/content";
import { markToday, readName, readStreak, writeName, clearName, type StreakState } from "@/lib/streak";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fetrue — Marcando la diferencia en tu vida" },
      { name: "description", content: "Fe, verdades diarias y crecimiento personal. Racha de 7 días, retos y reflexiones." },
    ],
  }),
  component: FetrueApp,
});

type Tab = "hoy" | "reto" | "audio" | "galeria" | "mas";

function FetrueApp() {
  const [tab, setTab] = useState<Tab>("hoy");
  const [name, setName] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [streak, setStreak] = useState<StreakState>({ count: 0, lastDate: null, history: [] });
  const [offset, setOffset] = useState(0); // shuffle through quotes/reflections

  useEffect(() => {
    setName(readName());
    setStreak(readStreak());
  }, []);

  const quote = useMemo(() => pickByDay(quotes, offset), [offset]);
  const reflection = useMemo(() => pickByDay(reflections, offset), [offset]);
  const challenge = useMemo(() => pickByDay(challenges, offset), [offset]);

  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-gradient-dawn">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-md grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logo.url} alt="Fetrue" className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-soft" />
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight text-navy truncate">Fetrue</p>
              <p className="text-[11px] text-muted-foreground truncate capitalize">{today}</p>
            </div>
          </div>
          <StreakBadge count={streak.count} />
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-28 pt-4">
        {tab === "hoy" && (
          <HoyView
            name={name}
            quote={quote}
            reflection={reflection}
            streak={streak}
            onShuffle={() => setOffset((o) => o + 1)}
            onComplete={() => setStreak(markToday())}
            onLogin={() => setShowLogin(true)}
          />
        )}
        {tab === "reto" && (
          <RetoView
            challenge={challenge}
            onShuffle={() => setOffset((o) => o + 1)}
            onComplete={() => setStreak(markToday())}
            streak={streak}
          />
        )}
        {tab === "audio" && <AudioView reflection={reflection} onShuffle={() => setOffset((o) => o + 1)} />}
        {tab === "galeria" && <GaleriaView />}
        {tab === "mas" && <MasView name={name} onLogin={() => setShowLogin(true)} onLogout={() => { clearName(); setName(null); }} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />

      {showLogin && (
        <LoginModal
          initial={name ?? ""}
          onClose={() => setShowLogin(false)}
          onSave={(n) => { writeName(n); setName(n); setShowLogin(false); }}
        />
      )}
    </div>
  );
}

/* ------------------- Pieces ------------------- */

function StreakBadge({ count }: { count: number }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-warm px-3 py-1.5 text-white shadow-glow">
      <span className="animate-flame text-base leading-none">🔥</span>
      <span className="text-sm font-bold tabular-nums">{count}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-90">racha</span>
    </div>
  );
}

function StreakRing({ streak }: { streak: StreakState }) {
  // Show last 7 days as dots
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { key, label: d.toLocaleDateString("es-ES", { weekday: "narrow" }), done: streak.history.includes(key) };
  });
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d, i) => (
        <div key={d.key} className="flex flex-col items-center gap-1.5">
          <div
            className={`grid h-9 w-9 place-items-center rounded-full border-2 transition-all ${
              d.done
                ? "bg-gradient-warm border-transparent text-white shadow-glow"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {d.done ? "✓" : i + 1}
          </div>
          <span className="text-[10px] uppercase text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function HoyView({
  name, quote, reflection, streak, onShuffle, onComplete, onLogin,
}: {
  name: string | null;
  quote: { text: string; author: string };
  reflection: { title: string; text: string };
  streak: StreakState;
  onShuffle: () => void;
  onComplete: () => void;
  onLogin: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const doneToday = streak.lastDate === today;

  return (
    <div className="space-y-6 animate-float-in">
      <section className="rounded-3xl bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-orange">Tu racha de 7 días</h2>
          <span className="text-xs text-muted-foreground">{streak.count} días</span>
        </div>
        <StreakRing streak={streak} />
        <button
          onClick={onComplete}
          disabled={doneToday}
          className="mt-5 w-full rounded-2xl bg-navy px-5 py-3.5 text-base font-semibold text-navy-foreground transition active:scale-[0.98] disabled:opacity-60"
        >
          {doneToday ? "✓ Día completado" : "Marcar día como vivido"}
        </button>
        {!name && (
          <button onClick={onLogin} className="mt-2 w-full rounded-2xl border border-border bg-transparent px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition">
            Crear perfil (opcional) →
          </button>
        )}
        {name && <p className="mt-3 text-center text-xs text-muted-foreground">Vamos, {name} ✨</p>}
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-trust p-7 text-navy-foreground shadow-soft">
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">Cita del día</p>
        <p className="mt-3 font-display text-2xl leading-snug">"{quote.text}"</p>
        <p className="mt-4 text-xs opacity-75">— {quote.author}</p>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange/40 blur-3xl" />
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-soft">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-orange">Reflexión</p>
            <h3 className="font-display text-xl text-navy truncate">{reflection.title}</h3>
          </div>
          <button onClick={onShuffle} className="shrink-0 rounded-full border border-border px-3 py-2 text-xs font-medium hover:bg-muted transition">
            ↻ Nueva
          </button>
        </div>
        <p className="text-[15px] leading-relaxed text-foreground/85">{reflection.text}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Tile emoji="🎧" label="Audio < 2 min" sub="Escucha hoy" />
        <Tile emoji="🌱" label="Reto diario" sub="Pequeña acción" />
        <Tile emoji="📓" label="Diario" sub="Próximamente" muted />
        <Tile emoji="🕊" label="Comunidad" sub="Próximamente" muted />
      </section>
    </div>
  );
}

function Tile({ emoji, label, sub, muted }: { emoji: string; label: string; sub: string; muted?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${muted ? "bg-muted/60 text-muted-foreground" : "bg-card shadow-soft"}`}>
      <div className="text-2xl">{emoji}</div>
      <p className="mt-2 text-sm font-semibold">{label}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function RetoView({
  challenge, onShuffle, onComplete, streak,
}: {
  challenge: { title: string; description: string };
  onShuffle: () => void;
  onComplete: () => void;
  streak: StreakState;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const doneToday = streak.lastDate === today;
  return (
    <div className="space-y-6 animate-float-in">
      <div className="rounded-3xl bg-gradient-warm p-7 text-white shadow-glow">
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-90">Reto de hoy</p>
        <h2 className="mt-2 font-display text-3xl leading-tight">{challenge.title}</h2>
        <p className="mt-4 text-base leading-relaxed opacity-95">{challenge.description}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onShuffle} className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted transition">
          ↻ Otro reto
        </button>
        <button
          onClick={onComplete}
          disabled={doneToday}
          className="flex-1 rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-navy-foreground active:scale-[0.98] transition disabled:opacity-60"
        >
          {doneToday ? "✓ Hecho" : "Completar"}
        </button>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <h3 className="font-display text-lg text-navy">Por qué los retos pequeños</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No buscamos transformarte en un día. Cada reto es una semilla: una acción pequeña
          que repetida vuelve hábito, y el hábito vuelve identidad. La autenticidad se
          construye en frases minúsculas que dejan de mentir.
        </p>
      </div>
    </div>
  );
}

function AudioView({ reflection, onShuffle }: { reflection: { title: string; text: string }; onShuffle: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) setSupported(false);
    return () => { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  function toggle() {
    if (!supported) return;
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    const u = new SpeechSynthesisUtterance(`${reflection.title}. ${reflection.text}`);
    u.lang = "es-ES";
    u.rate = 0.95;
    u.pitch = 1;
    u.onend = () => setPlaying(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }

  return (
    <div className="space-y-6 animate-float-in">
      <div className="rounded-3xl bg-gradient-trust p-7 text-navy-foreground shadow-soft">
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">Audio reflexión · &lt; 2 min</p>
        <h2 className="mt-2 font-display text-2xl">{reflection.title}</h2>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={toggle}
            disabled={!supported}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="grid h-24 w-24 place-items-center rounded-full bg-gradient-warm text-white text-4xl shadow-glow active:scale-95 transition disabled:opacity-50"
          >
            {playing ? "❚❚" : "▶"}
          </button>
        </div>
        <p className="mt-4 text-center text-xs opacity-75">
          {supported ? (playing ? "Reproduciendo…" : "Tu dispositivo lee la reflexión en voz alta") : "Tu navegador no soporta audio de voz"}
        </p>
      </div>

      <div className="rounded-3xl bg-card p-6 shadow-soft">
        <p className="text-[15px] leading-relaxed text-foreground/85">{reflection.text}</p>
        <button onClick={onShuffle} className="mt-4 w-full rounded-2xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted transition">
          ↻ Otra reflexión
        </button>
      </div>
    </div>
  );
}

function GaleriaView() {
  const items = [
    { src: sunrise, title: "Amanecer", caption: "Cada día empieza con luz, aunque no la veas todavía." },
    { src: growth, title: "Resiliencia", caption: "Lo pequeño también rompe la piedra." },
    { src: horizon, title: "Horizonte", caption: "Hay un mar de posibilidad delante de ti." },
    { src: mountain, title: "Perspectiva", caption: "Sube. Lo que abajo parece grande, arriba se vuelve cielo." },
  ];
  return (
    <div className="space-y-4 animate-float-in">
      <div className="px-1">
        <h2 className="font-display text-2xl text-navy">Galería</h2>
        <p className="text-sm text-muted-foreground">Imágenes para respirar despacio.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <figure key={it.title} className="overflow-hidden rounded-2xl bg-card shadow-soft">
            <img src={it.src} alt={it.title} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover" />
            <figcaption className="p-3">
              <p className="text-sm font-semibold text-navy">{it.title}</p>
              <p className="text-[11px] leading-snug text-muted-foreground">{it.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-soft">
        <h3 className="font-display text-lg text-navy">Video destacado</h3>
        <p className="text-xs text-muted-foreground mb-3">Una pausa de 1 minuto para respirar.</p>
        <div className="aspect-video overflow-hidden rounded-2xl bg-navy">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/inpok4MKVLM"
            title="Respiración guiada"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function MasView({ name, onLogin, onLogout }: { name: string | null; onLogin: () => void; onLogout: () => void }) {
  return (
    <div className="space-y-5 animate-float-in">
      <section className="rounded-3xl bg-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <img src={logo.url} alt="Fetrue" className="h-14 w-14 rounded-xl object-cover" />
          <div className="min-w-0">
            <p className="font-display text-xl text-navy">{name ?? "Invitado"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {name ? "Perfil local en este dispositivo" : "Crea un perfil para personalizar tu racha"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={onLogin} className="flex-1 rounded-2xl bg-navy px-4 py-2.5 text-sm font-semibold text-navy-foreground">
            {name ? "Editar perfil" : "Crear perfil"}
          </button>
          {name && (
            <button onClick={onLogout} className="rounded-2xl border border-border px-4 py-2.5 text-sm">
              Salir
            </button>
          )}
        </div>
      </section>

      <Section title="Sobre Fetrue">
        <p>
          <strong>Fetrue</strong> nace de dos palabras: <em>fe</em> y <em>true</em> (verdad).
          Es una app diaria para crecer con autenticidad, sin un tono religioso pesado:
          mindfulness, psicología positiva y reflexión profunda en piezas cortas.
        </p>
        <p className="text-muted-foreground">Marcando la diferencia en tu vida, un día a la vez.</p>
      </Section>

      <Section title="Lo que encontrarás">
        <ul className="space-y-1.5 text-sm">
          <li>• Cita del día para empezar con intención</li>
          <li>• Reflexión escrita y en audio (&lt; 2 min)</li>
          <li>• Reto diario pequeño y accionable</li>
          <li>• Racha de 7 días para crear hábito</li>
          <li>• Galería visual para respirar</li>
        </ul>
      </Section>

      <Section title="Contacto">
        <a href="mailto:hola@fetrue.app" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-warm px-4 py-3 text-sm font-semibold text-white shadow-glow">
          ✉ hola@fetrue.app
        </a>
        <p className="mt-3 text-xs text-muted-foreground">
          ¿Tienes una idea, un testimonio o quieres colaborar? Escríbenos. Leemos todo.
        </p>
      </Section>

      <Section title="Privacidad">
        <p className="text-sm text-muted-foreground">
          Esta app guarda tu perfil y tu racha solo en tu dispositivo. No enviamos datos a ningún servidor.
        </p>
      </Section>

      <footer className="pt-2 pb-6 text-center">
        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Fetrue · Todos los derechos reservados.
        </p>
        <p className="text-[11px] text-muted-foreground">Hecho con intención · v1.0</p>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card p-6 shadow-soft space-y-3">
      <h3 className="font-display text-lg text-navy">{title}</h3>
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: "hoy", label: "Hoy", icon: "✦" },
    { id: "reto", label: "Reto", icon: "🌱" },
    { id: "audio", label: "Audio", icon: "🎧" },
    { id: "galeria", label: "Galería", icon: "❖" },
    { id: "mas", label: "Más", icon: "≡" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex flex-col items-center gap-1 px-2 py-3 transition ${
                active ? "text-orange" : "text-muted-foreground active:text-foreground"
              }`}
            >
              <span className={`text-lg leading-none transition-transform ${active ? "scale-110" : ""}`}>{it.icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function LoginModal({ initial, onClose, onSave }: { initial: string; onClose: () => void; onSave: (n: string) => void }) {
  const [val, setVal] = useState(initial);
  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-navy/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card p-6 shadow-soft animate-float-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-2xl text-navy">Crear perfil</h3>
        <p className="mt-1 text-sm text-muted-foreground">Solo necesitamos un nombre. Se guarda en tu dispositivo, no en internet.</p>
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Tu nombre"
          className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base outline-none focus:border-orange transition"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm font-semibold">Cancelar</button>
          <button
            onClick={() => val.trim() && onSave(val)}
            className="flex-1 rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-navy-foreground disabled:opacity-50"
            disabled={!val.trim()}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
