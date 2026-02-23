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

// ─── RƏYLƏR SƏHİFƏSİ ────────────────────────────────────────
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
      stars, comment: comment.trim() || null,
    });
    setSending(false); setDone(true);
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
            <div style={{ fontSize:".82rem", color:"#64748B", marginTop:".4rem" }}>{resv.restaurant_name} · {resv.date} · {resv.time}</div>
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
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:"2.8rem", color:(hov||stars)>=s?"#F59E0B":"#E2E8F0", transition:"all .1s", transform:(hov||stars)>=s?"scale(1.2)":"scale(1)", padding:"0" }}>★</button>
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
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Restoran, xidmət, mühit haqqında..."
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

// ─── ADMİN PANELİ ────────────────────────────────────────────
function AdminPanel() {
  // adminUser state burada — refresh olmadan işləyir
  const [adminUser, setAdminUser] = useState(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr]   = useState("");
  const [logging, setLogging]     = useState(false);

  const doLogin = async () => {
    if (!loginUser || !loginPass) { setLoginErr("İstifadəçi adı və şifrə daxil edin"); return; }
    setLogging(true); setLoginErr("");
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", loginUser.trim())
      .eq("password_hash", loginPass.trim())
      .eq("is_active", true)
      .maybeSingle();
    setLogging(false);
    if (error || !data) { setLoginErr("İstifadəçi adı və ya şifrə yanlışdır"); return; }
    setAdminUser(data); // ← state dəyişir, birbaşa dashboard açılır
  };

  if (!adminUser) return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", minHeight:"100vh", background:"#0F172A", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <div style={{ background:"#fff", borderRadius:"20px", padding:"2.5rem", maxWidth:"380px", width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:"#0F172A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", margin:"0 auto .8rem" }}>🍽️</div>
          <div style={{ fontWeight:800, fontSize:"1.4rem", letterSpacing:"-.02em" }}>MasaAz Admin</div>
          <div style={{ fontSize:".8rem", color:"#94A3B8", marginTop:".3rem" }}>İdarəetmə panelinə daxil olun</div>
        </div>
        <div style={{ marginBottom:"1rem" }}>
          <label style={{ fontSize:".68rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".4rem" }}>İstifadəçi adı</label>
          <input value={loginUser} onChange={e => setLoginUser(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="admin" autoFocus
            style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:".75rem 1rem", fontSize:".95rem", outline:"none", fontFamily:"inherit" }}/>
        </div>
        <div style={{ marginBottom:"1.5rem" }}>
          <label style={{ fontSize:".68rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".4rem" }}>Şifrə</label>
          <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="••••••••"
            style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:".75rem 1rem", fontSize:".95rem", outline:"none", fontFamily:"inherit" }}/>
        </div>
        {loginErr && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:".6rem .9rem", marginBottom:"1rem", color:"#DC2626", fontSize:".85rem", fontWeight:500 }}>{loginErr}</div>}
        <button onClick={doLogin} disabled={logging}
          style={{ width:"100%", background:logging?"#94A3B8":"#0F172A", color:"#fff", border:"none", borderRadius:"10px", padding:".9rem", fontFamily:"inherit", fontSize:".95rem", fontWeight:700, cursor:logging?"not-allowed":"pointer" }}>
          {logging ? "⏳ Yoxlanılır..." : "Daxil ol →"}
        </button>
        <div style={{ textAlign:"center", marginTop:"1.2rem" }}>
          <a href="/" style={{ fontSize:".8rem", color:"#94A3B8", textDecoration:"none" }}>← Ana səhifəyə qayıt</a>
        </div>
      </div>
    </div>
  );

  return <AdminDashboard adminUser={adminUser} onLogout={() => setAdminUser(null)} />;
}

// ─── ADMİN DASHBOARD ─────────────────────────────────────────
function AdminDashboard({ adminUser, onLogout }) {
  const [tab, setTab]           = useState("reservations");
  const [reservations, setRes]  = useState([]);
  const [restaurants, setRests] = useState([]);
  const [tables, setTables]     = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filterStatus, setFS]   = useState("all");
  const [filterRest, setFR]     = useState("all");
  const [search, setSearch]     = useState("");

  const [restForm, setRestForm] = useState({ name:"", cuisine:"", location:"", emoji:"🍽️", accent:"#3B82F6", price_range:"₼₼", rating:4.5, available:true, tags:"" });
  const [editRestId, setEditRId]= useState(null);
  const [savingRest, setSavRest]= useState(false);

  const [tblForm, setTblForm]   = useState({ label:"", seats:4, zone:"", shape:"rect", x:20, y:20, restaurant_id:"" });
  const [editTblId, setEditTId] = useState(null);
  const [savingTbl, setSavTbl]  = useState(false);

  const load = async () => {
    setLoading(true);
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from("reservations").select("*").order("created_at", { ascending:false }),
      supabase.from("restaurants").select("*").order("name"),
      supabase.from("tables").select("*").order("label"),
      supabase.from("reviews").select("*").order("created_at", { ascending:false }),
    ]);
    setRes(r1.data || []);
    setRests(r2.data || []);
    setTables(r3.data || []);
    setReviews(r4.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const myRests = adminUser.is_super ? restaurants : restaurants.filter(r => r.id === adminUser.restaurant_id);

  const filteredRes = reservations.filter(r => {
    if (!adminUser.is_super && r.restaurant_name !== myRests[0]?.name) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterRest !== "all" && r.restaurant_name !== filterRest) return false;
    if (search && !r.name?.toLowerCase().includes(search.toLowerCase()) &&
        !r.phone?.includes(search) && !r.booking_code?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = async (id, status) => {
    await supabase.from("reservations").update({ status }).eq("id", id);
    setRes(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const saveRest = async () => {
    setSavRest(true);
    const payload = { ...restForm, tags: restForm.tags ? restForm.tags.split(",").map(t=>t.trim()).filter(Boolean) : [], rating: parseFloat(restForm.rating)||4.5 };
    if (editRestId) await supabase.from("restaurants").update(payload).eq("id", editRestId);
    else await supabase.from("restaurants").insert(payload);
    setSavRest(false); setEditRId(null);
    setRestForm({ name:"", cuisine:"", location:"", emoji:"🍽️", accent:"#3B82F6", price_range:"₼₼", rating:4.5, available:true, tags:"" });
    load();
  };

  const deleteRest = async (id) => {
    if (!confirm("Restoranı silmək istəyirsiniz?")) return;
    await supabase.from("restaurants").delete().eq("id", id);
    load();
  };

  const editRest = (r) => {
    setEditRId(r.id);
    setRestForm({ name:r.name, cuisine:r.cuisine||"", location:r.location||"", emoji:r.emoji||"🍽️", accent:r.accent||"#3B82F6", price_range:r.price_range||"₼₼", rating:r.rating||4.5, available:r.available!==false, tags:(r.tags||[]).join(", ") });
    setTab("restaurants"); window.scrollTo(0,0);
  };

  const saveTbl = async () => {
    setSavTbl(true);
    const payload = { ...tblForm, seats:parseInt(tblForm.seats)||4, restaurant_id:parseInt(tblForm.restaurant_id), x:parseFloat(tblForm.x)||20, y:parseFloat(tblForm.y)||20 };
    if (editTblId) await supabase.from("tables").update(payload).eq("id", editTblId);
    else await supabase.from("tables").insert(payload);
    setSavTbl(false); setEditTId(null);
    setTblForm({ label:"", seats:4, zone:"", shape:"rect", x:20, y:20, restaurant_id:"" });
    load();
  };

  const deleteTbl = async (id) => {
    if (!confirm("Masanı silmək istəyirsiniz?")) return;
    await supabase.from("tables").delete().eq("id", id);
    load();
  };

  const editTbl = (t) => {
    setEditTId(t.id);
    setTblForm({ label:t.label, seats:t.seats||4, zone:t.zone||"", shape:t.shape||"rect", x:t.x||20, y:t.y||20, restaurant_id:t.restaurant_id||"" });
    setTab("tables"); window.scrollTo(0,0);
  };

  const sideBtn = (active) => ({ display:"flex", alignItems:"center", gap:".7rem", padding:".75rem 1rem", borderRadius:"10px", border:"none", background:active?"#1E293B":"transparent", color:active?"#fff":"#94A3B8", fontFamily:"'Inter',system-ui,sans-serif", fontSize:".88rem", fontWeight:active?600:400, cursor:"pointer", width:"100%", textAlign:"left" });
  const card = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"12px", padding:"1.2rem" };
  const inp  = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"8px", padding:".6rem .9rem", fontSize:".9rem", outline:"none", fontFamily:"'Inter',system-ui,sans-serif" };
  const lbl  = { fontSize:".65rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".3rem" };

  const statusBadge = (s) => {
    const m = { "gözlənilir":["#FEF9C3","#A16207"], "təsdiqləndi":["#F0FDF4","#16A34A"], "ləğv edildi":["#FEF2F2","#DC2626"], "tamamlandı":["#EFF6FF","#2563EB"] };
    const [bg, c] = m[s] || ["#F1F5F9","#64748B"];
    return <span style={{ background:bg, color:c, borderRadius:"20px", padding:".15rem .6rem", fontSize:".68rem", fontWeight:700 }}>{s}</span>;
  };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", minHeight:"100vh", background:"#F8FAFC", display:"flex" }}>
      {/* Sidebar */}
      <aside style={{ width:"220px", background:"#0F172A", color:"#fff", padding:"1.2rem", flexShrink:0, display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:"2rem", padding:".5rem 0" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:"#1E293B", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>🍽️</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"1rem" }}>MasaAz</div>
            <div style={{ fontSize:".58rem", color:"#475569", letterSpacing:".1em" }}>ADMIN</div>
          </div>
        </div>
        <nav style={{ display:"flex", flexDirection:"column", gap:".3rem", flex:1 }}>
          {[
            { id:"reservations", icon:"📋", label:"Rezervasiyalar" },
            { id:"restaurants",  icon:"🏛️", label:"Restoranlar" },
            { id:"tables",       icon:"🪑", label:"Masalar" },
            { id:"reviews",      icon:"⭐", label:"Rəylər" },
            ...(adminUser.is_super ? [{ id:"admins", icon:"👤", label:"Adminlər" }] : []),
          ].map(({ id, icon, label }) => (
            <button key={id} onClick={() => setTab(id)} style={sideBtn(tab === id)}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </nav>
        <div style={{ borderTop:"1px solid #1E293B", paddingTop:"1rem", marginTop:"1rem" }}>
          <div style={{ fontSize:".75rem", color:"#475569", marginBottom:".5rem" }}>
            {adminUser.display_name || adminUser.username}
            {adminUser.is_super && <span style={{ background:"#1E293B", color:"#60A5FA", borderRadius:"4px", padding:".1rem .4rem", fontSize:".6rem", marginLeft:".4rem" }}>SUPER</span>}
          </div>
          <button onClick={onLogout}
            style={{ width:"100%", background:"#1E293B", color:"#94A3B8", border:"none", borderRadius:"8px", padding:".55rem", fontFamily:"inherit", fontSize:".8rem", cursor:"pointer" }}>
            Çıxış
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, padding:"1.8rem", overflow:"auto" }}>

        {/* ══ REZERVASIYALAR ══ */}
        {tab === "reservations" && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:"1.4rem", letterSpacing:"-.02em" }}>Rezervasiyalar</div>
                <div style={{ fontSize:".8rem", color:"#94A3B8" }}>Bütün rezervasiyaları idarə edin</div>
              </div>
              <button onClick={load} style={{ background:"#0F172A", color:"#fff", border:"none", borderRadius:"8px", padding:".55rem 1.1rem", fontFamily:"inherit", fontSize:".82rem", fontWeight:600, cursor:"pointer" }}>🔄 Yenilə</button>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
              {[
                { label:"Cəmi", val:reservations.length, bg:"#0F172A", c:"#fff" },
                { label:"Gözlənilir", val:reservations.filter(r=>r.status==="gözlənilir").length, bg:"#FEF9C3", c:"#A16207" },
                { label:"Təsdiqlənib", val:reservations.filter(r=>r.status==="təsdiqləndi").length, bg:"#F0FDF4", c:"#16A34A" },
                { label:"Ləğv", val:reservations.filter(r=>r.status==="ləğv edildi").length, bg:"#FEF2F2", c:"#DC2626" },
              ].map(s => (
                <div key={s.label} style={{ background:s.bg, borderRadius:"12px", padding:"1rem 1.2rem", border:"1px solid #E2E8F0" }}>
                  <div style={{ fontSize:"1.8rem", fontWeight:800, color:s.c }}>{s.val}</div>
                  <div style={{ fontSize:".72rem", color:s.c, opacity:.75, marginTop:".2rem" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:".7rem", marginBottom:"1.2rem", flexWrap:"wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Ad, telefon, kod..."
                style={{ ...inp, width:"220px" }}/>
              <select value={filterStatus} onChange={e => setFS(e.target.value)} style={{ ...inp, width:"160px", cursor:"pointer" }}>
                <option value="all">Bütün statuslar</option>
                <option value="gözlənilir">Gözlənilir</option>
                <option value="təsdiqləndi">Təsdiqləndi</option>
                <option value="ləğv edildi">Ləğv edildi</option>
                <option value="tamamlandı">Tamamlandı</option>
              </select>
              {adminUser.is_super && (
                <select value={filterRest} onChange={e => setFR(e.target.value)} style={{ ...inp, width:"180px", cursor:"pointer" }}>
                  <option value="all">Bütün restoranlar</option>
                  {restaurants.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign:"center", padding:"3rem", color:"#94A3B8" }}>⏳ Yüklənir...</div>
            ) : filteredRes.length === 0 ? (
              <div style={{ textAlign:"center", padding:"3rem", color:"#94A3B8", background:"#fff", borderRadius:"12px", border:"1px solid #E2E8F0" }}>
                <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>📋</div>
                <div style={{ fontWeight:600 }}>Rezervasiya tapılmadı</div>
              </div>
            ) : (
              <div style={{ background:"#fff", borderRadius:"12px", border:"1px solid #E2E8F0", overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".83rem" }}>
                  <thead>
                    <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                      {["Kod","Ad / Tel","Restoran","Tarix & Saat","Masa","Qonaq","Status","Əməliyyat"].map(h => (
                        <th key={h} style={{ padding:".75rem 1rem", textAlign:"left", fontWeight:700, fontSize:".68rem", letterSpacing:".08em", textTransform:"uppercase", color:"#64748B" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRes.map((r,i) => (
                      <tr key={r.id} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#FAFBFC" }}>
                        <td style={{ padding:".75rem 1rem", fontWeight:700, color:"#3B82F6", fontSize:".75rem" }}>#{r.booking_code||r.id}</td>
                        <td style={{ padding:".75rem 1rem" }}><div style={{ fontWeight:600 }}>{r.name}</div><div style={{ fontSize:".72rem", color:"#94A3B8" }}>{r.phone}</div></td>
                        <td style={{ padding:".75rem 1rem", color:"#64748B" }}>{r.restaurant_name}</td>
                        <td style={{ padding:".75rem 1rem" }}><div style={{ fontWeight:500 }}>{r.date}</div><div style={{ fontSize:".72rem", color:"#94A3B8" }}>{r.time}</div></td>
                        <td style={{ padding:".75rem 1rem", color:"#64748B" }}>{r.table_label}</td>
                        <td style={{ padding:".75rem 1rem", textAlign:"center", color:"#64748B" }}>{r.guests}</td>
                        <td style={{ padding:".75rem 1rem" }}>{statusBadge(r.status)}</td>
                        <td style={{ padding:".75rem 1rem" }}>
                          <div style={{ display:"flex", gap:".4rem" }}>
                            {r.status === "gözlənilir" && (
                              <button onClick={() => updateStatus(r.id,"təsdiqləndi")} style={{ background:"#F0FDF4", color:"#16A34A", border:"1px solid #86EFAC", borderRadius:"6px", padding:".28rem .6rem", fontSize:".72rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>✓</button>
                            )}
                            {r.status !== "ləğv edildi" && r.status !== "tamamlandı" && (
                              <button onClick={() => updateStatus(r.id,"ləğv edildi")} style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", borderRadius:"6px", padding:".28rem .6rem", fontSize:".72rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>✕</button>
                            )}
                            {r.status === "təsdiqləndi" && (
                              <button onClick={() => updateStatus(r.id,"tamamlandı")} style={{ background:"#EFF6FF", color:"#2563EB", border:"1px solid #BFDBFE", borderRadius:"6px", padding:".28rem .6rem", fontSize:".72rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>✔✔</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ══ RESTORANLAR ══ */}
        {tab === "restaurants" && (
          <>
            <div style={{ fontWeight:800, fontSize:"1.4rem", letterSpacing:"-.02em", marginBottom:"1.5rem" }}>Restoranlar</div>
            <div style={{ ...card, marginBottom:"1.5rem" }}>
              <div style={{ fontWeight:700, fontSize:"1rem", marginBottom:"1.2rem" }}>{editRestId ? "✏️ Redaktə et" : "➕ Yeni restoran"}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
                {[["Ad *","name","Restoran adı"],["Mətbəx","cuisine","Azərbaycan..."],["Ünvan","location","Bakı, Nizami..."],["Emoji","emoji","🍽️"],["Qiymət aralığı (price_range)","price_range","₼₼"]].map(([label,key,ph]) => (
                  <div key={key}>
                    <label style={lbl}>{label}</label>
                    {key === "price_range" ? (
                      <select value={restForm[key]} onChange={e => setRestForm(p=>({...p,[key]:e.target.value}))} style={{ ...inp, cursor:"pointer" }}>
                        {["₼","₼₼","₼₼₼","₼₼₼₼"].map(v=><option key={v} value={v}>{v}</option>)}
                      </select>
                    ) : (
                      <input value={restForm[key]} onChange={e => setRestForm(p=>({...p,[key]:e.target.value}))} style={inp} placeholder={ph}/>
                    )}
                  </div>
                ))}
                <div>
                  <label style={lbl}>Rəng</label>
                  <div style={{ display:"flex", gap:".5rem", alignItems:"center" }}>
                    <input type="color" value={restForm.accent} onChange={e => setRestForm(p=>({...p,accent:e.target.value}))} style={{ width:"42px", height:"38px", border:"1px solid #E2E8F0", borderRadius:"8px", cursor:"pointer", padding:"2px" }}/>
                    <input value={restForm.accent} onChange={e => setRestForm(p=>({...p,accent:e.target.value}))} style={{ ...inp, flex:1 }}/>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Reytinq</label>
                  <input type="number" min="1" max="5" step="0.1" value={restForm.rating} onChange={e => setRestForm(p=>({...p,rating:e.target.value}))} style={inp}/>
                </div>
                <div>
                  <label style={lbl}>Etiketlər (vergüllə)</label>
                  <input value={restForm.tags} onChange={e => setRestForm(p=>({...p,tags:e.target.value}))} style={inp} placeholder="Pizzacı, Ailə, Romantik"/>
                </div>
                <div>
                  <label style={lbl}>Status</label>
                  <select value={restForm.available} onChange={e => setRestForm(p=>({...p,available:e.target.value==="true"}))} style={{ ...inp, cursor:"pointer" }}>
                    <option value="true">Açıqdır</option>
                    <option value="false">Bağlıdır</option>
                  </select>
                </div>
              </div>
              <div style={{ display:"flex", gap:".7rem" }}>
                <button onClick={saveRest} disabled={savingRest||!restForm.name}
                  style={{ background:savingRest||!restForm.name?"#94A3B8":"#0F172A", color:"#fff", border:"none", borderRadius:"8px", padding:".7rem 1.5rem", fontFamily:"inherit", fontSize:".88rem", fontWeight:700, cursor:"pointer" }}>
                  {savingRest?"⏳...":editRestId?"✓ Saxla":"➕ Əlavə et"}
                </button>
                {editRestId && (
                  <button onClick={() => { setEditRId(null); setRestForm({ name:"", cuisine:"", location:"", emoji:"🍽️", accent:"#3B82F6", price_range:"₼₼", rating:4.5, available:true, tags:"" }); }}
                    style={{ background:"#F1F5F9", color:"#64748B", border:"1px solid #E2E8F0", borderRadius:"8px", padding:".7rem 1.2rem", fontFamily:"inherit", fontSize:".88rem", cursor:"pointer" }}>İmtina</button>
                )}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1rem" }}>
              {myRests.map(r => (
                <div key={r.id} style={{ ...card, borderTop:`3px solid ${r.accent||"#3B82F6"}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:".8rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:".7rem" }}>
                      <span style={{ fontSize:"1.5rem" }}>{r.emoji||"🍽️"}</span>
                      <div>
                        <div style={{ fontWeight:700 }}>{r.name}</div>
                        <div style={{ fontSize:".72rem", color:"#94A3B8" }}>{r.cuisine} · {r.location}</div>
                      </div>
                    </div>
                    <span style={{ background:r.available?"#F0FDF4":"#FEF2F2", color:r.available?"#16A34A":"#DC2626", borderRadius:"20px", padding:".15rem .6rem", fontSize:".65rem", fontWeight:700 }}>{r.available?"Açıq":"Bağlı"}</span>
                  </div>
                  <div style={{ fontSize:".78rem", color:"#64748B", marginBottom:"1rem" }}>★ {r.rating} · {r.price_range} · {tables.filter(t=>t.restaurant_id===r.id).length} masa</div>
                  <div style={{ display:"flex", gap:".5rem" }}>
                    <button onClick={() => editRest(r)} style={{ flex:1, background:"#EFF6FF", color:"#2563EB", border:"1px solid #BFDBFE", borderRadius:"7px", padding:".5rem", fontFamily:"inherit", fontSize:".8rem", fontWeight:600, cursor:"pointer" }}>✏️ Redaktə</button>
                    {adminUser.is_super && (
                      <button onClick={() => deleteRest(r.id)} style={{ flex:1, background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", borderRadius:"7px", padding:".5rem", fontFamily:"inherit", fontSize:".8rem", fontWeight:600, cursor:"pointer" }}>🗑️ Sil</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ MASALAR ══ */}
        {tab === "tables" && (
          <>
            <div style={{ fontWeight:800, fontSize:"1.4rem", letterSpacing:"-.02em", marginBottom:"1.5rem" }}>Masalar</div>
            <div style={{ ...card, marginBottom:"1.5rem" }}>
              <div style={{ fontWeight:700, fontSize:"1rem", marginBottom:"1.2rem" }}>{editTblId ? "✏️ Masanı redaktə et" : "➕ Yeni masa"}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1rem" }}>
                <div>
                  <label style={lbl}>Restoran *</label>
                  <select value={tblForm.restaurant_id} onChange={e => setTblForm(p=>({...p,restaurant_id:e.target.value}))} style={{ ...inp, cursor:"pointer" }}>
                    <option value="">Seçin...</option>
                    {myRests.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Masa adı/nömrəsi *</label>
                  <input value={tblForm.label} onChange={e => setTblForm(p=>({...p,label:e.target.value}))} style={inp} placeholder="A1, VIP-1..."/>
                </div>
                <div>
                  <label style={lbl}>Oturacaq sayı</label>
                  <select value={tblForm.seats} onChange={e => setTblForm(p=>({...p,seats:e.target.value}))} style={{ ...inp, cursor:"pointer" }}>
                    {[1,2,3,4,5,6,7,8,10,12].map(n=><option key={n} value={n}>{n} nəfər</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Zona</label>
                  <input value={tblForm.zone} onChange={e => setTblForm(p=>({...p,zone:e.target.value}))} style={inp} placeholder="Terasa, VIP, İçəri..."/>
                </div>
                <div>
                  <label style={lbl}>Forma</label>
                  <select value={tblForm.shape} onChange={e => setTblForm(p=>({...p,shape:e.target.value}))} style={{ ...inp, cursor:"pointer" }}>
                    <option value="rect">Düzbucaqlı (4 nf)</option>
                    <option value="rect6">Böyük (6 nf)</option>
                    <option value="round">Dairəvi</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Mövqe X% / Y%</label>
                  <div style={{ display:"flex", gap:".5rem" }}>
                    <input type="number" value={tblForm.x} onChange={e => setTblForm(p=>({...p,x:e.target.value}))} style={inp} placeholder="X (%)"/>
                    <input type="number" value={tblForm.y} onChange={e => setTblForm(p=>({...p,y:e.target.value}))} style={inp} placeholder="Y (%)"/>
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:".7rem" }}>
                <button onClick={saveTbl} disabled={savingTbl||!tblForm.label||!tblForm.restaurant_id}
                  style={{ background:savingTbl||!tblForm.label||!tblForm.restaurant_id?"#94A3B8":"#0F172A", color:"#fff", border:"none", borderRadius:"8px", padding:".7rem 1.5rem", fontFamily:"inherit", fontSize:".88rem", fontWeight:700, cursor:"pointer" }}>
                  {savingTbl?"⏳...":editTblId?"✓ Saxla":"➕ Əlavə et"}
                </button>
                {editTblId && (
                  <button onClick={() => { setEditTId(null); setTblForm({ label:"", seats:4, zone:"", shape:"rect", x:20, y:20, restaurant_id:"" }); }}
                    style={{ background:"#F1F5F9", color:"#64748B", border:"1px solid #E2E8F0", borderRadius:"8px", padding:".7rem 1.2rem", fontFamily:"inherit", fontSize:".88rem", cursor:"pointer" }}>İmtina</button>
                )}
              </div>
            </div>
            {myRests.map(rest => {
              const rTables = tables.filter(t => t.restaurant_id === rest.id);
              return (
                <div key={rest.id} style={{ marginBottom:"1.5rem" }}>
                  <div style={{ fontWeight:700, fontSize:".9rem", marginBottom:".8rem", color:"#64748B" }}>{rest.emoji} {rest.name} ({rTables.length} masa)</div>
                  {rTables.length === 0 ? (
                    <div style={{ ...card, textAlign:"center", color:"#94A3B8", padding:"1.5rem" }}>Masa yoxdur</div>
                  ) : (
                    <div style={{ background:"#fff", borderRadius:"12px", border:"1px solid #E2E8F0", overflow:"hidden" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".83rem" }}>
                        <thead>
                          <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                            {["Ad","Oturacaq","Zona","Forma","Mövqe (x,y)","Əməliyyat"].map(h=>(
                              <th key={h} style={{ padding:".7rem 1rem", textAlign:"left", fontWeight:700, fontSize:".68rem", letterSpacing:".08em", textTransform:"uppercase", color:"#64748B" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rTables.map(t => (
                            <tr key={t.id} style={{ borderBottom:"1px solid #F1F5F9" }}>
                              <td style={{ padding:".7rem 1rem", fontWeight:700 }}>{t.label}</td>
                              <td style={{ padding:".7rem 1rem", color:"#64748B" }}>{t.seats} nf</td>
                              <td style={{ padding:".7rem 1rem", color:"#64748B" }}>{t.zone||"—"}</td>
                              <td style={{ padding:".7rem 1rem", color:"#64748B" }}>{t.shape}</td>
                              <td style={{ padding:".7rem 1rem", color:"#94A3B8", fontSize:".78rem" }}>x:{t.x} y:{t.y}</td>
                              <td style={{ padding:".7rem 1rem" }}>
                                <div style={{ display:"flex", gap:".4rem" }}>
                                  <button onClick={() => editTbl(t)} style={{ background:"#EFF6FF", color:"#2563EB", border:"1px solid #BFDBFE", borderRadius:"6px", padding:".28rem .7rem", fontSize:".75rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>✏️</button>
                                  <button onClick={() => deleteTbl(t.id)} style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", borderRadius:"6px", padding:".28rem .7rem", fontSize:".75rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>🗑️</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ══ RƏYLƏR ══ */}
        {tab === "reviews" && (
          <>
            <div style={{ fontWeight:800, fontSize:"1.4rem", letterSpacing:"-.02em", marginBottom:"1.5rem" }}>Müştəri Rəyləri</div>
            {reviews.filter(r => adminUser.is_super || r.restaurant_name === myRests[0]?.name).length === 0 ? (
              <div style={{ ...card, textAlign:"center", padding:"3rem", color:"#94A3B8" }}>
                <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>⭐</div>
                <div style={{ fontWeight:600 }}>Hələ rəy yoxdur</div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1rem" }}>
                {reviews.filter(r => adminUser.is_super || r.restaurant_name === myRests[0]?.name).map(r => (
                  <div key={r.id} style={{ ...card }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:".8rem" }}>
                      <div>
                        <div style={{ fontWeight:700 }}>{r.customer_name||"Anonim"}</div>
                        <div style={{ fontSize:".72rem", color:"#94A3B8" }}>{r.restaurant_name}</div>
                      </div>
                      <div style={{ color:"#F59E0B", fontSize:"1rem" }}>{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</div>
                    </div>
                    {r.comment && <div style={{ fontSize:".85rem", color:"#475569", lineHeight:1.5, marginBottom:".8rem" }}>"{r.comment}"</div>}
                    <div style={{ fontSize:".7rem", color:"#94A3B8" }}>{new Date(r.created_at).toLocaleDateString("az-AZ")}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ ADMİNLƏR ══ */}
        {tab === "admins" && adminUser.is_super && <AdminUsers restaurants={restaurants} />}
      </main>
    </div>
  );
}

// ─── ADMİN İSTİFADƏÇİLƏR ────────────────────────────────────
function AdminUsers({ restaurants }) {
  const [admins, setAdmins] = useState([]);
  const [form, setForm]     = useState({ username:"", password_hash:"", display_name:"", restaurant_id:"", is_super:false, is_active:true });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = async () => { const { data } = await supabase.from("admin_users").select("*").order("created_at"); setAdmins(data||[]); };
  useEffect(() => { load(); }, []);

  const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"8px", padding:".6rem .9rem", fontSize:".9rem", outline:"none", fontFamily:"'Inter',system-ui,sans-serif" };
  const lbl = { fontSize:".65rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".3rem" };
  const card = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"12px", padding:"1.2rem" };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, restaurant_id: form.restaurant_id ? parseInt(form.restaurant_id) : null };
    if (editId) {
      if (!form.password_hash) delete payload.password_hash;
      await supabase.from("admin_users").update(payload).eq("id", editId);
    } else {
      await supabase.from("admin_users").insert(payload);
    }
    setSaving(false); setEditId(null);
    setForm({ username:"", password_hash:"", display_name:"", restaurant_id:"", is_super:false, is_active:true });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Bu admini silmək istəyirsiniz?")) return;
    await supabase.from("admin_users").delete().eq("id", id);
    load();
  };

  return (
    <>
      <div style={{ fontWeight:800, fontSize:"1.4rem", letterSpacing:"-.02em", marginBottom:"1.5rem" }}>Adminlər</div>
      <div style={{ ...card, marginBottom:"1.5rem" }}>
        <div style={{ fontWeight:700, fontSize:"1rem", marginBottom:"1.2rem" }}>{editId?"✏️ Redaktə et":"➕ Yeni admin"}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
          <div><label style={lbl}>İstifadəçi adı *</label><input value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} style={inp} placeholder="username"/></div>
          <div><label style={lbl}>{editId?"Yeni şifrə (boş = dəyişmə)":"Şifrə *"}</label><input type="password" value={form.password_hash} onChange={e=>setForm(p=>({...p,password_hash:e.target.value}))} style={inp} placeholder="••••••••"/></div>
          <div><label style={lbl}>Ad</label><input value={form.display_name} onChange={e=>setForm(p=>({...p,display_name:e.target.value}))} style={inp} placeholder="Ad Soyad"/></div>
          <div>
            <label style={lbl}>Restoran</label>
            <select value={form.restaurant_id} onChange={e=>setForm(p=>({...p,restaurant_id:e.target.value}))} style={{ ...inp, cursor:"pointer" }}>
              <option value="">Hamısı (super)</option>
              {restaurants.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Rol</label>
            <select value={form.is_super} onChange={e=>setForm(p=>({...p,is_super:e.target.value==="true"}))} style={{ ...inp, cursor:"pointer" }}>
              <option value="false">Restoran admini</option>
              <option value="true">Super admin</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Status</label>
            <select value={form.is_active} onChange={e=>setForm(p=>({...p,is_active:e.target.value==="true"}))} style={{ ...inp, cursor:"pointer" }}>
              <option value="true">Aktivdir</option>
              <option value="false">Deaktivdir</option>
            </select>
          </div>
        </div>
        <div style={{ display:"flex", gap:".7rem" }}>
          <button onClick={save} disabled={saving||!form.username}
            style={{ background:saving||!form.username?"#94A3B8":"#0F172A", color:"#fff", border:"none", borderRadius:"8px", padding:".7rem 1.5rem", fontFamily:"inherit", fontSize:".88rem", fontWeight:700, cursor:"pointer" }}>
            {saving?"⏳...":editId?"✓ Saxla":"➕ Əlavə et"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ username:"", password_hash:"", display_name:"", restaurant_id:"", is_super:false, is_active:true }); }}
              style={{ background:"#F1F5F9", color:"#64748B", border:"1px solid #E2E8F0", borderRadius:"8px", padding:".7rem 1.2rem", fontFamily:"inherit", fontSize:".88rem", cursor:"pointer" }}>İmtina</button>
          )}
        </div>
      </div>
      <div style={{ background:"#fff", borderRadius:"12px", border:"1px solid #E2E8F0", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".83rem" }}>
          <thead>
            <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
              {["İstifadəçi","Ad","Restoran","Rol","Status","Əməliyyat"].map(h=>(
                <th key={h} style={{ padding:".75rem 1rem", textAlign:"left", fontWeight:700, fontSize:".68rem", letterSpacing:".08em", textTransform:"uppercase", color:"#64748B" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} style={{ borderBottom:"1px solid #F1F5F9" }}>
                <td style={{ padding:".75rem 1rem", fontWeight:700 }}>{a.username}</td>
                <td style={{ padding:".75rem 1rem", color:"#64748B" }}>{a.display_name||"—"}</td>
                <td style={{ padding:".75rem 1rem", color:"#64748B" }}>{restaurants.find(r=>r.id===a.restaurant_id)?.name||"Hamısı"}</td>
                <td style={{ padding:".75rem 1rem" }}>
                  <span style={{ background:a.is_super?"#EFF6FF":"#F1F5F9", color:a.is_super?"#2563EB":"#64748B", borderRadius:"20px", padding:".15rem .6rem", fontSize:".65rem", fontWeight:700 }}>{a.is_super?"Super":"Restoran"}</span>
                </td>
                <td style={{ padding:".75rem 1rem" }}>
                  <span style={{ background:a.is_active?"#F0FDF4":"#FEF2F2", color:a.is_active?"#16A34A":"#DC2626", borderRadius:"20px", padding:".15rem .6rem", fontSize:".65rem", fontWeight:700 }}>{a.is_active?"Aktiv":"Deaktiv"}</span>
                </td>
                <td style={{ padding:".75rem 1rem" }}>
                  <div style={{ display:"flex", gap:".4rem" }}>
                    <button onClick={() => { setEditId(a.id); setForm({ username:a.username, password_hash:"", display_name:a.display_name||"", restaurant_id:a.restaurant_id||"", is_super:a.is_super, is_active:a.is_active }); window.scrollTo(0,0); }}
                      style={{ background:"#EFF6FF", color:"#2563EB", border:"1px solid #BFDBFE", borderRadius:"6px", padding:".28rem .7rem", fontSize:".75rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>✏️</button>
                    <button onClick={() => remove(a.id)}
                      style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", borderRadius:"6px", padding:".28rem .7rem", fontSize:".75rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── ROUTER ──────────────────────────────────────────────────
export default function App() {
  const path = window.location.pathname;
  if (path === "/review") return <ReviewPage />;
  if (path === "/admin")  return <AdminPanel />;
  return <MainApp />;
}

// ─── ƏSAS REZERVASIYA UYGULAMASI ─────────────────────────────
function MainApp() {
  const [step, setStep]                 = useState("home");
  const [restaurants, setRestaurants]   = useState([]);
  const [dbTables, setDbTables]         = useState([]);
  const [bookedLabels, setBookedLabels] = useState([]);
  const [slotCounts, setSlotCounts]     = useState({});
  const [loadingRests, setLoadingRests] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selRest, setSelRest]     = useState(null);
  const [selDate, setSelDate]     = useState("");
  const [selTime, setSelTime]     = useState("");
  const [selTable, setSelTable]   = useState(null);
  const [hoverTable, setHoverTable] = useState(null);

  const [cart, setCart]           = useState({});
  const [guests, setGuests]       = useState(2);
  const [custName, setCustName]   = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState("");

  const [cancelPhone, setCancelPhone]   = useState("");
  const [cancelList, setCancelList]     = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMsg, setCancelMsg]       = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    supabase.from("restaurants").select("*").order("name").then(({ data }) => {
      setRestaurants((data||[]).map(r => ({ ...r, priceRange:r.price_range||"₼₼", tags:Array.isArray(r.tags)?r.tags:[] })));
      setLoadingRests(false);
    });
  }, []);

  const loadTables = async (restId) => {
    const { data } = await supabase.from("tables").select("*").eq("restaurant_id", restId).order("label");
    setDbTables((data||[]).map(t => ({ ...t, desc:t.zone||"", img:t.img_url||"" })));
  };

  const loadSlotCounts = async (restName, date) => {
    if (!restName || !date) { setSlotCounts({}); return; }
    setLoadingSlots(true);
    const { data } = await supabase.from("reservations").select("time").eq("restaurant_name", restName).eq("date", date).neq("status","ləğv edildi");
    const counts = {};
    (data||[]).forEach(r => { counts[r.time] = (counts[r.time]||0) + 1; });
    setSlotCounts(counts); setLoadingSlots(false);
  };

  const loadBookedTables = async (restName, date, time) => {
    if (!restName||!date||!time) { setBookedLabels([]); return; }
    const { data } = await supabase.from("reservations").select("table_label").eq("restaurant_name",restName).eq("date",date).eq("time",time).neq("status","ləğv edildi");
    setBookedLabels((data||[]).map(r => r.table_label));
  };

  useEffect(() => {
    if (selRest && selDate) { loadSlotCounts(selRest.name, selDate); setSelTime(""); setSelTable(null); setBookedLabels([]); }
  }, [selDate, selRest]);

  useEffect(() => {
    if (selRest && selDate && selTime) { loadBookedTables(selRest.name, selDate, selTime); setSelTable(null); }
  }, [selTime]);

  const getSlotStatus = (time) => {
    const total = dbTables.length || 1;
    const booked = slotCounts[time] || 0;
    if (booked >= total) return "busy";
    if (booked >= Math.ceil(total * 0.6)) return "few";
    return "free";
  };

  const menuItems  = Array.isArray(selRest?.menu_items) ? selRest.menu_items : [];
  const categories = [...new Set(menuItems.map(i => i.cat))];
  const addItem    = (item) => setCart(p => ({ ...p, [item.id]:(p[item.id]||0)+1 }));
  const removeItem = (item) => setCart(p => { const n={...p}; if(n[item.id]>1)n[item.id]--; else delete n[item.id]; return n; });
  const cartTotal  = menuItems.reduce((s,i) => s+(cart[i.id]||0)*i.price, 0);
  const cartCount  = Object.values(cart).reduce((a,b) => a+b, 0);
  const preview    = hoverTable || selTable;
  const stepNum    = { home:0, datetime:1, table:2, menu:3, success:4 }[step] || 0;

  const reset = () => {
    setStep("home"); setSelRest(null); setSelDate(""); setSelTime("");
    setSelTable(null); setHoverTable(null); setCart({}); setGuests(2);
    setCustName(""); setCustPhone(""); setBookingCode(""); setSaveError("");
    setBookedLabels([]); setSlotCounts({});
  };

  const submitReservation = async () => {
    setSaving(true); setSaveError("");
    const preOrderItems = menuItems.filter(i=>cart[i.id]).map(i=>({ name:i.name, qty:cart[i.id], price:i.price }));
    const code = Math.random().toString(36).substr(2,8).toUpperCase();
    const { error } = await supabase.from("reservations").insert({
      name:custName, phone:custPhone, restaurant_name:selRest.name,
      date:selDate, time:selTime, guests, table_label:selTable.label, table_zone:selTable.zone||"",
      status:"gözlənilir", booking_code:code, pre_order_total:cartTotal, pre_order_items:preOrderItems,
    });
    setSaving(false);
    if (error) { setSaveError("Xəta baş verdi. Yenidən cəhd edin."); return; }
    setBookingCode(code); setStep("success");
  };

  const searchCancel = async () => {
    if (!cancelPhone.trim()) return;
    setCancelLoading(true); setCancelMsg(""); setCancelList(null);
    const { data, error } = await supabase.from("reservations").select("*").eq("phone",cancelPhone.trim()).neq("status","ləğv edildi").order("date",{ascending:true});
    setCancelLoading(false);
    if (error||!data||data.length===0) setCancelMsg("Bu nömrə ilə aktiv rezervasiya tapılmadı.");
    else setCancelList(data);
  };

  const doCancel = async (id) => {
    await supabase.from("reservations").update({ status:"ləğv edildi" }).eq("id", id);
    setCancelList(prev => prev ? prev.filter(r=>r.id!==id) : []);
    setCancelMsg("Rezervasiya ləğv edildi ✓");
  };

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

      {/* HEADER */}
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
            <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:"20px", padding:".35rem .9rem", fontSize:".82rem", fontWeight:600, color:"#2563EB" }}>🛒 {cartCount} · {cartTotal}₼</div>
          )}
          <button onClick={() => setStep(step==="cancel"?"home":"cancel")}
            style={{ background:step==="cancel"?"#F1F5F9":"none", border:"1px solid #E2E8F0", color:"#64748B", padding:".4rem .9rem", borderRadius:"8px", fontSize:".78rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            {step==="cancel"?"← Ana səhifə":"Rezervasiyanı ləğv et"}
          </button>
          <a href="/admin" style={{ background:"none", border:"1px solid #E2E8F0", color:"#94A3B8", padding:".4rem .9rem", borderRadius:"8px", fontSize:".72rem", fontWeight:500, textDecoration:"none" }}>Admin</a>
        </div>
      </header>

      {/* STEP BAR */}
      {!["home","success","cancel"].includes(step) && (
        <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", display:"flex", justifyContent:"center" }}>
          {["Restoran","Tarix & Saat","Masa","Menyu"].map((s,i) => {
            const done = stepNum>i+1, active = stepNum===i+1;
            return (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:".5rem", padding:".9rem 1.5rem", borderBottom:`2px solid ${done?"#2563EB":active?"#93C5FD":"transparent"}` }}>
                <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:done?"#2563EB":active?"#EFF6FF":"#F1F5F9", border:`1.5px solid ${done?"#2563EB":active?"#3B82F6":"#E2E8F0"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".6rem", fontWeight:700, color:done?"#fff":active?"#2563EB":"#94A3B8" }}>
                  {done?"✓":i+1}
                </div>
                <span style={{ fontSize:".72rem", fontWeight:600, letterSpacing:".05em", textTransform:"uppercase", color:done?"#2563EB":active?"#1E40AF":"#94A3B8" }}>{s}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* LƏĞVETMƏ */}
      {step === "cancel" && (
        <div style={{ maxWidth:"560px", margin:"0 auto", padding:"2rem" }}>
          <div style={{ fontWeight:800, fontSize:"1.5rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Rezervasiyanı ləğv et</div>
          <div style={{ fontSize:".8rem", color:"#94A3B8", marginBottom:"1.8rem" }}>Telefon nömrənizi daxil edin</div>
          <div style={{ display:"flex", gap:".7rem", marginBottom:"1.2rem" }}>
            <div style={{ ...box, flex:1 }}>
              <label style={lbl}>Telefon nömrəsi</label>
              <input value={cancelPhone} onChange={e=>setCancelPhone(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchCancel()} placeholder="+994 50 000 00 00" style={inp}/>
            </div>
            <button onClick={searchCancel} disabled={cancelLoading}
              style={{ background:"#0F172A", color:"#fff", border:"none", borderRadius:"10px", padding:"0 1.4rem", fontSize:".88rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
              {cancelLoading?"⏳":"Axtar"}
            </button>
          </div>
          {cancelMsg && (
            <div style={{ background:cancelMsg.includes("✓")?"#F0FDF4":"#FEF2F2", border:`1px solid ${cancelMsg.includes("✓")?"#86EFAC":"#FECACA"}`, borderRadius:"10px", padding:".85rem 1rem", marginBottom:"1rem", color:cancelMsg.includes("✓")?"#16A34A":"#DC2626", fontWeight:600, fontSize:".88rem" }}>
              {cancelMsg}
            </div>
          )}
          {cancelList && cancelList.length > 0 && (
            <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E2E8F0", overflow:"hidden" }}>
              <div style={{ padding:".9rem 1.2rem", borderBottom:"1px solid #F1F5F9", fontWeight:700, fontSize:".9rem" }}>Aktiv rezervasiyalar ({cancelList.length})</div>
              {cancelList.map(r => (
                <div key={r.id} style={{ padding:"1rem 1.2rem", borderBottom:"1px solid #F8FAFC", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem" }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:".9rem", marginBottom:".2rem" }}>{r.restaurant_name}</div>
                    <div style={{ fontSize:".75rem", color:"#64748B" }}>📅 {r.date} · ⏰ {r.time} · 🪑 {r.table_label} · 👥 {r.guests} nf</div>
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
        </div>
      )}

      {/* HOME */}
      {step === "home" && (
        <div>
          <div style={{ background:"#0F172A", color:"#fff", padding:"4rem 2rem 3.5rem", textAlign:"center" }}>
            <div style={{ display:"inline-block", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", borderRadius:"20px", padding:".35rem 1rem", fontSize:".7rem", letterSpacing:".15em", textTransform:"uppercase", color:"#94A3B8", marginBottom:"1.2rem" }}>Bakının ən yaxşı restoranları</div>
            <h1 style={{ fontSize:"clamp(2rem,5vw,3.8rem)", fontWeight:800, lineHeight:1.1, letterSpacing:"-.03em", marginBottom:"1rem" }}>
              Masanızı indi<br/><span style={{ color:"#60A5FA" }}>rezerv edin</span>
            </h1>
            <p style={{ color:"#94A3B8", fontSize:"1rem", maxWidth:"440px", margin:"0 auto", lineHeight:1.6 }}>Restoranı seçin, masanı rezerv edin, menyudan əvvəlcədən sifariş verin.</p>
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
                <a href="/admin" style={{ display:"inline-block", marginTop:"1rem", background:"#0F172A", color:"#fff", borderRadius:"10px", padding:".7rem 1.5rem", fontSize:".85rem", fontWeight:700, textDecoration:"none" }}>Admin Panelə keç →</a>
              </div>
            )}
            {restaurants.map(r => (
              <div key={r.id} className="card"
                style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", overflow:"hidden", cursor:r.available?"pointer":"default", opacity:r.available?1:0.5, boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}
                onClick={() => { if(!r.available) return; setSelRest(r); loadTables(r.id); setStep("datetime"); }}>
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
                  <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginBottom:".4rem" }}><span style={{ color:"#F59E0B" }}>★</span><span style={{ fontWeight:700, fontSize:".9rem" }}>{r.rating}</span></div>
                  <div style={{ fontSize:".76rem", color:"#64748B", marginBottom:"1rem" }}>📍 {r.location}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:".3rem", marginBottom:"1.1rem" }}>
                    {r.tags.map(t => <span key={t} style={{ fontSize:".65rem", padding:".2rem .55rem", borderRadius:"20px", background:`${r.accent||"#3B82F6"}10`, color:r.accent||"#3B82F6", border:`1px solid ${r.accent||"#3B82F6"}25`, fontWeight:500 }}>{t}</span>)}
                  </div>
                  {r.available && <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:".65rem", borderRadius:"8px", background:"#0F172A", color:"#fff", fontSize:".82rem", fontWeight:600 }}>Rezervasiya et →</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DATE & TIME */}
      {step === "datetime" && selRest && (
        <div style={{ maxWidth:"720px", margin:"0 auto", padding:"2rem" }}>
          <button onClick={() => setStep("home")} style={back}>← Geri</button>
          <div style={{ display:"flex", alignItems:"center", gap:".9rem", ...box, marginBottom:"1.8rem" }}>
            <div style={{ width:"42px", height:"42px", borderRadius:"10px", background:`${selRest.accent||"#3B82F6"}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0 }}>{selRest.emoji||"🍽️"}</div>
            <div><div style={{ fontWeight:700, fontSize:"1rem" }}>{selRest.name}</div><div style={{ fontSize:".72rem", color:"#94A3B8" }}>{selRest.cuisine} · {selRest.location}</div></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <div style={box}><label style={lbl}>Ad Soyad *</label><input value={custName} onChange={e=>setCustName(e.target.value)} placeholder="Əli Həsənov" style={inp}/></div>
            <div style={box}><label style={lbl}>Telefon *</label><input type="tel" value={custPhone} onChange={e=>setCustPhone(e.target.value)} placeholder="+994 50 000 00 00" style={inp}/></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.5rem" }}>
            <div style={box}><label style={lbl}>Tarix seçin *</label><input type="date" min={today} value={selDate} onChange={e=>setSelDate(e.target.value)} style={{ ...inp, cursor:"pointer" }}/></div>
            <div style={box}><label style={lbl}>Qonaq sayı</label><select value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{ ...inp, cursor:"pointer" }}>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} nəfər</option>)}</select></div>
          </div>
          <div style={{ ...box, padding:"1.2rem", marginBottom:"1.8rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <label style={{ ...lbl, marginBottom:0 }}>Saat seçin *</label>
              <div style={{ display:"flex", gap:".9rem" }}>
                {[{c:"#22C55E",l:"Boş"},{c:"#F59E0B",l:"Az yer"},{c:"#EF4444",l:"Dolu"}].map(s=>(
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
                  const sel = selTime===time, busy = status==="busy";
                  const dot = status==="free"?"#22C55E":status==="few"?"#F59E0B":"#EF4444";
                  return (
                    <button key={time} disabled={busy} onClick={() => !busy&&setSelTime(time)}
                      style={{ padding:".6rem .9rem", minWidth:"72px", background:sel?"#0F172A":busy?"#F8FAFC":"#fff", border:`1.5px solid ${sel?"#0F172A":"#E2E8F0"}`, color:sel?"#fff":busy?"#CBD5E1":"#0F172A", cursor:busy?"not-allowed":"pointer", fontFamily:"inherit", fontSize:".88rem", fontWeight:sel?700:500, borderRadius:"8px", display:"flex", flexDirection:"column", alignItems:"center", gap:".22rem" }}>
                      <span>{time}</span>
                      <span style={{ display:"flex", alignItems:"center", gap:".2rem", fontSize:".52rem", color:sel?"rgba(255,255,255,.7)":dot }}>
                        <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:sel?"rgba(255,255,255,.6)":dot, display:"inline-block" }}/>
                        {status==="free"?"Boş":status==="few"?"Az yer":"Dolu"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button className="btnp" onClick={() => setStep("table")} disabled={!selDate||!selTime||!custName||!custPhone}
            style={{ background:selDate&&selTime&&custName&&custPhone?"#0F172A":"#E2E8F0", color:selDate&&selTime&&custName&&custPhone?"#fff":"#94A3B8", border:"none", padding:".9rem 2rem", fontFamily:"inherit", fontSize:".95rem", fontWeight:700, cursor:selDate&&selTime&&custName&&custPhone?"pointer":"not-allowed", borderRadius:"10px" }}>
            Masa Seç →
          </button>
        </div>
      )}

      {/* TABLE */}
      {step === "table" && selRest && (
        <div style={{ maxWidth:"880px", margin:"0 auto", padding:"2rem" }}>
          <button onClick={() => setStep("datetime")} style={back}>← Geri</button>
          <div style={{ fontWeight:800, fontSize:"1.5rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Masanı seçin</div>
          <div style={{ fontSize:".75rem", color:"#94A3B8", marginBottom:"1.2rem" }}>{selRest.name} · {selDate} · {selTime} · {guests} nəfər</div>
          {dbTables.length===0 ? (
            <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E2E8F0", padding:"3rem", textAlign:"center", color:"#94A3B8" }}>
              <div style={{ fontSize:"2rem", marginBottom:".7rem" }}>🪑</div>
              <div style={{ fontWeight:600 }}>Bu restoran üçün masa əlavə edilməyib</div>
            </div>
          ) : (
            <>
              <div style={{ display:"flex", gap:"1.2rem", marginBottom:"1rem" }}>
                {[{bg:"#F1F5F9",bc:"#CBD5E1",l:"Boş"},{bg:"#EFF6FF",bc:"#3B82F6",l:"Seçilmiş"},{bg:"#FEE2E2",bc:"#FCA5A5",l:"Tutulmuş"}].map(s=>(
                  <span key={s.l} style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".7rem", color:"#64748B", fontWeight:500 }}>
                    <span style={{ width:"13px", height:"13px", background:s.bg, border:`1.5px solid ${s.bc}`, display:"inline-block", borderRadius:"3px" }}/>{s.l}
                  </span>
                ))}
              </div>
              <div style={{ position:"relative", width:"100%", paddingBottom:"50%", background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", overflow:"hidden", marginBottom:"1.2rem" }}>
                <div style={{ position:"absolute", inset:0 }}>
                  <div style={{ position:"absolute", right:"2.5%", top:"5%", width:"13%", height:"88%", background:"#F8FAFC", border:"1.5px dashed #E2E8F0", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".5rem", letterSpacing:".12em", color:"#94A3B8", textTransform:"uppercase", writingMode:"vertical-rl" }}>Mətbəx</div>
                  <div style={{ position:"absolute", left:"3.5%", bottom:"2.5%", width:"9%", height:"9%", background:"#F8FAFC", border:"1px dashed #CBD5E1", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".48rem", color:"#94A3B8" }}>Giriş</div>
                  {dbTables.map(t => {
                    const isBooked=bookedLabels.includes(t.label), isSelected=selTable?.id===t.id, isHovered=hoverTable?.id===t.id;
                    return (
                      <div key={t.id} className="tsvg"
                        style={{ position:"absolute", left:`${t.x||10}%`, top:`${t.y||10}%`, transform:"translate(-50%,-50%)", cursor:isBooked?"not-allowed":"pointer", opacity:isBooked?0.55:1, filter:isSelected?"drop-shadow(0 2px 8px rgba(37,99,235,.25))":isHovered?"drop-shadow(0 2px 6px rgba(0,0,0,.1))":"none" }}
                        onClick={() => !isBooked&&setSelTable(isSelected?null:t)}
                        onMouseEnter={() => setHoverTable(t)} onMouseLeave={() => setHoverTable(null)}>
                        <TableSVG shape={t.shape||"rect"} label={t.label} seats={t.seats} isBooked={isBooked} isSelected={isSelected} isHovered={isHovered&&!isBooked}/>
                      </div>
                    );
                  })}
                </div>
              </div>
              {preview && (
                <div style={{ display:"grid", gridTemplateColumns:preview.img?"180px 1fr":"1fr", overflow:"hidden", background:"#fff", border:`1.5px solid ${selTable?.id===preview.id?"#3B82F6":"#E2E8F0"}`, borderRadius:"12px", marginBottom:"1.2rem" }}>
                  {preview.img && <img src={preview.img} alt={preview.label} style={{ width:"100%", height:"145px", objectFit:"cover", display:"block" }} onError={e=>{e.target.style.display="none";}}/>}
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
                      <button className="btnp" onClick={() => setSelTable(selTable?.id===preview.id?null:preview)}
                        style={{ background:selTable?.id===preview.id?"#16A34A":"#0F172A", color:"#fff", border:"none", padding:".55rem 1rem", fontFamily:"inherit", fontSize:".76rem", fontWeight:700, cursor:"pointer", borderRadius:"8px", width:"fit-content", marginTop:".7rem" }}>
                        {selTable?.id===preview.id?"✓ Seçildi":"Bu masanı seç"}
                      </button>
                    )}
                  </div>
                </div>
              )}
              <button className="btnp" onClick={() => setStep("menu")} disabled={!selTable}
                style={{ background:selTable?"#0F172A":"#E2E8F0", color:selTable?"#fff":"#94A3B8", border:"none", padding:".9rem 2rem", fontFamily:"inherit", fontSize:".95rem", fontWeight:700, cursor:selTable?"pointer":"not-allowed", borderRadius:"10px" }}>
                Davam et →
              </button>
            </>
          )}
        </div>
      )}

      {/* MENU */}
      {step === "menu" && selRest && selTable && (
        <div style={{ maxWidth:"720px", margin:"0 auto", padding:"2rem" }}>
          <button onClick={() => setStep("table")} style={back}>← Geri</button>
          <div style={{ fontWeight:800, fontSize:"1.5rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Əvvəlcədən sifariş</div>
          <div style={{ fontSize:".75rem", color:"#94A3B8", marginBottom:"1.8rem" }}>Gəlincə hazır olsun (istəyə görə)</div>
          {menuItems.length===0 ? (
            <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", textAlign:"center", padding:"2rem", marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"1.5rem", marginBottom:".5rem" }}>🍽️</div>
              <div style={{ color:"#94A3B8" }}>Bu restoran üçün menyu əlavə edilməyib</div>
            </div>
          ) : (
            <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", overflow:"hidden", marginBottom:"1.5rem" }}>
              {categories.map((cat,ci) => (
                <div key={cat}>
                  {ci>0 && <div style={{ height:"1px", background:"#F1F5F9" }}/>}
                  <div style={{ padding:".7rem 1.2rem", background:"#F8FAFC", fontSize:".62rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"#94A3B8" }}>{cat}</div>
                  {menuItems.filter(i=>i.cat===cat).map((item,idx,arr) => (
                    <div key={item.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".9rem 1.2rem", borderBottom:idx<arr.length-1?"1px solid #F1F5F9":"none", background:cart[item.id]?"#F0F9FF":"#fff" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
                        <span style={{ fontSize:"1.3rem" }}>{item.emoji||"🍽️"}</span>
                        <div><div style={{ fontWeight:600, fontSize:".92rem" }}>{item.name}</div><div style={{ fontSize:".72rem", color:"#94A3B8" }}>{item.desc}</div></div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
                        <span style={{ fontWeight:700, fontSize:".9rem" }}>{item.price}₼</span>
                        <div style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                          <button onClick={()=>removeItem(item)} style={{ width:"28px", height:"28px", background:"#F1F5F9", border:"1px solid #E2E8F0", color:"#475569", cursor:"pointer", borderRadius:"7px", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                          <span style={{ minWidth:"20px", textAlign:"center", fontWeight:700, fontSize:".9rem", color:cart[item.id]?"#2563EB":"#CBD5E1" }}>{cart[item.id]||0}</span>
                          <button onClick={()=>addItem(item)} style={{ width:"28px", height:"28px", background:"#EFF6FF", border:"1px solid #BFDBFE", color:"#2563EB", cursor:"pointer", borderRadius:"7px", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"10px", padding:"1.2rem", marginBottom:"1.5rem" }}>
            <div style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"#94A3B8", marginBottom:".9rem" }}>Rezervasiya xülasəsi</div>
            <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:".4rem 1rem", fontSize:".875rem" }}>
              {[["Ad",custName],["Telefon",custPhone],["Restoran",selRest.name],["Tarix",selDate],["Saat",selTime],["Masa",`${selTable.label} (${selTable.seats} nf)`],["Qonaqlar",`${guests} nəfər`]].map(([k,v]) => (
                <Fragment key={k}><span style={{ color:"#94A3B8" }}>{k}:</span><span style={{ fontWeight:600 }}>{v}</span></Fragment>
              ))}
              {cartCount>0 && <Fragment><span style={{ color:"#94A3B8" }}>Ön sifariş:</span><span style={{ fontWeight:700, color:"#2563EB" }}>{cartTotal}₼</span></Fragment>}
            </div>
          </div>
          {saveError && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:".75rem 1rem", marginBottom:"1rem", color:"#DC2626", fontSize:".85rem" }}>{saveError}</div>}
          <div style={{ display:"flex", gap:".8rem", flexWrap:"wrap" }}>
            <button className="btnp" onClick={submitReservation} disabled={saving}
              style={{ background:saving?"#94A3B8":"#0F172A", color:"#fff", border:"none", padding:".9rem 1.8rem", fontFamily:"inherit", fontSize:".92rem", fontWeight:700, cursor:saving?"not-allowed":"pointer", borderRadius:"10px" }}>
              {saving?"⏳ Göndərilir...":"✓ Rezervasiyanı Tamamla"}
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

      {/* SUCCESS */}
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
              {[["Ad",custName],["Telefon",custPhone],["Restoran",selRest?.name],["Tarix",selDate],["Saat",selTime],["Masa",selTable?.label],["Qonaqlar",`${guests} nəfər`]].map(([k,v]) => (
                <Fragment key={k}><span style={{ color:"#94A3B8" }}>{k}:</span><span style={{ fontWeight:600 }}>{v}</span></Fragment>
              ))}
              {cartTotal>0 && <Fragment><span style={{ color:"#94A3B8" }}>Ön sifariş:</span><span style={{ fontWeight:700, color:"#2563EB" }}>{cartTotal}₼</span></Fragment>}
            </div>
          </div>
          <a href={"/review?code="+bookingCode}
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
