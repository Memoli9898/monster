import { useState } from "react";

const restaurants = [
  { id: 1, name: "Nargiz", cuisine: "Azərbaycan mətbəxi", rating: 4.9, reviews: 312, priceRange: "₼₼₼", emoji: "🏛️", location: "Nizami küçəsi, Bakı", tags: ["Milli mətbəx", "Canlı musiqi", "VIP"], available: true, accent: "#E63946" },
  { id: 2, name: "Dolma", cuisine: "Fusion mətbəxi", rating: 4.7, reviews: 204, priceRange: "₼₼", emoji: "🌿", location: "İçərişəhər, Bakı", tags: ["Terrace", "Vegetarian", "Kokteyls"], available: true, accent: "#2A9D8F" },
  { id: 3, name: "Baku Palace", cuisine: "Avropa mətbəxi", rating: 4.8, reviews: 489, priceRange: "₼₼₼₼", emoji: "👑", location: "H.Əliyev pr., Bakı", tags: ["Panorama", "VIP", "Şərab bar"], available: false, accent: "#6C3FA0" },
  { id: 4, name: "Çay Evi", cuisine: "Şərq mətbəxi", rating: 4.6, reviews: 156, priceRange: "₼", emoji: "🍵", location: "Bulvar, Bakı", tags: ["Dəniz mənzərəsi", "Çay", "Sülh"], available: true, accent: "#E9763A" },
];

const timeSlots = [
  { time: "12:00", status: "busy" }, { time: "13:00", status: "busy" },
  { time: "14:00", status: "few" }, { time: "15:00", status: "free" },
  { time: "18:00", status: "busy" }, { time: "19:00", status: "few" },
  { time: "20:00", status: "free" }, { time: "21:00", status: "free" },
  { time: "22:00", status: "few" },
];

const tables = [
  { id: 1, seats: 2, x: 12, y: 13, shape: "round", label: "A1", zone: "Pəncərə", desc: "Romantik, şəhər mənzərəsi", img: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80" },
  { id: 2, seats: 2, x: 33, y: 13, shape: "round", label: "A2", zone: "Pəncərə", desc: "Sakit künc, 2 nəfərlik", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" },
  { id: 3, seats: 4, x: 63, y: 11, shape: "rect", label: "B1", zone: "Mərkəz", desc: "Açıq zal, 4 nəfərlik", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80" },
  { id: 4, seats: 4, x: 63, y: 37, shape: "rect", label: "B2", zone: "Mərkəz", desc: "İşıqlı masa, rahat oturacaq", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80" },
  { id: 5, seats: 6, x: 13, y: 52, shape: "rect6", label: "C1", zone: "Terras", desc: "Açıq terras, hava üstündə", img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=80" },
  { id: 6, seats: 8, x: 64, y: 72, shape: "vip", label: "VIP", zone: "VIP otaq", desc: "Özəl otaq, tam məxfilik", img: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400&q=80" },
  { id: 7, seats: 2, x: 33, y: 60, shape: "round", label: "A3", zone: "Bar yanı", desc: "Bar atmosferi, canlı musiqi", img: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&q=80" },
  { id: 8, seats: 4, x: 13, y: 80, shape: "rect", label: "C2", zone: "Terras", desc: "Terras, gecə mənzərəsi", img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80" },
];

const bookedTables = [3, 6];

const menuItems = [
  { id: 1, name: "Piti", desc: "Ənənəvi Azərbaycan şorbası", price: 18, cat: "Şorba", emoji: "🍲" },
  { id: 2, name: "Düşbərə", desc: "Kiçik ətli xəmir", price: 14, cat: "Şorba", emoji: "🥣" },
  { id: 3, name: "Lavangi", desc: "Qoz-fındıq ilə toyuq", price: 32, cat: "Əsas", emoji: "🍗" },
  { id: 4, name: "Kabab", desc: "Şiş kabab, soğan, pomidor", price: 28, cat: "Əsas", emoji: "🥩" },
  { id: 5, name: "Baklava", desc: "Bal və qoz ilə", price: 12, cat: "Desert", emoji: "🍯" },
  { id: 6, name: "Şirvan şərabı", desc: "Yerli istehsal", price: 22, cat: "İçki", emoji: "🍷" },
];

function TableSVG({ shape, label, seats, isBooked, isSelected, isHovered }) {
  const tableFill = isBooked ? "#FEE2E2" : isSelected ? "#EFF6FF" : isHovered ? "#F8FAFC" : "#F1F5F9";
  const tableBorder = isBooked ? "#FCA5A5" : isSelected ? "#3B82F6" : isHovered ? "#94A3B8" : "#CBD5E1";
  const chairFill = isBooked ? "#FECACA" : isSelected ? "#BFDBFE" : isHovered ? "#E2E8F0" : "#E2E8F0";
  const chairBorder = isBooked ? "#FCA5A5" : isSelected ? "#93C5FD" : "#CBD5E1";
  const labelColor = isBooked ? "#DC2626" : isSelected ? "#2563EB" : "#475569";
  const subColor = isBooked ? "#EF4444" : isSelected ? "#3B82F6" : "#94A3B8";

  if (shape === "round") return (
    <svg width="68" height="76" viewBox="0 0 68 76" style={{ display: "block" }}>
      <rect x="16" y="1" width="36" height="14" rx="7" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />
      <rect x="16" y="61" width="36" height="14" rx="7" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />
      <circle cx="34" cy="38" r="22" fill={tableFill} stroke={tableBorder} strokeWidth="1.5" />
      <text x="34" y="35" textAnchor="middle" fill={labelColor} fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif">{label}</text>
      <text x="34" y="46" textAnchor="middle" fill={subColor} fontSize="6.5" fontFamily="system-ui,sans-serif">{seats} nf</text>
    </svg>
  );

  if (shape === "rect") return (
    <svg width="96" height="82" viewBox="0 0 96 82" style={{ display: "block" }}>
      <rect x="5" y="1" width="24" height="13" rx="6.5" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />
      <rect x="67" y="1" width="24" height="13" rx="6.5" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />
      <rect x="5" y="68" width="24" height="13" rx="6.5" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />
      <rect x="67" y="68" width="24" height="13" rx="6.5" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />
      <rect x="3" y="16" width="90" height="50" rx="8" fill={tableFill} stroke={tableBorder} strokeWidth="1.5" />
      <text x="48" y="39" textAnchor="middle" fill={labelColor} fontSize="9.5" fontWeight="700" fontFamily="system-ui,sans-serif">{label}</text>
      <text x="48" y="51" textAnchor="middle" fill={subColor} fontSize="7" fontFamily="system-ui,sans-serif">{seats} nəfər</text>
    </svg>
  );

  if (shape === "rect6") return (
    <svg width="114" height="82" viewBox="0 0 114 82" style={{ display: "block" }}>
      {[4, 45, 86].map((x, i) => <rect key={i} x={x} y="1" width="24" height="13" rx="6.5" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />)}
      {[4, 45, 86].map((x, i) => <rect key={i} x={x} y="68" width="24" height="13" rx="6.5" fill={chairFill} stroke={chairBorder} strokeWidth="1.2" />)}
      <rect x="3" y="16" width="108" height="50" rx="8" fill={tableFill} stroke={tableBorder} strokeWidth="1.5" />
      <text x="57" y="39" textAnchor="middle" fill={labelColor} fontSize="9.5" fontWeight="700" fontFamily="system-ui,sans-serif">{label}</text>
      <text x="57" y="51" textAnchor="middle" fill={subColor} fontSize="7" fontFamily="system-ui,sans-serif">{seats} nəfər</text>
    </svg>
  );

  if (shape === "vip") return (
    <svg width="150" height="88" viewBox="0 0 150 88" style={{ display: "block" }}>
      {[4, 43, 82, 121].map((x, i) => <rect key={i} x={x} y="1" width="24" height="13" rx="6.5" fill={isSelected ? "#FEF9C3" : "#FEF3C7"} stroke={isSelected ? "#FCD34D" : "#FDE68A"} strokeWidth="1.2" />)}
      {[4, 43, 82, 121].map((x, i) => <rect key={i} x={x} y="74" width="24" height="13" rx="6.5" fill={isSelected ? "#FEF9C3" : "#FEF3C7"} stroke={isSelected ? "#FCD34D" : "#FDE68A"} strokeWidth="1.2" />)}
      <rect x="3" y="16" width="144" height="56" rx="10" fill={isSelected ? "#FFFBEB" : "#FFFDF5"} stroke={isSelected ? "#F59E0B" : "#FDE68A"} strokeWidth="1.5" />
      <rect x="40" y="27" width="70" height="20" rx="10" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1" />
      <text x="75" y="41" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2">VIP</text>
      <text x="75" y="58" textAnchor="middle" fill="#A16207" fontSize="7" fontFamily="system-ui,sans-serif">{seats} nəfər</text>
    </svg>
  );
  return null;
}

export default function App() {
  const [step, setStep] = useState("home");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null);
  const [cart, setCart] = useState({});
  const [guests, setGuests] = useState(2);
  const [bookingCode] = useState(() => Math.random().toString(36).substr(2, 8).toUpperCase());

  const today = new Date().toISOString().split("T")[0];
  const addToCart = (item) => setCart(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }));
  const removeFromCart = (item) => setCart(p => { const n = { ...p }; if (n[item.id] > 1) n[item.id]--; else delete n[item.id]; return n; });
  const cartTotal = menuItems.reduce((s, i) => s + (cart[i.id] || 0) * i.price, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const reset = () => { setStep("home"); setSelectedRestaurant(null); setSelectedDate(""); setSelectedTime(""); setSelectedTable(null); setHoveredTable(null); setCart({}); setGuests(2); };
  const previewTable = hoveredTable || selectedTable;
  const categories = [...new Set(menuItems.map(i => i.cat))];
  const stepNum = { home: 0, datetime: 1, table: 2, menu: 3, success: 4 }[step] || 0;
  const stepNames = ["Restoran", "Tarix & Saat", "Masa", "Menyu"];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #F8FAFC; }
    input, select { font-family: 'Inter', system-ui, sans-serif; }
    input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
    select option { background: #fff; color: #0F172A; }
    .card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
    .card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); transform: translateY(-3px); }
    .btn-primary { transition: all 0.18s ease; }
    .btn-primary:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.25); }
    .btn-primary:active:not(:disabled) { transform: translateY(0); }
    .table-svg { transition: transform 0.18s ease; }
    .table-svg:hover { transform: scale(1.07); }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #F1F5F9; } ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
  `;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F8FAFC", minHeight: "100vh", color: "#0F172A" }}>
      <style>{css}</style>

      {/* HEADER */}
      <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: "60px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div onClick={reset} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🍽️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.03em", color: "#0F172A" }}>MasaAz</div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#94A3B8", marginTop: "-2px" }}>Rezervasiya</div>
          </div>
        </div>
        {cartCount > 0 && step !== "success" && (
          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "20px", padding: "0.35rem 0.9rem", fontSize: "0.82rem", fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            🛒 {cartCount} sifariş · {cartTotal}₼
          </div>
        )}
      </header>

      {/* STEPS */}
      {step !== "home" && step !== "success" && (
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "center", padding: "0" }}>
          {stepNames.map((s, i) => {
            const done = stepNum > i + 1;
            const active = stepNum === i + 1;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 1.5rem", borderBottom: `2px solid ${done ? "#2563EB" : active ? "#93C5FD" : "transparent"}` }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: done ? "#2563EB" : active ? "#EFF6FF" : "#F1F5F9", border: `1.5px solid ${done ? "#2563EB" : active ? "#3B82F6" : "#E2E8F0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: done ? "#fff" : active ? "#2563EB" : "#94A3B8", flexShrink: 0 }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: done ? "#2563EB" : active ? "#1E40AF" : "#94A3B8" }}>{s}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── HOME ── */}
      {step === "home" && (
        <div>
          {/* Hero */}
          <div style={{ background: "#0F172A", color: "#fff", padding: "4rem 2rem 3.5rem", textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "0.35rem 1rem", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "1.2rem" }}>
              Bakının ən yaxşı restoranları
            </div>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1rem", color: "#F8FAFC" }}>
              Masanızı indi<br />
              <span style={{ color: "#60A5FA" }}>rezerv edin</span>
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "440px", margin: "0 auto", lineHeight: 1.6 }}>
              Restoranı seçin, masanı rezerv edin, menyudan əvvəlcədən sifariş verin.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.2rem", padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            {restaurants.map(r => (
              <div key={r.id} className="card"
                style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "14px", overflow: "hidden", cursor: r.available ? "pointer" : "default", opacity: r.available ? 1 : 0.5, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                onClick={() => r.available && (setSelectedRestaurant(r), setStep("datetime"))}
              >
                {/* Color top */}
                <div style={{ height: "5px", background: r.accent }} />
                <div style={{ padding: "1.4rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${r.accent}15`, border: `1px solid ${r.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                      {r.emoji}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {!r.available
                        ? <span style={{ fontSize: "0.62rem", padding: "0.2rem 0.55rem", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "20px", fontWeight: 600 }}>Tam dolu</span>
                        : <span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 500 }}>{r.priceRange}</span>
                      }
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.2rem", color: "#0F172A" }}>{r.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.cuisine}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <span style={{ color: "#F59E0B", fontSize: "0.85rem" }}>★</span>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{r.rating}</span>
                    <span style={{ color: "#94A3B8", fontSize: "0.78rem" }}>({r.reviews} rəy)</span>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748B", marginBottom: "1rem" }}>📍 {r.location}</div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1.1rem" }}>
                    {r.tags.map(t => <span key={t} style={{ fontSize: "0.65rem", padding: "0.2rem 0.55rem", borderRadius: "20px", background: `${r.accent}10`, color: r.accent, border: `1px solid ${r.accent}25`, fontWeight: 500 }}>{t}</span>)}
                  </div>

                  {r.available && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.65rem", borderRadius: "8px", background: "#0F172A", color: "#fff", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.03em" }}>
                      Rezervasiya et →
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DATE & TIME ── */}
      {step === "datetime" && selectedRestaurant && (
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem" }}>
          <button onClick={() => setStep("home")} style={{ background: "none", border: "1px solid #E2E8F0", color: "#64748B", padding: "0.5rem 1rem", fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: 500 }}>← Geri</button>

          {/* Restaurant pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem 1.2rem", marginBottom: "1.8rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${selectedRestaurant.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{selectedRestaurant.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>{selectedRestaurant.name}</div>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>{selectedRestaurant.cuisine} · {selectedRestaurant.location}</div>
            </div>
          </div>

          {/* Date & Guests */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Tarix seçin", el: <input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: "100%", border: "none", background: "transparent", fontSize: "0.95rem", color: "#0F172A", outline: "none", cursor: "pointer" }} /> },
              { label: "Qonaq sayı", el: <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={{ width: "100%", border: "none", background: "transparent", fontSize: "0.95rem", color: "#0F172A", outline: "none", cursor: "pointer" }}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} nəfər</option>)}</select> },
            ].map(f => (
              <div key={f.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.9rem 1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.4rem" }}>{f.label}</div>
                {f.el}
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.2rem", marginBottom: "1.8rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8" }}>Saat seçin</div>
              <div style={{ display: "flex", gap: "0.9rem" }}>
                {[{ c: "#22C55E", l: "Boş" }, { c: "#F59E0B", l: "Az yer" }, { c: "#EF4444", l: "Dolu" }].map(s => (
                  <span key={s.l} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.65rem", color: "#64748B" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.c, display: "inline-block" }} />{s.l}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {timeSlots.map(({ time, status }) => {
                const sel = selectedTime === time;
                const busy = status === "busy";
                const dotColor = status === "free" ? "#22C55E" : status === "few" ? "#F59E0B" : "#EF4444";
                return (
                  <button key={time} disabled={busy} onClick={() => !busy && setSelectedTime(time)}
                    style={{ padding: "0.6rem 0.9rem", minWidth: "72px", background: sel ? "#0F172A" : busy ? "#F8FAFC" : "#fff", border: `1.5px solid ${sel ? "#0F172A" : busy ? "#E2E8F0" : "#E2E8F0"}`, color: sel ? "#fff" : busy ? "#CBD5E1" : "#0F172A", cursor: busy ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: sel ? 700 : 500, borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.22rem", transition: "all 0.15s" }}>
                    <span>{time}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.52rem", fontWeight: 500, color: sel ? "rgba(255,255,255,0.7)" : dotColor }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sel ? "rgba(255,255,255,0.6)" : dotColor, display: "inline-block" }} />
                      {status === "free" ? "Boş" : status === "few" ? "Az yer" : "Dolu"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={() => setStep("table")} disabled={!selectedDate || !selectedTime} className="btn-primary"
            style={{ background: selectedDate && selectedTime ? "#0F172A" : "#E2E8F0", color: selectedDate && selectedTime ? "#fff" : "#94A3B8", border: "none", padding: "0.9rem 2rem", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, cursor: selectedDate && selectedTime ? "pointer" : "not-allowed", borderRadius: "10px", letterSpacing: "0.02em" }}>
            Masa Seç →
          </button>
        </div>
      )}

      {/* ── TABLE ── */}
      {step === "table" && (
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "2rem" }}>
          <button onClick={() => setStep("datetime")} style={{ background: "none", border: "1px solid #E2E8F0", color: "#64748B", padding: "0.5rem 1rem", fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: 500 }}>← Geri</button>

          <div style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em", marginBottom: "0.3rem" }}>Masanı seçin</div>
          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "1.2rem" }}>
            {selectedRestaurant.name} · {selectedDate} · {selectedTime} · {guests} nəfər
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "1.2rem", marginBottom: "1rem" }}>
            {[
              { bg: "#F1F5F9", bc: "#CBD5E1", l: "Boş" },
              { bg: "#EFF6FF", bc: "#3B82F6", l: "Seçilmiş" },
              { bg: "#FEF2F2", bc: "#FCA5A5", l: "Tutulmuş" },
            ].map(s => (
              <span key={s.l} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "#64748B", fontWeight: 500 }}>
                <span style={{ width: "13px", height: "13px", background: s.bg, border: `1.5px solid ${s.bc}`, display: "inline-block", borderRadius: "3px" }} />{s.l}
              </span>
            ))}
          </div>

          {/* Floor plan */}
          <div style={{ position: "relative", width: "100%", paddingBottom: "50%", background: "#fff", border: "1px solid #E2E8F0", borderRadius: "14px", overflow: "hidden", marginBottom: "1.2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ position: "absolute", inset: 0 }}>
              {/* Kitchen */}
              <div style={{ position: "absolute", right: "2.5%", top: "5%", width: "13%", height: "88%", background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", letterSpacing: "0.12em", color: "#94A3B8", textTransform: "uppercase", writingMode: "vertical-rl" }}>Mətbəx</div>
              {/* Entrance */}
              <div style={{ position: "absolute", left: "3.5%", bottom: "2.5%", width: "9%", height: "9%", background: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.48rem", color: "#94A3B8" }}>Giriş</div>

              {tables.map(table => {
                const isBooked = bookedTables.includes(table.id);
                const isSelected = selectedTable?.id === table.id;
                const isHovered = hoveredTable?.id === table.id;
                return (
                  <div key={table.id} className="table-svg"
                    style={{ position: "absolute", left: `${table.x}%`, top: `${table.y}%`, transform: "translate(-50%,-50%)", cursor: isBooked ? "not-allowed" : "pointer", opacity: isBooked ? 0.55 : 1, filter: isSelected ? "drop-shadow(0 2px 8px rgba(37,99,235,0.25))" : isHovered ? "drop-shadow(0 2px 6px rgba(0,0,0,0.1))" : "none" }}
                    onClick={() => !isBooked && setSelectedTable(isSelected ? null : table)}
                    onMouseEnter={() => setHoveredTable(table)}
                    onMouseLeave={() => setHoveredTable(null)}
                  >
                    <TableSVG shape={table.shape} label={table.label} seats={table.seats} isBooked={isBooked} isSelected={isSelected} isHovered={isHovered && !isBooked} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {previewTable && (
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", overflow: "hidden", background: "#fff", border: `1.5px solid ${selectedTable?.id === previewTable.id ? "#3B82F6" : "#E2E8F0"}`, borderRadius: "12px", marginBottom: "1.2rem", boxShadow: selectedTable?.id === previewTable.id ? "0 4px 16px rgba(37,99,235,0.1)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}>
              <img src={previewTable.img} alt={previewTable.label} style={{ width: "100%", height: "145px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "1.1rem 1.2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>Masa {previewTable.label}</span>
                    {bookedTables.includes(previewTable.id)
                      ? <span style={{ fontSize: "0.58rem", padding: "0.15rem 0.5rem", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "20px", fontWeight: 600 }}>Tutulmuş</span>
                      : <span style={{ fontSize: "0.58rem", padding: "0.15rem 0.5rem", background: "#F0FDF4", border: "1px solid #86EFAC", color: "#16A34A", borderRadius: "20px", fontWeight: 600 }}>Boş</span>
                    }
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#2563EB", fontWeight: 500, marginBottom: "0.25rem" }}>📍 {previewTable.zone}</div>
                  <div style={{ color: "#64748B", fontSize: "0.82rem", marginBottom: "0.25rem" }}>{previewTable.desc}</div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>👥 {previewTable.seats} nəfərlik</div>
                </div>
                {!bookedTables.includes(previewTable.id) && (
                  <button className="btn-primary"
                    onClick={() => setSelectedTable(selectedTable?.id === previewTable.id ? null : previewTable)}
                    style={{ background: selectedTable?.id === previewTable.id ? "#16A34A" : "#0F172A", color: "#fff", border: "none", padding: "0.55rem 1rem", fontFamily: "inherit", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", borderRadius: "8px", width: "fit-content" }}>
                    {selectedTable?.id === previewTable.id ? "✓ Seçildi" : "Bu masanı seç"}
                  </button>
                )}
              </div>
            </div>
          )}

          <button onClick={() => setStep("menu")} disabled={!selectedTable} className="btn-primary"
            style={{ background: selectedTable ? "#0F172A" : "#E2E8F0", color: selectedTable ? "#fff" : "#94A3B8", border: "none", padding: "0.9rem 2rem", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, cursor: selectedTable ? "pointer" : "not-allowed", borderRadius: "10px" }}>
            Menyuya keç →
          </button>
        </div>
      )}

      {/* ── MENU ── */}
      {step === "menu" && (
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem" }}>
          <button onClick={() => setStep("table")} style={{ background: "none", border: "1px solid #E2E8F0", color: "#64748B", padding: "0.5rem 1rem", fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: 500 }}>← Geri</button>
          <div style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em", marginBottom: "0.3rem" }}>Əvvəlcədən sifariş</div>
          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "1.8rem" }}>Gəlincə hazır olsun — gözləməyin qarşısı alınsın</div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "14px", overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {categories.map((cat, ci) => (
              <div key={cat}>
                {ci > 0 && <div style={{ height: "1px", background: "#F1F5F9" }} />}
                <div style={{ padding: "0.7rem 1.2rem", background: "#F8FAFC", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8" }}>{cat}</div>
                {menuItems.filter(i => i.cat === cat).map((item, idx, arr) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1.2rem", borderBottom: idx < arr.length - 1 ? "1px solid #F1F5F9" : "none", background: cart[item.id] ? "#F0F9FF" : "#fff", transition: "background 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <span style={{ fontSize: "1.3rem" }}>{item.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#0F172A" }}>{item.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>{item.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A" }}>{item.price}₼</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <button onClick={() => removeFromCart(item)} style={{ width: "28px", height: "28px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#475569", cursor: "pointer", borderRadius: "7px", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>−</button>
                        <span style={{ minWidth: "20px", textAlign: "center", fontWeight: 700, fontSize: "0.9rem", color: cart[item.id] ? "#2563EB" : "#CBD5E1" }}>{cart[item.id] || 0}</span>
                        <button onClick={() => addToCart(item)} style={{ width: "28px", height: "28px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB", cursor: "pointer", borderRadius: "7px", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1.2rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "0.9rem" }}>Rezervasiya xülasəsi</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.875rem" }}>
              {[["Restoran", selectedRestaurant.name], ["Tarix", selectedDate], ["Saat", selectedTime], ["Masa", `${selectedTable?.label} (${selectedTable?.seats} nf)`], ["Qonaqlar", `${guests} nəfər`]].map(([k, v]) => (
                <><span key={k} style={{ color: "#94A3B8" }}>{k}:</span><span style={{ fontWeight: 600, color: "#0F172A" }}>{v}</span></>
              ))}
              {cartCount > 0 && (
                <><span style={{ color: "#94A3B8" }}>Ön sifariş ({cartCount}):</span><span style={{ fontWeight: 700, color: "#2563EB" }}>{cartTotal}₼</span></>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button onClick={() => setStep("success")} className="btn-primary"
              style={{ background: "#0F172A", color: "#fff", border: "none", padding: "0.9rem 1.8rem", fontFamily: "inherit", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", borderRadius: "10px" }}>
              ✓ Rezervasiyanı Tamamla
            </button>
            {cartCount === 0 && (
              <button onClick={() => setStep("success")} style={{ background: "none", border: "1px solid #E2E8F0", color: "#64748B", padding: "0.9rem 1.3rem", fontFamily: "inherit", fontSize: "0.85rem", cursor: "pointer", borderRadius: "10px", fontWeight: 500 }}>
                Sifariş olmadan davam et
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SUCCESS ── */}
      {step === "success" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "3rem 2rem", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "1.2rem" }}>✓</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>Rezervasiya Təsdiqləndi!</div>
          <div style={{ color: "#64748B", marginBottom: "2rem", fontSize: "0.9rem" }}>
            Nömrəniz: <span style={{ fontWeight: 700, color: "#0F172A", background: "#F1F5F9", padding: "0.2rem 0.6rem", borderRadius: "6px" }}>#{bookingCode}</span>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1.4rem 1.8rem", marginBottom: "1.5rem", textAlign: "left", minWidth: "300px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", fontSize: "0.875rem" }}>
              {[["Restoran", selectedRestaurant?.name], ["Tarix", selectedDate], ["Saat", selectedTime], ["Masa", selectedTable?.label], ["Qonaqlar", `${guests} nəfər`]].map(([k, v]) => (
                <><span key={k} style={{ color: "#94A3B8" }}>{k}:</span><span style={{ fontWeight: 600 }}>{v}</span></>
              ))}
              {cartTotal > 0 && <><span style={{ color: "#94A3B8" }}>Ön sifariş:</span><span style={{ fontWeight: 700, color: "#2563EB" }}>{cartTotal}₼</span></>}
            </div>
          </div>

          <div style={{ color: "#94A3B8", fontSize: "0.78rem", marginBottom: "2rem" }}>📱 SMS və email vasitəsilə təsdiq göndərildi</div>

          <button onClick={reset} className="btn-primary"
            style={{ background: "#0F172A", color: "#fff", border: "none", padding: "0.9rem 2rem", fontFamily: "inherit", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", borderRadius: "10px" }}>
            Yeni Rezervasiya
          </button>
        </div>
      )}
    </div>
  );
}
