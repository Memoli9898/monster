import { useState, useEffect, Fragment } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jhyaiuvubbrtngvyoyhi.supabase.co";
const SUPABASE_KEY = "sb_publishable_-AK2kMXWLWYqhA7V5GoW_w_tuFg-B1W";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ALL_SLOTS = [
  "12:00","13:00","14:00","15:00","16:00",
  "17:00","18:00","19:00","20:00","21:00","22:00"
];

// ─── TableSVG ────────────────────────────────────────────────
function TableSVG({ shape, label, seats, isBooked, isSelected, isHovered }) {
  const tf = isBooked ? "#FEE2E2" : isSelected ? "#EFF6FF" : isHovered ? "#F8FAFC" : "#F1F5F9";
  const tb = isBooked ? "#FCA5A5" : isSelected ? "#3B82F6" : isHovered ? "#94A3B8" : "#CBD5E1";
  const cf = isBooked ? "#FECACA" : isSelected ? "#BFDBFE" : "#E2E8F0";
  const cb = isBooked ? "#FCA5A5" : isSelected ? "#93C5FD" : "#CBD5E1";
  const lc = isBooked ? "#DC2626" : isSelected ? "#2563EB" : "#475569";
  const sc = isBooked ? "#EF4444" : isSelected ? "#3B82F6" : "#94A3B8";

  if (shape === "round") return (
    <svg width="68" height="76" viewBox="0 0 68 76" style={{ display:"block" }}>
      <rect x="16" y="1"  width="36" height="14" rx="7" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="16" y="61" width="36" height="14" rx="7" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <circle cx="34" cy="38" r="22" fill={tf} stroke={tb} strokeWidth="1.5"/>
      <text x="34" y="35" textAnchor="middle" fill={lc} fontSize="9"   fontWeight="700" fontFamily="system-ui">{label}</text>
      <text x="34" y="46" textAnchor="middle" fill={sc} fontSize="6.5" fontFamily="system-ui">{seats}nf</text>
    </svg>
  );
  if (shape === "rect") return (
    <svg width="96" height="82" viewBox="0 0 96 82" style={{ display:"block" }}>
      <rect x="5"  y="1"  width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="67" y="1"  width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="5"  y="68" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="67" y="68" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="3" y="16" width="90" height="50" rx="8" fill={tf} stroke={tb} strokeWidth="1.5"/>
      <text x="48" y="39" textAnchor="middle" fill={lc} fontSize="9.5" fontWeight="700" fontFamily="system-ui">{label}</text>
      <text x="48" y="51" textAnchor="middle" fill={sc} fontSize="7"   fontFamily="system-ui">{seats} nf</text>
    </svg>
  );
  if (shape === "rect6") return (
    <svg width="114" height="82" viewBox="0 0 114 82" style={{ display:"block" }}>
      {[4,45,86].map((x,i) => <rect key={i} x={x} y="1"  width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>)}
      {[4,45,86].map((x,i) => <rect key={i} x={x} y="68" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>)}
      <rect x="3" y="16" width="108" height="50" rx="8" fill={tf} stroke={tb} strokeWidth="1.5"/>
      <text x="57" y="39" textAnchor="middle" fill={lc} fontSize="9.5" fontWeight="700" fontFamily="system-ui">{label}</text>
      <text x="57" y="51" textAnchor="middle" fill={sc} fontSize="7"   fontFamily="system-ui">{seats} nf</text>
    </svg>
  );
  if (shape === "vip") return (
    <svg width="150" height="88" viewBox="0 0 150 88" style={{ display:"block" }}>
      {[4,43,82,121].map((x,i) => <rect key={i} x={x} y="1"  width="24" height="13" rx="6.5" fill={isSelected?"#FEF9C3":"#FEF3C7"} stroke={isSelected?"#FCD34D":"#FDE68A"} strokeWidth="1.2"/>)}
      {[4,43,82,121].map((x,i) => <rect key={i} x={x} y="74" width="24" height="13" rx="6.5" fill={isSelected?"#FEF9C3":"#FEF3C7"} stroke={isSelected?"#FCD34D":"#FDE68A"} strokeWidth="1.2"/>)}
      <rect x="3" y="16" width="144" height="56" rx="10" fill={isSelected?"#FFFBEB":"#FFFDF5"} stroke={isSelected?"#F59E0B":"#FDE68A"} strokeWidth="1.5"/>
      <rect x="40" y="27" width="70"  height="20" rx="10" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1"/>
      <text x="75" y="41" textAnchor="middle" fill="#92400E" fontSize="9"  fontWeight="800" fontFamily="system-ui" letterSpacing="2">VIP</text>
      <text x="75" y="58" textAnchor="middle" fill="#A16207" fontSize="7"  fontFamily="system-ui">{seats} nf</text>
    </svg>
  );
  return null;
}

// ─── ANA APP ─────────────────────────────────────────────────

// ── RƏYLƏR SƏHİFƏSİ ────────────────────────────────────────
function ReviewPage() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code") || "";
  const [stars, setStars] = useState(0);
  const [hov, setHov] = useState(0);
  const [comment, setComment] = useState("");
  const [custNm, setCustNm] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [resv, setResv] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!code) return;
    supabase.from("reservations").select("*").eq("booking_code", code).maybeSingle()
      .then(({ data }) => { if (data) setResv(data); });
  }, [code]);

  const submit = async () => {
    if (!stars) { setErr("Zəhmət olmasa ulduz seçin"); return; }
    setSending(true);
    await supabase.from("reviews").insert({
      booking_code: code,
      customer_name: resv ? resv.name : custNm,
      restaurant_name: resv ? resv.restaurant_name : "",
      stars,
      comment: comment.trim() || null,
    });
    setSending(false);
    setDone(true);
  };

  const font = { fontFamily: "'Inter',system-ui,sans-serif" };

  if (done) return (
    <div style={{ ...font, minHeight:"100vh", background:"#F8FAFC", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", padding:"3rem" }}>
        <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🎉</div>
        <div style={{ fontSize:"1.6rem", fontWeight:800, color:"#0F172A", marginBottom:".5rem" }}>Təşəkkür edirik!</div>
        <div style={{ color:"#64748B" }}>Rəyiniz qeyd edildi. Növbəti dəfə görüşənədək!</div>
        <button onClick={() => window.location.href="/"} style={{ marginTop:"1.5rem", background:"#0F172A", color:"#fff", border:"none", borderRadius:"10px", padding:".8rem 2rem", fontFamily:"inherit", fontSize:".9rem", fontWeight:700, cursor:"pointer" }}>
          Ana Səhifə
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ ...font, minHeight:"100vh", background:"linear-gradient(135deg,#F8FAFC,#EFF6FF)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div style={{ background:"#fff", borderRadius:"20px", border:"1px solid #E2E8F0", padding:"2.5rem", maxWidth:"440px", width:"100%", boxShadow:"0 8px 40px rgba(0,0,0,.08)" }}>
        <div style={{ textAlign:"center", marginBottom:"1.8rem" }}>
          <div style={{ fontSize:"2.8rem", marginBottom:".5rem" }}>⭐</div>
          <div style={{ fontSize:"1.4rem", fontWeight:800, color:"#0F172A" }}>Rəyinizi bildirin</div>
          {resv ? (
            <div style={{ fontSize:".82rem", color:"#64748B", marginTop:".4rem" }}>
              {resv.restaurant_name} · {resv.date} · {resv.time}
            </div>
          ) : (
            <div style={{ fontSize:".75rem", color:"#94A3B8", marginTop:".3rem" }}>Rezervasiya kodu: #{code}</div>
          )}
        </div>

        {!resv && (
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ fontSize:".68rem", fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".3rem" }}>Adınız</label>
            <input value={custNm} onChange={e => setCustNm(e.target.value)} placeholder="Əli Həsənov"
              style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:"8px", padding:".6rem .9rem", fontSize:".9rem", outline:"none", fontFamily:"inherit" }}/>
          </div>
        )}

        <div style={{ marginBottom:"1.5rem" }}>
          <label style={{ fontSize:".68rem", fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".8rem", textAlign:"center" }}>Qiymətləndirin</label>
          <div style={{ display:"flex", justifyContent:"center", gap:".4rem" }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setStars(s)} onMouseEnter={() => setHov(s)} onMouseLeave={() => setHov(0)}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:"2.8rem", color:(hov||stars)>=s?"#F59E0B":"#E2E8F0", transition:"all .1s", transform:(hov||stars)>=s?"scale(1.2)":"scale(1)", padding:"0" }}>
                ★
              </button>
            ))}
          </div>
          {stars > 0 && (
            <div style={{ textAlign:"center", fontSize:".88rem", color:"#64748B", marginTop:".6rem", fontWeight:500 }}>
              {["","😞 Pis","😐 Orta","🙂 Yaxşı","😊 Çox yaxşı","🤩 Əla!"][stars]}
            </div>
          )}
        </div>

        <div style={{ marginBottom:"1.2rem" }}>
          <label style={{ fontSize:".68rem", fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".3rem" }}>Şərh (istəyə görə)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
            placeholder="Restoran, xidmət, mühit haqqında fikirlərinizi yazın..."
            style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:".7rem .9rem", fontSize:".88rem", outline:"none", fontFamily:"inherit", resize:"vertical", lineHeight:1.5 }}/>
        </div>

        {err && <div style={{ color:"#DC2626", fontSize:".82rem", marginBottom:".8rem", textAlign:"center" }}>{err}</div>}

        <button onClick={submit} disabled={sending}
          style={{ width:"100%", background:sending?"#94A3B8":"#0F172A", color:"#fff", border:"none", borderRadius:"10px", padding:".9rem", fontFamily:"inherit", fontSize:".95rem", fontWeight:700, cursor:sending?"not-allowed":"pointer" }}>
          {sending ? "⏳ Göndərilir..." : "✓ Rəyi Göndər"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // Review route check
  if (typeof window !== "undefined" && window.location.pathname === "/review") {
    return <ReviewPage />;
  }

  // Əsas state
  const [step, setStep]                 = useState("home");
  const [restaurants, setRestaurants]   = useState([]);
  const [dbTables, setDbTables]         = useState([]);
  const [bookedLabels, setBookedLabels] = useState([]); // seçilmiş tarix+vaxt üçün dolu masalar
  const [slotCounts, setSlotCounts]     = useState({}); // {time: count} — vaxt dolulugu
  const [loadingRests, setLoadingRests] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selRest, setSelRest]           = useState(null);
  const [selDate, setSelDate]           = useState("");
  const [selTime, setSelTime]           = useState("");
  const [selTable, setSelTable]         = useState(null);
  const [hoverTable, setHoverTable]     = useState(null);

  const [cart, setCart]                 = useState({});
  const [guests, setGuests]             = useState(2);
  const [custName, setCustName]         = useState("");
  const [custPhone, setCustPhone]       = useState("");
  const [bookingCode, setBookingCode]   = useState("");
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState("");

  // Ləğvetmə
  const [cancelPhone, setCancelPhone]   = useState("");
  const [cancelList, setCancelList]     = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMsg, setCancelMsg]       = useState("");

  const today = new Date().toISOString().split("T")[0];

  // 1. Restoranları yüklə
  useEffect(() => {
    supabase.from("restaurants").select("*").order("name").then(({ data }) => {
      setRestaurants((data || []).map(r => ({
        ...r,
        priceRange: r.price_range || "₼₼",
        tags: Array.isArray(r.tags) ? r.tags : [],
      })));
      setLoadingRests(false);
    });
  }, []);

  // 2. Restoran seçiləndə masaları yüklə
  const loadTables = async (restId) => {
    const { data } = await supabase.from("tables").select("*").eq("restaurant_id", restId).order("label");
    setDbTables((data || []).map(t => ({
      ...t,
      desc: t.zone || "",
      img:  t.img_url || "",
    })));
  };

  // 3. Tarix seçiləndə saat dolulugunu yüklə (hər vaxt üçün neçə rezervasiya var)
  const loadSlotCounts = async (restName, date) => {
    if (!restName || !date) { setSlotCounts({}); return; }
    setLoadingSlots(true);
    const { data } = await supabase
      .from("reservations")
      .select("time")
      .eq("restaurant_name", restName)
      .eq("date", date)
      .neq("status", "ləğv edildi");
    const counts = {};
    (data || []).forEach(r => { counts[r.time] = (counts[r.time] || 0) + 1; });
    setSlotCounts(counts);
    setLoadingSlots(false);
  };

  // 4. Tarix + vaxt seçiləndə dolu masaları yüklə
  const loadBookedTables = async (restName, date, time) => {
    if (!restName || !date || !time) { setBookedLabels([]); return; }
    const { data } = await supabase
      .from("reservations")
      .select("table_label")
      .eq("restaurant_name", restName)
      .eq("date", date)
      .eq("time", time)
      .neq("status", "ləğv edildi");
    setBookedLabels((data || []).map(r => r.table_label));
  };

  // Tarix dəyişəndə slot count-larını yenilə
  useEffect(() => {
    if (selRest && selDate) {
      loadSlotCounts(selRest.name, selDate);
      setSelTime("");
      setSelTable(null);
      setBookedLabels([]);
    }
  }, [selDate, selRest]);

  // Vaxt dəyişəndə dolu masaları yenilə
  useEffect(() => {
    if (selRest && selDate && selTime) {
      loadBookedTables(selRest.name, selDate, selTime);
      setSelTable(null);
    }
  }, [selTime]);

  // Vaxt statusunu hesabla
  const getSlotStatus = (time) => {
    const total = dbTables.length || 1;
    const booked = slotCounts[time] || 0;
    if (booked >= total) return "busy";
    if (booked >= Math.ceil(total * 0.6)) return "few";
    return "free";
  };

  // Menyu
  const menuItems = Array.isArray(selRest?.menu_items) ? selRest.menu_items : [];
  const categories = [...new Set(menuItems.map(i => i.cat))];
  const addItem    = (item) => setCart(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }));
  const removeItem = (item) => setCart(p => {
    const n = { ...p };
    if (n[item.id] > 1) n[item.id]--; else delete n[item.id];
    return n;
  });
  const cartTotal = menuItems.reduce((s, i) => s + (cart[i.id] || 0) * i.price, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const preview   = hoverTable || selTable;

  const stepNum   = { home:0, datetime:1, table:2, menu:3, success:4 }[step] || 0;

  const reset = () => {
    setStep("home"); setSelRest(null); setSelDate(""); setSelTime("");
    setSelTable(null); setHoverTable(null); setCart({}); setGuests(2);
    setCustName(""); setCustPhone(""); setBookingCode(""); setSaveError("");
    setBookedLabels([]); setSlotCounts({});
  };

  // Rezervasiya göndər
  const submitReservation = async () => {
    setSaving(true); setSaveError("");
    const preOrderItems = menuItems.filter(i => cart[i.id]).map(i => ({ name:i.name, qty:cart[i.id], price:i.price }));
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    const { error } = await supabase.from("reservations").insert({
      name: custName, phone: custPhone,
      restaurant_name: selRest.name,
      date: selDate, time: selTime, guests,
      table_label: selTable.label, table_zone: selTable.zone || "",
      status: "gözlənilir",
      booking_code: code,
      pre_order_total: cartTotal,
      pre_order_items: preOrderItems,
    });
    setSaving(false);
    if (error) { setSaveError("Xəta baş verdi. Yenidən cəhd edin."); return; }
    setBookingCode(code);
    setStep("success");
  };

  // Ləğvetmə — telefon ilə axtar
  const searchCancel = async () => {
    if (!cancelPhone.trim()) return;
    setCancelLoading(true); setCancelMsg(""); setCancelList(null);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("phone", cancelPhone.trim())
      .neq("status", "ləğv edildi")
      .order("date", { ascending: true });
    setCancelLoading(false);
    if (error || !data || data.length === 0) {
      setCancelMsg("Bu nömrə ilə aktiv rezervasiya tapılmadı.");
    } else {
      setCancelList(data);
    }
  };

  const doCancel = async (id) => {
    await supabase.from("reservations").update({ status: "ləğv edildi" }).eq("id", id);
    setCancelList(prev => prev ? prev.filter(r => r.id !== id) : []);
    setCancelMsg("Rezervasiya ləğv edildi ✓");
  };

  // ── Styles ──
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#F8FAFC;}
    input,select{font-family:'Inter',system-ui,sans-serif;}
    input[type="date"]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer;}
    .card{transition:box-shadow .2s,transform .2s;}
    .card:hover{box-shadow:0 8px 32px rgba(0,0,0,.1);transform:translateY(-3px);}
    .btnp{transition:all .18s;}
    .btnp:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);}
    .tsvg{transition:transform .18s;}
    .tsvg:hover{transform:scale(1.07);}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:10px;}
  `;
  const inp  = { width:"100%", border:"none", background:"transparent", fontSize:".95rem", color:"#0F172A", outline:"none" };
  const box  = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"10px", padding:".9rem 1rem", boxShadow:"0 1px 3px rgba(0,0,0,.04)" };
  const lbl  = { fontSize:".65rem", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:"#94A3B8", marginBottom:".4rem", display:"block" };
  const back = { background:"none", border:"1px solid #E2E8F0", color:"#64748B", padding:".5rem 1rem", fontFamily:"inherit", fontSize:".8rem", cursor:"pointer", borderRadius:"8px", marginBottom:"1.5rem", fontWeight:500 };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#F8FAFC", minHeight:"100vh", color:"#0F172A" }}>
      <style>{css}</style>

      {/* ══ HEADER ══ */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", position:"sticky", top:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem", height:"60px", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
        <div onClick={reset} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:".6rem" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"#0F172A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>🍽️</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"1.05rem", letterSpacing:"-.03em" }}>MasaAz</div>
            <div style={{ fontSize:".55rem", letterSpacing:".15em", textTransform:"uppercase", color:"#94A3B8", marginTop:"-2px" }}>Rezervasiya</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
          {cartCount > 0 && step !== "success" && (
            <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:"20px", padding:".35rem .9rem", fontSize:".82rem", fontWeight:600, color:"#2563EB" }}>
              🛒 {cartCount} · {cartTotal}₼
            </div>
          )}
          <button onClick={() => setStep(step === "cancel" ? "home" : "cancel")}
            style={{ background:step==="cancel"?"#F1F5F9":"none", border:"1px solid #E2E8F0", color:"#64748B", padding:".4rem .9rem", borderRadius:"8px", fontSize:".78rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            {step === "cancel" ? "← Ana səhifə" : "Rezervasiyanı ləğv et"}
          </button>
        </div>
      </header>

      {/* ══ STEP BAR ══ */}
      {!["home","success","cancel"].includes(step) && (
        <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", display:"flex", justifyContent:"center" }}>
          {["Restoran","Tarix & Saat","Masa","Menyu"].map((s, i) => {
            const done = stepNum > i+1, active = stepNum === i+1;
            return (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:".5rem", padding:".9rem 1.5rem", borderBottom:`2px solid ${done?"#2563EB":active?"#93C5FD":"transparent"}` }}>
                <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:done?"#2563EB":active?"#EFF6FF":"#F1F5F9", border:`1.5px solid ${done?"#2563EB":active?"#3B82F6":"#E2E8F0"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".6rem", fontWeight:700, color:done?"#fff":active?"#2563EB":"#94A3B8" }}>
                  {done ? "✓" : i+1}
                </div>
                <span style={{ fontSize:".72rem", fontWeight:600, letterSpacing:".05em", textTransform:"uppercase", color:done?"#2563EB":active?"#1E40AF":"#94A3B8" }}>{s}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ LƏĞVETMƏ ══ */}
      {step === "cancel" && (
        <div style={{ maxWidth:"560px", margin:"0 auto", padding:"2rem" }}>
          <div style={{ fontWeight:800, fontSize:"1.5rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Rezervasiyanı ləğv et</div>
          <div style={{ fontSize:".8rem", color:"#94A3B8", marginBottom:"1.8rem" }}>Telefon nömrənizi daxil edin, rezervasiyanızı tapın</div>
          <div style={{ display:"flex", gap:".7rem", marginBottom:"1.2rem" }}>
            <div style={{ ...box, flex:1 }}>
              <label style={lbl}>Telefon nömrəsi</label>
              <input value={cancelPhone} onChange={e => setCancelPhone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchCancel()}
                placeholder="+994 50 000 00 00" style={inp}/>
            </div>
            <button onClick={searchCancel} disabled={cancelLoading}
              style={{ background:"#0F172A", color:"#fff", border:"none", borderRadius:"10px", padding:"0 1.4rem", fontSize:".88rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              {cancelLoading ? "⏳" : "Axtar"}
            </button>
          </div>
          {cancelMsg && (
            <div style={{ background:cancelMsg.includes("✓")?"#F0FDF4":"#FEF2F2", border:`1px solid ${cancelMsg.includes("✓")?"#86EFAC":"#FECACA"}`, borderRadius:"10px", padding:".85rem 1rem", marginBottom:"1rem", color:cancelMsg.includes("✓")?"#16A34A":"#DC2626", fontWeight:600, fontSize:".88rem" }}>
              {cancelMsg}
            </div>
          )}
          {cancelList && cancelList.length > 0 && (
            <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E2E8F0", overflow:"hidden" }}>
              <div style={{ padding:".9rem 1.2rem", borderBottom:"1px solid #F1F5F9", fontWeight:700, fontSize:".9rem" }}>
                Aktiv rezervasiyalar ({cancelList.length})
              </div>
              {cancelList.map(r => (
                <div key={r.id} style={{ padding:"1rem 1.2rem", borderBottom:"1px solid #F8FAFC", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem" }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:".9rem", marginBottom:".2rem" }}>{r.restaurant_name}</div>
                    <div style={{ fontSize:".75rem", color:"#64748B" }}>📅 {r.date} · ⏰ {r.time} · 🪑 Masa {r.table_label} · 👥 {r.guests} nf</div>
                    <div style={{ fontSize:".72rem", color:"#94A3B8", marginTop:".1rem" }}>Ad: {r.name}</div>
                    {r.booking_code && <div style={{ fontSize:".68rem", color:"#3B82F6", marginTop:".1rem" }}>Kod: #{r.booking_code}</div>}
                  </div>
                  <button onClick={() => doCancel(r.id)}
                    style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", borderRadius:"8px", padding:".5rem .9rem", fontSize:".78rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>
                    Ləğv et
                  </button>
                </div>
              ))}
            </div>
          )}
          {cancelList && cancelList.length === 0 && !cancelMsg && (
            <div style={{ textAlign:"center", padding:"2rem", color:"#94A3B8" }}>Aktiv rezervasiya tapılmadı</div>
          )}
        </div>
      )}

      {/* ══ HOME ══ */}
      {step === "home" && (
        <div>
          <div style={{ background:"#0F172A", color:"#fff", padding:"4rem 2rem 3.5rem", textAlign:"center" }}>
            <div style={{ display:"inline-block", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", borderRadius:"20px", padding:".35rem 1rem", fontSize:".7rem", letterSpacing:".15em", textTransform:"uppercase", color:"#94A3B8", marginBottom:"1.2rem" }}>
              Bakının ən yaxşı restoranları
            </div>
            <h1 style={{ fontSize:"clamp(2rem,5vw,3.8rem)", fontWeight:800, lineHeight:1.1, letterSpacing:"-.03em", marginBottom:"1rem" }}>
              Masanızı indi<br/><span style={{ color:"#60A5FA" }}>rezerv edin</span>
            </h1>
            <p style={{ color:"#94A3B8", fontSize:"1rem", maxWidth:"440px", margin:"0 auto", lineHeight:1.6 }}>
              Restoranı seçin, masanı rezerv edin, menyudan əvvəlcədən sifariş verin.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.2rem", padding:"2rem", maxWidth:"1200px", margin:"0 auto" }}>
            {loadingRests && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"4rem", color:"#94A3B8" }}>
                <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>⏳</div>
                <div style={{ fontWeight:600 }}>Restoranlar yüklənir...</div>
              </div>
            )}
            {!loadingRests && restaurants.length === 0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"4rem", color:"#94A3B8" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🏛️</div>
                <div style={{ fontWeight:700, fontSize:"1.1rem", marginBottom:".5rem" }}>Hələ restoran yoxdur</div>
                <div style={{ fontSize:".85rem" }}>Admin paneldən restoran əlavə edin</div>
              </div>
            )}
            {restaurants.map(r => (
              <div key={r.id} className="card"
                style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", overflow:"hidden", cursor:r.available?"pointer":"default", opacity:r.available?1:0.5, boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}
                onClick={() => {
                  if (!r.available) return;
                  setSelRest(r); loadTables(r.id); setStep("datetime");
                }}>
                <div style={{ height:"5px", background:r.accent||"#3B82F6" }}/>
                <div style={{ padding:"1.4rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
                    <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:`${r.accent||"#3B82F6"}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem" }}>{r.emoji||"🍽️"}</div>
                    {!r.available
                      ? <span style={{ fontSize:".62rem", padding:".2rem .55rem", background:"#FEF2F2", border:"1px solid #FECACA", color:"#DC2626", borderRadius:"20px", fontWeight:600 }}>Tam dolu</span>
                      : <span style={{ fontSize:".72rem", color:"#94A3B8", fontWeight:500 }}>{r.priceRange}</span>
                    }
                  </div>
                  <div style={{ fontWeight:700, fontSize:"1.2rem", marginBottom:".2rem" }}>{r.name}</div>
                  <div style={{ fontSize:".72rem", color:"#94A3B8", marginBottom:".8rem", textTransform:"uppercase", letterSpacing:".08em" }}>{r.cuisine}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginBottom:".4rem" }}>
                    <span style={{ color:"#F59E0B" }}>★</span>
                    <span style={{ fontWeight:700, fontSize:".9rem" }}>{r.rating}</span>
                  </div>
                  <div style={{ fontSize:".76rem", color:"#64748B", marginBottom:"1rem" }}>📍 {r.location}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:".3rem", marginBottom:"1.1rem" }}>
                    {r.tags.map(t => (
                      <span key={t} style={{ fontSize:".65rem", padding:".2rem .55rem", borderRadius:"20px", background:`${r.accent||"#3B82F6"}10`, color:r.accent||"#3B82F6", border:`1px solid ${r.accent||"#3B82F6"}25`, fontWeight:500 }}>{t}</span>
                    ))}
                  </div>
                  {r.available && (
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:".65rem", borderRadius:"8px", background:"#0F172A", color:"#fff", fontSize:".82rem", fontWeight:600 }}>
                      Rezervasiya et →
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ DATE & TIME ══ */}
      {step === "datetime" && selRest && (
        <div style={{ maxWidth:"720px", margin:"0 auto", padding:"2rem" }}>
          <button onClick={() => setStep("home")} style={back}>← Geri</button>

          <div style={{ display:"flex", alignItems:"center", gap:".9rem", ...box, marginBottom:"1.8rem" }}>
            <div style={{ width:"42px", height:"42px", borderRadius:"10px", background:`${selRest.accent||"#3B82F6"}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0 }}>{selRest.emoji||"🍽️"}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:"1rem" }}>{selRest.name}</div>
              <div style={{ fontSize:".72rem", color:"#94A3B8" }}>{selRest.cuisine} · {selRest.location}</div>
            </div>
          </div>

          {/* Müştəri məlumatları */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <div style={box}>
              <label style={lbl}>Ad Soyad *</label>
              <input value={custName} onChange={e => setCustName(e.target.value)} placeholder="Əli Həsənov" style={inp}/>
            </div>
            <div style={box}>
              <label style={lbl}>Telefon *</label>
              <input type="tel" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="+994 50 000 00 00" style={inp}/>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
            <div style={box}>
              <label style={lbl}>Tarix seçin *</label>
              <input type="date" min={today} value={selDate} onChange={e => setSelDate(e.target.value)} style={{ ...inp, cursor:"pointer" }}/>
            </div>
            <div style={box}>
              <label style={lbl}>Qonaq sayı</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={{ ...inp, cursor:"pointer" }}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} nəfər</option>)}
              </select>
            </div>
          </div>

          {/* Saat seçimi — real dolulug */}
          <div style={{ ...box, padding:"1.2rem", marginBottom:"1.8rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <label style={{ ...lbl, marginBottom:0 }}>Saat seçin *</label>
              <div style={{ display:"flex", gap:".9rem" }}>
                {[{c:"#22C55E",l:"Boş"},{c:"#F59E0B",l:"Az yer"},{c:"#EF4444",l:"Dolu"}].map(s => (
                  <span key={s.l} style={{ display:"flex", alignItems:"center", gap:".3rem", fontSize:".65rem", color:"#64748B" }}>
                    <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:s.c, display:"inline-block" }}/>{s.l}
                  </span>
                ))}
              </div>
            </div>
            {!selDate ? (
              <div style={{ fontSize:".82rem", color:"#94A3B8", textAlign:"center", padding:".5rem 0" }}>Əvvəlcə tarix seçin</div>
            ) : loadingSlots ? (
              <div style={{ fontSize:".82rem", color:"#94A3B8", textAlign:"center", padding:".5rem 0" }}>⏳ Yüklənir...</div>
            ) : (
              <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem" }}>
                {ALL_SLOTS.map(time => {
                  const status = getSlotStatus(time);
                  const sel    = selTime === time;
                  const busy   = status === "busy";
                  const dot    = status === "free" ? "#22C55E" : status === "few" ? "#F59E0B" : "#EF4444";
                  return (
                    <button key={time} disabled={busy}
                      onClick={() => !busy && setSelTime(time)}
                      style={{ padding:".6rem .9rem", minWidth:"72px", background:sel?"#0F172A":busy?"#F8FAFC":"#fff", border:`1.5px solid ${sel?"#0F172A":"#E2E8F0"}`, color:sel?"#fff":busy?"#CBD5E1":"#0F172A", cursor:busy?"not-allowed":"pointer", fontFamily:"inherit", fontSize:".88rem", fontWeight:sel?700:500, borderRadius:"8px", display:"flex", flexDirection:"column", alignItems:"center", gap:".22rem" }}>
                      <span>{time}</span>
                      <span style={{ display:"flex", alignItems:"center", gap:".2rem", fontSize:".52rem", color:sel?"rgba(255,255,255,.7)":dot }}>
                        <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:sel?"rgba(255,255,255,.6)":dot, display:"inline-block" }}/>
                        {status === "free" ? "Boş" : status === "few" ? "Az yer" : "Dolu"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button className="btnp" onClick={() => setStep("table")}
            disabled={!selDate || !selTime || !custName || !custPhone}
            style={{ background:selDate&&selTime&&custName&&custPhone?"#0F172A":"#E2E8F0", color:selDate&&selTime&&custName&&custPhone?"#fff":"#94A3B8", border:"none", padding:".9rem 2rem", fontFamily:"inherit", fontSize:".95rem", fontWeight:700, cursor:selDate&&selTime&&custName&&custPhone?"pointer":"not-allowed", borderRadius:"10px" }}>
            Masa Seç →
          </button>
        </div>
      )}

      {/* ══ TABLE ══ */}
      {step === "table" && selRest && (
        <div style={{ maxWidth:"880px", margin:"0 auto", padding:"2rem" }}>
          <button onClick={() => setStep("datetime")} style={back}>← Geri</button>
          <div style={{ fontWeight:800, fontSize:"1.5rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Masanı seçin</div>
          <div style={{ fontSize:".75rem", color:"#94A3B8", marginBottom:"1.2rem" }}>
            {selRest.name} · {selDate} · {selTime} · {guests} nəfər
          </div>

          {dbTables.length === 0 ? (
            <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E2E8F0", padding:"3rem", textAlign:"center", color:"#94A3B8" }}>
              <div style={{ fontSize:"2rem", marginBottom:".7rem" }}>🪑</div>
              <div style={{ fontWeight:600 }}>Bu restoran üçün masa əlavə edilməyib</div>
              <div style={{ fontSize:".8rem", marginTop:".3rem" }}>Admin paneldən masa əlavə edin</div>
            </div>
          ) : (
            <>
              {/* Legenda */}
              <div style={{ display:"flex", gap:"1.2rem", marginBottom:"1rem" }}>
                {[{bg:"#F1F5F9",bc:"#CBD5E1",l:"Boş"},{bg:"#EFF6FF",bc:"#3B82F6",l:"Seçilmiş"},{bg:"#FEE2E2",bc:"#FCA5A5",l:"Tutulmuş"}].map(s => (
                  <span key={s.l} style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".7rem", color:"#64748B", fontWeight:500 }}>
                    <span style={{ width:"13px", height:"13px", background:s.bg, border:`1.5px solid ${s.bc}`, display:"inline-block", borderRadius:"3px" }}/>{s.l}
                  </span>
                ))}
              </div>

              {/* Floor plan */}
              <div style={{ position:"relative", width:"100%", paddingBottom:"50%", background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", overflow:"hidden", marginBottom:"1.2rem", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ position:"absolute", inset:0 }}>
                  <div style={{ position:"absolute", right:"2.5%", top:"5%", width:"13%", height:"88%", background:"#F8FAFC", border:"1.5px dashed #E2E8F0", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".5rem", letterSpacing:".12em", color:"#94A3B8", textTransform:"uppercase", writingMode:"vertical-rl" }}>Mətbəx</div>
                  <div style={{ position:"absolute", left:"3.5%", bottom:"2.5%", width:"9%", height:"9%", background:"#F8FAFC", border:"1px dashed #CBD5E1", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".48rem", color:"#94A3B8" }}>Giriş</div>
                  {dbTables.map(t => {
                    const isBooked   = bookedLabels.includes(t.label);
                    const isSelected = selTable?.id === t.id;
                    const isHovered  = hoverTable?.id === t.id;
                    return (
                      <div key={t.id} className="tsvg"
                        style={{ position:"absolute", left:`${t.x||10}%`, top:`${t.y||10}%`, transform:"translate(-50%,-50%)", cursor:isBooked?"not-allowed":"pointer", opacity:isBooked?0.55:1, filter:isSelected?"drop-shadow(0 2px 8px rgba(37,99,235,.25))":isHovered?"drop-shadow(0 2px 6px rgba(0,0,0,.1))":"none" }}
                        onClick={() => !isBooked && setSelTable(isSelected ? null : t)}
                        onMouseEnter={() => setHoverTable(t)}
                        onMouseLeave={() => setHoverTable(null)}>
                        <TableSVG shape={t.shape||"rect"} label={t.label} seats={t.seats} isBooked={isBooked} isSelected={isSelected} isHovered={isHovered && !isBooked}/>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              {preview && (
                <div style={{ display:"grid", gridTemplateColumns:preview.img?"180px 1fr":"1fr", overflow:"hidden", background:"#fff", border:`1.5px solid ${selTable?.id===preview.id?"#3B82F6":"#E2E8F0"}`, borderRadius:"12px", marginBottom:"1.2rem", boxShadow:selTable?.id===preview.id?"0 4px 16px rgba(37,99,235,.1)":"0 1px 4px rgba(0,0,0,.04)", transition:"all .2s" }}>
                  {preview.img && (
                    <img src={preview.img} alt={preview.label}
                      style={{ width:"100%", height:"145px", objectFit:"cover", display:"block" }}
                      onError={e => { e.target.style.display = "none"; }}/>
                  )}
                  <div style={{ padding:"1.1rem 1.2rem", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".3rem" }}>
                        <span style={{ fontWeight:700, fontSize:"1.05rem" }}>Masa {preview.label}</span>
                        {bookedLabels.includes(preview.label)
                          ? <span style={{ fontSize:".58rem", padding:".15rem .5rem", background:"#FEF2F2", border:"1px solid #FECACA", color:"#DC2626", borderRadius:"20px", fontWeight:600 }}>Tutulmuş</span>
                          : <span style={{ fontSize:".58rem", padding:".15rem .5rem", background:"#F0FDF4", border:"1px solid #86EFAC", color:"#16A34A", borderRadius:"20px", fontWeight:600 }}>Boş</span>
                        }
                      </div>
                      {preview.zone && <div style={{ fontSize:".72rem", color:"#2563EB", fontWeight:500, marginBottom:".25rem" }}>📍 {preview.zone}</div>}
                      <div style={{ fontSize:".72rem", color:"#94A3B8" }}>👥 {preview.seats} nəfərlik</div>
                    </div>
                    {!bookedLabels.includes(preview.label) && (
                      <button className="btnp"
                        onClick={() => setSelTable(selTable?.id === preview.id ? null : preview)}
                        style={{ background:selTable?.id===preview.id?"#16A34A":"#0F172A", color:"#fff", border:"none", padding:".55rem 1rem", fontFamily:"inherit", fontSize:".76rem", fontWeight:700, cursor:"pointer", borderRadius:"8px", width:"fit-content", marginTop:".7rem" }}>
                        {selTable?.id === preview.id ? "✓ Seçildi" : "Bu masanı seç"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button className="btnp" onClick={() => setStep("menu")} disabled={!selTable}
                style={{ background:selTable?"#0F172A":"#E2E8F0", color:selTable?"#fff":"#94A3B8", border:"none", padding:".9rem 2rem", fontFamily:"inherit", fontSize:".95rem", fontWeight:700, cursor:selTable?"pointer":"not-allowed", borderRadius:"10px" }}>
                Menyuya keç →
              </button>
            </>
          )}
        </div>
      )}

      {/* ══ MENU ══ */}
      {step === "menu" && selRest && selTable && (
        <div style={{ maxWidth:"720px", margin:"0 auto", padding:"2rem" }}>
          <button onClick={() => setStep("table")} style={back}>← Geri</button>
          <div style={{ fontWeight:800, fontSize:"1.5rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Əvvəlcədən sifariş</div>
          <div style={{ fontSize:".75rem", color:"#94A3B8", marginBottom:"1.8rem" }}>Gəlincə hazır olsun (istəyə görə)</div>

          {menuItems.length === 0 ? (
            <div style={{ ...box, textAlign:"center", padding:"2rem", marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"1.5rem", marginBottom:".5rem" }}>🍽️</div>
              <div style={{ color:"#94A3B8" }}>Bu restoran üçün menyu əlavə edilməyib</div>
            </div>
          ) : (
            <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", overflow:"hidden", marginBottom:"1.5rem" }}>
              {categories.map((cat, ci) => (
                <div key={cat}>
                  {ci > 0 && <div style={{ height:"1px", background:"#F1F5F9" }}/>}
                  <div style={{ padding:".7rem 1.2rem", background:"#F8FAFC", fontSize:".62rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"#94A3B8" }}>{cat}</div>
                  {menuItems.filter(i => i.cat === cat).map((item, idx, arr) => (
                    <div key={item.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".9rem 1.2rem", borderBottom:idx<arr.length-1?"1px solid #F1F5F9":"none", background:cart[item.id]?"#F0F9FF":"#fff" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
                        <span style={{ fontSize:"1.3rem" }}>{item.emoji||"🍽️"}</span>
                        <div>
                          <div style={{ fontWeight:600, fontSize:".92rem" }}>{item.name}</div>
                          <div style={{ fontSize:".72rem", color:"#94A3B8" }}>{item.desc}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
                        <span style={{ fontWeight:700, fontSize:".9rem" }}>{item.price}₼</span>
                        <div style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                          <button onClick={() => removeItem(item)} style={{ width:"28px", height:"28px", background:"#F1F5F9", border:"1px solid #E2E8F0", color:"#475569", cursor:"pointer", borderRadius:"7px", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                          <span style={{ minWidth:"20px", textAlign:"center", fontWeight:700, fontSize:".9rem", color:cart[item.id]?"#2563EB":"#CBD5E1" }}>{cart[item.id] || 0}</span>
                          <button onClick={() => addItem(item)} style={{ width:"28px", height:"28px", background:"#EFF6FF", border:"1px solid #BFDBFE", color:"#2563EB", cursor:"pointer", borderRadius:"7px", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Xülasə */}
          <div style={{ ...box, padding:"1.2rem", marginBottom:"1.5rem" }}>
            <div style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"#94A3B8", marginBottom:".9rem" }}>Rezervasiya xülasəsi</div>
            <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:".4rem 1rem", fontSize:".875rem" }}>
              {[["Ad", custName],["Telefon", custPhone],["Restoran", selRest.name],["Tarix", selDate],["Saat", selTime],["Masa", `${selTable.label} (${selTable.seats} nf)`],["Qonaqlar", `${guests} nəfər`]].map(([k,v]) => (
                <Fragment key={k}>
                  <span style={{ color:"#94A3B8" }}>{k}:</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </Fragment>
              ))}
              {cartCount > 0 && (
                <Fragment>
                  <span style={{ color:"#94A3B8" }}>Ön sifariş:</span>
                  <span style={{ fontWeight:700, color:"#2563EB" }}>{cartTotal}₼</span>
                </Fragment>
              )}
            </div>
          </div>

          {saveError && (
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:".75rem 1rem", marginBottom:"1rem", color:"#DC2626", fontSize:".85rem" }}>
              {saveError}
            </div>
          )}
          <div style={{ display:"flex", gap:".8rem", flexWrap:"wrap" }}>
            <button className="btnp" onClick={submitReservation} disabled={saving}
              style={{ background:saving?"#94A3B8":"#0F172A", color:"#fff", border:"none", padding:".9rem 1.8rem", fontFamily:"inherit", fontSize:".92rem", fontWeight:700, cursor:saving?"not-allowed":"pointer", borderRadius:"10px" }}>
              {saving ? "⏳ Göndərilir..." : "✓ Rezervasiyanı Tamamla"}
            </button>
            {!saving && (
              <button onClick={submitReservation}
                style={{ background:"none", border:"1px solid #E2E8F0", color:"#64748B", padding:".9rem 1.3rem", fontFamily:"inherit", fontSize:".85rem", cursor:"pointer", borderRadius:"10px", fontWeight:500 }}>
                Sifariş olmadan davam et
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══ SUCCESS ══ */}
      {step === "success" && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"70vh", padding:"3rem 2rem", textAlign:"center" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"#F0FDF4", border:"2px solid #86EFAC", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", marginBottom:"1.2rem" }}>✓</div>
          <div style={{ fontSize:"1.8rem", fontWeight:800, letterSpacing:"-.02em", marginBottom:".4rem" }}>Rezervasiya Təsdiqləndi!</div>
          <div style={{ color:"#64748B", marginBottom:"1.2rem" }}>
            Kod: <span style={{ fontWeight:700, color:"#0F172A", background:"#F1F5F9", padding:".2rem .6rem", borderRadius:"6px", fontSize:"1.1rem" }}>#{bookingCode}</span>
          </div>
          <div style={{ background:"#FEF9C3", border:"1px solid #FDE047", borderRadius:"10px", padding:".7rem 1.2rem", marginBottom:"1.5rem", fontSize:".82rem", color:"#92400E", fontWeight:500 }}>
            💡 Bu kodu yadda saxlayın — ləğv etmək lazım olarsa lazım olacaq
          </div>
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", padding:"1.4rem 1.8rem", marginBottom:"1.5rem", textAlign:"left", minWidth:"300px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:".5rem 1rem", fontSize:".875rem" }}>
              {[["Ad", custName],["Telefon", custPhone],["Restoran", selRest?.name],["Tarix", selDate],["Saat", selTime],["Masa", selTable?.label],["Qonaqlar", `${guests} nəfər`]].map(([k,v]) => (
                <Fragment key={k}>
                  <span style={{ color:"#94A3B8" }}>{k}:</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </Fragment>
              ))}
              {cartTotal > 0 && (
                <Fragment>
                  <span style={{ color:"#94A3B8" }}>Ön sifariş:</span>
                  <span style={{ fontWeight:700, color:"#2563EB" }}>{cartTotal}₼</span>
                </Fragment>
              )}
            </div>
          </div>
          <a href={"/review?code=" + bookingCode}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".5rem", background:"#FFFBEB", border:"1px solid #FDE047", borderRadius:"10px", padding:".75rem 1.5rem", marginBottom:"1rem", color:"#92400E", textDecoration:"none", fontSize:".85rem", fontWeight:600 }}>
            ⭐ Rəyinizi bildirin — 30 saniyə çəkir
          </a>
          <button className="btnp" onClick={reset}
            style={{ background:"#0F172A", color:"#fff", border:"none", padding:".9rem 2rem", fontFamily:"inherit", fontSize:".92rem", fontWeight:700, cursor:"pointer", borderRadius:"10px" }}>
            Yeni Rezervasiya
          </button>
        </div>
      )}
    </div>
  );
}
