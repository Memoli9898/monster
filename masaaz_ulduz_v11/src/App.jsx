import { useState, useEffect, useCallback, useRef, useMemo, Fragment, Component } from "react";
import { createClient } from "@supabase/supabase-js";


// ══════════════════════════════════════════════
// GREEN-API WhatsApp  (green-api.com — pulsuz)
// Ayarları admin paneldən daxil edin
// ══════════════════════════════════════════════
function getWACreds(){
  return {
    inst: localStorage.getItem("wa_instance")||"",
    tok:  localStorage.getItem("wa_token")||"",
  };
}
async function sendWA(phone, message){
  const {inst,tok}=getWACreds();
  if(!inst||!tok) return;
  try{
    let num=(phone||"").replace(/[\s\-\(\)]/g,"");
    if(num.startsWith("+"))  num=num.slice(1);
    if(num.startsWith("0"))  num="994"+num.slice(1);
    if(!num.startsWith("994")) num="994"+num;
    await fetch(
      `https://api.green-api.com/waInstance${inst}/sendMessage/${tok}`,
      {method:"POST",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({chatId:num+"@c.us",message})}
    );
  }catch(e){console.warn("WA xəta:",e.message);}
}

const SUPABASE_URL = "https://jhyaiuvubbrtngvyoyhi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoeWFpdXZ1YmJydG5ndnlveWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTg2NTIsImV4cCI6MjA4NzI3NDY1Mn0.UGZhj0rdN9lh7tLnEP1mzFBXlbxFrxWIi7kYUv7_-J0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ALL_SLOTS = ["12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

// ─── ERROR BOUNDARY ─── ağ ekranı əngəlləyir ──────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div style={{ fontFamily:"system-ui", padding:"3rem", textAlign:"center", color:"#DC2626" }}>
        <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>⚠️</div>
        <div style={{ fontWeight:700, marginBottom:"1rem" }}>Xəta baş verdi</div>
        <pre style={{ background:"#FEF2F2", padding:"1rem", borderRadius:"8px", textAlign:"left", fontSize:".78rem", overflow:"auto", maxWidth:"600px", margin:"0 auto 1rem" }}>
          {this.state.error.toString()}
        </pre>
        <button onClick={() => this.setState({ error: null })}
          style={{ background:"#12487a", color:"#fff", border:"none", borderRadius:"8px", padding:".7rem 1.5rem", cursor:"pointer", fontFamily:"inherit", fontSize:".9rem", fontWeight:700 }}>
          Yenidən cəhd et
        </button>
      </div>
    );
    return this.props.children;
  }
}

// ─── TableSVG ────────────────────────────────────────────────
function TableSVG({ shape, label, seats, isBooked, isSelected, isHovered }) {
  const tf = isBooked?"#FEE2E2":isSelected?"#e8f2fb":isHovered?"#F8FAFC":"#F1F5F9";
  const tb = isBooked?"#FCA5A5":isSelected?"#12487a":isHovered?"#94A3B8":"#CBD5E1";
  const cf = isBooked?"#FECACA":isSelected?"#a8cce0":"#E2E8F0";
  const cb = isBooked?"#FCA5A5":isSelected?"#90bfda":"#CBD5E1";
  const lc = isBooked?"#DC2626":isSelected?"#1a5c8a":"#475569";
  const sc = isBooked?"#EF4444":isSelected?"#12487a":"#94A3B8";
  if (shape==="round") return (
    <svg width="68" height="76" viewBox="0 0 68 76" style={{display:"block"}}>
      <rect x="16" y="1" width="36" height="14" rx="7" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="16" y="61" width="36" height="14" rx="7" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <circle cx="34" cy="38" r="22" fill={tf} stroke={tb} strokeWidth="1.5"/>
      <text x="34" y="35" textAnchor="middle" fill={lc} fontSize="9" fontWeight="700" fontFamily="system-ui">{label}</text>
      <text x="34" y="46" textAnchor="middle" fill={sc} fontSize="6.5" fontFamily="system-ui">{seats}nf</text>
    </svg>
  );
  if (shape==="rect6") return (
    <svg width="114" height="82" viewBox="0 0 114 82" style={{display:"block"}}>
      {[4,45,86].map((x,i)=><rect key={i} x={x} y="1" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>)}
      {[4,45,86].map((x,i)=><rect key={i} x={x} y="68" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>)}
      <rect x="3" y="16" width="108" height="50" rx="8" fill={tf} stroke={tb} strokeWidth="1.5"/>
      <text x="57" y="39" textAnchor="middle" fill={lc} fontSize="9.5" fontWeight="700" fontFamily="system-ui">{label}</text>
      <text x="57" y="51" textAnchor="middle" fill={sc} fontSize="7" fontFamily="system-ui">{seats} nf</text>
    </svg>
  );
  if (shape==="vip") return (
    <svg width="150" height="88" viewBox="0 0 150 88" style={{display:"block"}}>
      {[4,43,82,121].map((x,i)=><rect key={i} x={x} y="1" width="24" height="13" rx="6.5" fill={isSelected?"#FEF9C3":"#FEF3C7"} stroke={isSelected?"#FCD34D":"#FDE68A"} strokeWidth="1.2"/>)}
      {[4,43,82,121].map((x,i)=><rect key={i} x={x} y="74" width="24" height="13" rx="6.5" fill={isSelected?"#FEF9C3":"#FEF3C7"} stroke={isSelected?"#FCD34D":"#FDE68A"} strokeWidth="1.2"/>)}
      <rect x="3" y="16" width="144" height="56" rx="10" fill={isSelected?"#FFFBEB":"#FFFDF5"} stroke={isSelected?"#F59E0B":"#FDE68A"} strokeWidth="1.5"/>
      <rect x="40" y="27" width="70" height="20" rx="10" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1"/>
      <text x="75" y="41" textAnchor="middle" fill="#92400E" fontSize="9" fontWeight="800" fontFamily="system-ui" letterSpacing="2">VIP</text>
      <text x="75" y="58" textAnchor="middle" fill="#A16207" fontSize="7" fontFamily="system-ui">{seats} nf</text>
    </svg>
  );
  // default rect
  return (
    <svg width="96" height="82" viewBox="0 0 96 82" style={{display:"block"}}>
      <rect x="5" y="1" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="67" y="1" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="5" y="68" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="67" y="68" width="24" height="13" rx="6.5" fill={cf} stroke={cb} strokeWidth="1.2"/>
      <rect x="3" y="16" width="90" height="50" rx="8" fill={tf} stroke={tb} strokeWidth="1.5"/>
      <text x="48" y="39" textAnchor="middle" fill={lc} fontSize="9.5" fontWeight="700" fontFamily="system-ui">{label}</text>
      <text x="48" y="51" textAnchor="middle" fill={sc} fontSize="7" fontFamily="system-ui">{seats} nf</text>
    </svg>
  );
}


// ════════════════════════════════════════════════════════════
// 🚫 LƏĞV SƏHİFƏSİ  →  /cancel
// ════════════════════════════════════════════════════════════
function CancelPage({ navigate }) {
  const [phone, setPhone]   = useState("");
  const [list,  setList]    = useState(null);
  const [loading, setLoad]  = useState(false);
  const [msg, setMsg]       = useState("");

  const search = async () => {
    if (!phone.trim()) return;
    setLoad(true); setMsg(""); setList(null);
    const { data, error } = await supabase
      .from("reservations").select("*")
      .eq("phone", phone.trim())
      .neq("status", "ləğv edildi")
      .order("date", { ascending: true });
    setLoad(false);
    if (error || !data || data.length === 0)
      setMsg("Bu nömrə ilə aktiv rezervasiya tapılmadı.");
    else setList(data);
  };

  const cancel = async (id) => {
    await supabase.from("reservations").update({ status: "ləğv edildi" }).eq("id", id);
    setList(p => p ? p.filter(r => r.id !== id) : []);
    setMsg("Rezervasiya ləğv edildi ✓");
  };

  const inp = { width:"100%", border:"none", background:"transparent", fontSize:".95rem", color:"#12487a", outline:"none" };
  const box = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"10px", padding:".9rem 1rem", boxShadow:"0 1px 3px rgba(0,0,0,.04)" };
  const lbl = { fontSize:".65rem", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:"#94A3B8", marginBottom:".4rem", display:"block" };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#eef3f8", minHeight:"100vh" }}>
      <header style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
        <div onClick={() => navigate("/")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:".6rem" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"#12487a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>🍽️</div>
          <div style={{ fontWeight:800, fontSize:"1.05rem" }}>MasaAz</div>
        </div>
        <button onClick={() => navigate("/")} style={{ background:"none", border:"1px solid #E2E8F0", color:"#64748B", padding:".4rem .9rem", borderRadius:"8px", fontSize:".78rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>← Ana səhifə</button>
      </header>
      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"2rem" }}>
        <div style={{ fontWeight:800, fontSize:"1.5rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Rezervasiyanı ləğv et</div>
        <div style={{ fontSize:".8rem", color:"#94A3B8", marginBottom:"1.8rem" }}>Telefon nömrənizi daxil edin</div>
        <div style={{ display:"flex", gap:".7rem", marginBottom:"1.2rem" }}>
          <div style={{ ...box, flex:1 }}>
            <label style={lbl}>Telefon nömrəsi</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="+994 50 000 00 00" style={inp}/>
          </div>
          <button onClick={search} disabled={loading} style={{ background:"#12487a", color:"#fff", border:"none", borderRadius:"10px", padding:"0 1.4rem", fontSize:".88rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
            {loading ? "⏳" : "Axtar"}
          </button>
        </div>
        {msg && <div style={{ background:msg.includes("✓")?"#F0FDF4":"#FEF2F2", border:`1px solid ${msg.includes("✓")?"#86EFAC":"#FECACA"}`, borderRadius:"10px", padding:".85rem 1rem", marginBottom:"1rem", color:msg.includes("✓")?"#16A34A":"#DC2626", fontWeight:600, fontSize:".88rem" }}>{msg}</div>}
        {list && list.length > 0 && (
          <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E2E8F0", overflow:"hidden" }}>
            <div style={{ padding:".9rem 1.2rem", borderBottom:"1px solid #F1F5F9", fontWeight:700, fontSize:".9rem" }}>Aktiv rezervasiyalar ({list.length})</div>
            {list.map(r => (
              <div key={r.id} style={{ padding:"1rem 1.2rem", borderBottom:"1px solid #F8FAFC", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:".9rem", marginBottom:".2rem" }}>{r.restaurant_name}</div>
                  <div style={{ fontSize:".75rem", color:"#64748B" }}>📅 {r.date} · ⏰ {r.time} · 🪑 {r.table_label} · 👥 {r.guests} nf</div>
                  {r.booking_code && <div style={{ fontSize:".68rem", color:"#12487a", marginTop:".1rem" }}>Kod: #{r.booking_code}</div>}
                </div>
                <button onClick={() => cancel(r.id)} style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", borderRadius:"8px", padding:".5rem .9rem", fontSize:".78rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>Ləğv et</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RƏYLƏR SƏHİFƏSİ ────────────────────────────────────────
function ReviewPage() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code") || "";
  const [stars,setStars]=useState(0); const [hov,setHov]=useState(0);
  const [comment,setComment]=useState(""); const [custNm,setCustNm]=useState("");
  const [sending,setSending]=useState(false); const [done,setDone]=useState(false);
  const [resv,setResv]=useState(null); const [err,setErr]=useState("");
  useEffect(()=>{ if(!code)return; supabase.from("reservations").select("*").eq("booking_code",code).maybeSingle().then(({data})=>{if(data)setResv(data);}); },[code]);
  const submit=async()=>{
    if(!stars){setErr("Zəhmət olmasa ulduz seçin");return;}
    setSending(true);
    await supabase.from("reviews").insert({ booking_code:code, customer_name:resv?resv.name:custNm, restaurant_name:resv?resv.restaurant_name:"", stars, comment:comment.trim()||null });
    setSending(false); setDone(true);
  };
  const f={fontFamily:"'Inter',system-ui,sans-serif"};
  if(done) return (
    <div style={{...f,minHeight:"100vh",background:"#eef3f8",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",padding:"3rem"}}>
        <div style={{fontSize:"4rem",marginBottom:"1rem"}}>🎉</div>
        <div style={{fontSize:"1.6rem",fontWeight:800,color:"#12487a",marginBottom:".5rem"}}>Təşəkkür edirik!</div>
        <div style={{color:"#64748B"}}>Rəyiniz qeyd edildi.</div>
        <button onClick={()=>window.location.href="/"} style={{marginTop:"1.5rem",background:"#12487a",color:"#fff",border:"none",borderRadius:"10px",padding:".8rem 2rem",fontFamily:"inherit",fontSize:".9rem",fontWeight:700,cursor:"pointer"}}>Ana Səhifə</button>
      </div>
    </div>
  );
  return (
    <div style={{...f,minHeight:"100vh",background:"linear-gradient(135deg,#F8FAFC,#e8f2fb)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <div style={{background:"#fff",borderRadius:"20px",border:"1px solid #E2E8F0",padding:"2.5rem",maxWidth:"440px",width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,.08)"}}>
        <div style={{textAlign:"center",marginBottom:"1.8rem"}}>
          <div style={{fontSize:"2.8rem",marginBottom:".5rem"}}>⭐</div>
          <div style={{fontSize:"1.4rem",fontWeight:800,color:"#12487a"}}>Rəyinizi bildirin</div>
          {resv?<div style={{fontSize:".82rem",color:"#64748B",marginTop:".4rem"}}>{resv.restaurant_name} · {resv.date} · {resv.time}</div>:<div style={{fontSize:".75rem",color:"#94A3B8",marginTop:".3rem"}}>Kod: #{code}</div>}
        </div>
        {!resv&&<div style={{marginBottom:"1rem"}}><label style={{fontSize:".68rem",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:".3rem"}}>Adınız</label><input value={custNm} onChange={e=>setCustNm(e.target.value)} placeholder="Əli Həsənov" style={{width:"100%",border:"1px solid #E2E8F0",borderRadius:"8px",padding:".6rem .9rem",fontSize:".9rem",outline:"none",fontFamily:"inherit"}}/></div>}
        <div style={{marginBottom:"1.5rem"}}>
          <div style={{display:"flex",justifyContent:"center",gap:".4rem"}}>
            {[1,2,3,4,5].map(s=><button key={s} onClick={()=>setStars(s)} onMouseEnter={()=>setHov(s)} onMouseLeave={()=>setHov(0)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"2.8rem",color:(hov||stars)>=s?"#F59E0B":"#E2E8F0",transition:"all .1s",transform:(hov||stars)>=s?"scale(1.2)":"scale(1)",padding:"0"}}>★</button>)}
          </div>
          {stars>0&&<div style={{textAlign:"center",fontSize:".88rem",color:"#64748B",marginTop:".6rem",fontWeight:500}}>{["","😞 Pis","😐 Orta","🙂 Yaxşı","😊 Çox yaxşı","🤩 Əla!"][stars]}</div>}
        </div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} placeholder="Restoran, xidmət haqqında..." style={{width:"100%",border:"1px solid #E2E8F0",borderRadius:"10px",padding:".7rem .9rem",fontSize:".88rem",outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.5,marginBottom:"1rem"}}/>
        {err&&<div style={{color:"#DC2626",fontSize:".82rem",marginBottom:".8rem",textAlign:"center"}}>{err}</div>}
        <button onClick={submit} disabled={sending} style={{width:"100%",background:sending?"#94A3B8":"#12487a",color:"#fff",border:"none",borderRadius:"10px",padding:".9rem",fontFamily:"inherit",fontSize:".95rem",fontWeight:700,cursor:sending?"not-allowed":"pointer"}}>
          {sending?"⏳ Göndərilir...":"✓ Rəyi Göndər"}
        </button>
      </div>
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────
const S = {
  inp:  { width:"100%", border:"1px solid #E2E8F0", borderRadius:"8px", padding:".65rem .9rem", fontSize:".9rem", outline:"none", fontFamily:"'Inter',system-ui,sans-serif" },
  lbl:  { fontSize:".65rem", fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:".35rem" },
  card: { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"12px", padding:"1.2rem" },
  btn:  (color="#12487a") => ({ background:color, color:"#fff", border:"none", borderRadius:"8px", padding:".65rem 1.3rem", fontFamily:"'Inter',system-ui,sans-serif", fontSize:".88rem", fontWeight:700, cursor:"pointer" }),
  badge:(bg,c)=>({ background:bg, color:c, borderRadius:"20px", padding:".15rem .6rem", fontSize:".68rem", fontWeight:700, whiteSpace:"nowrap" }),
};

// ─── ADMİN LOGIN ─────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [user,setUser]=useState(""); const [pass,setPass]=useState("");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);

  const doLogin = async () => {
    if(!user||!pass){setErr("Bütün sahələri doldurun");return;}
    setLoading(true); setErr("");
    try {
      // SHA-256 hash
      const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pass.trim()));
      const hashed=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
      const {data,error} = await supabase
        .from("admin_users").select("*")
        .eq("username",user.trim())
        .eq("is_active",true)
        .maybeSingle();
      if(error) throw error;
      if(!data){setErr("İstifadəçi adı və ya şifrə yanlışdır");setLoading(false);return;}
      // Hash müqayisəsi (köhnə plain text dəstəyi)
      const match = data.password_hash===hashed || data.password_hash===pass.trim();
      if(!match){setErr("İstifadəçi adı və ya şifrə yanlışdır");setLoading(false);return;}
      // Köhnə şifrəni avtomatik hash-lə
      if(data.password_hash===pass.trim()){
        await supabase.from("admin_users").update({password_hash:hashed}).eq("id",data.id);
      }
      onLogin(data);
    } catch(e) {
      setErr("Xəta: "+e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",minHeight:"100vh",background:"#12487a",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <div style={{background:"#fff",borderRadius:"20px",padding:"2.5rem",maxWidth:"380px",width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{width:"52px",height:"52px",borderRadius:"14px",background:"#12487a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",margin:"0 auto .8rem"}}>🍽️</div>
          <div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-.02em"}}>MasaAz Admin</div>
          <div style={{fontSize:".8rem",color:"#94A3B8",marginTop:".3rem"}}>İdarəetmə panelinə daxil olun</div>
        </div>
        <div style={{marginBottom:"1rem"}}>
          <label style={S.lbl}>İstifadəçi adı</label>
          <input value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="admin" autoFocus style={S.inp}/>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={S.lbl}>Şifrə</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="••••••••" style={S.inp}/>
        </div>
        {err&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",padding:".6rem .9rem",marginBottom:"1rem",color:"#DC2626",fontSize:".85rem",fontWeight:500}}>{err}</div>}
        <button onClick={doLogin} disabled={loading} style={{...S.btn(),width:"100%",padding:".9rem",fontSize:".95rem",background:loading?"#94A3B8":"#12487a",cursor:loading?"not-allowed":"pointer"}}>
          {loading?"⏳ Yoxlanılır...":"Daxil ol →"}
        </button>
        <div style={{textAlign:"center",marginTop:"1.2rem"}}>
          <a href="/" style={{fontSize:".8rem",color:"#94A3B8",textDecoration:"none"}}>← Ana səhifəyə qayıt</a>
        </div>
      </div>
    </div>
  );
}

// ─── ADMİN PANEL (router) ────────────────────────────────────
function AdminPanel() {
  const [adminUser, setAdminUser] = useState(null);
  if (!adminUser) return <AdminLogin onLogin={setAdminUser} />;
  return (
    <ErrorBoundary>
      <AdminDashboard adminUser={adminUser} onLogout={() => setAdminUser(null)} />
    </ErrorBoundary>
  );
}

// ─── ADMİN DASHBOARD ─────────────────────────────────────────
function AdminDashboard({ adminUser, onLogout }) {
  const [tab,setTab]         = useState("reservations");
  const [reservations,setRes]= useState([]);
  const [restaurants,setRst] = useState([]);
  const [tables,setTbl]      = useState([]);
  const [reviews,setRev]     = useState([]);
  const [loading,setLoad]    = useState(true);
  const [fStatus,setFS]      = useState("all");
  const [fRest,setFR]        = useState("all");
  const [search,setSrch]     = useState("");

  const load = async () => {
    setLoad(true);
    try {
      const [r1,r2,r3,r4] = await Promise.all([
        supabase.from("reservations").select("*").order("created_at",{ascending:false}),
        supabase.from("restaurants").select("*").order("name"),
        supabase.from("tables").select("*").order("label"),
        supabase.from("reviews").select("*").order("created_at",{ascending:false}),
      ]);
      setRes(r1.data||[]); setRst(r2.data||[]); setTbl(r3.data||[]); setRev(r4.data||[]);
    } catch(e) { console.error("Load error:", e); }
    setLoad(false);
  };
  useEffect(()=>{ load(); },[]);

  const isSuper = adminUser.is_super === true;
  const myRests = isSuper ? restaurants : restaurants.filter(r=>r.id===adminUser.restaurant_id);

  const filteredRes = reservations.filter(r=>{
    if(!isSuper && r.restaurant_name !== (myRests[0]?.name||"")) return false;
    if(fStatus!=="all" && r.status!==fStatus) return false;
    if(fRest!=="all" && r.restaurant_name!==fRest) return false;
    const q=search.toLowerCase();
    if(q && !String(r.name||"").toLowerCase().includes(q) && !String(r.phone||"").includes(q) && !String(r.booking_code||"").toLowerCase().includes(q)) return false;
    return true;
  });

  const updateStatus = async(id,status)=>{
    await supabase.from("reservations").update({status}).eq("id",id);
    setRes(p=>p.map(r=>r.id===id?{...r,status}:r));
  };

  const SB = (active) => ({
    display:"flex",alignItems:"center",gap:".7rem",padding:".75rem 1rem",borderRadius:"10px",border:"none",
    background:active?"#1a3d5e":"transparent",color:active?"#fff":"#94A3B8",
    fontFamily:"'Inter',system-ui,sans-serif",fontSize:".88rem",fontWeight:active?600:400,cursor:"pointer",width:"100%",textAlign:"left"
  });

  const tabs = [
    {id:"reservations",icon:"📋",label:"Rezervasiyalar"},
    {id:"restaurants",icon:"🏛️",label:"Restoranlar"},
    {id:"tables",icon:"🪑",label:"Masalar"},
    {id:"menu",icon:"🍽️",label:"Menyu"},
    {id:"reviews",icon:"⭐",label:"Rəylər"},
    ...(isSuper?[{id:"admins",icon:"👤",label:"Adminlər"}]:[]),
  ];

  const statusBadge = s=>{
    const m={"gözlənilir":["#FEF9C3","#A16207"],"təsdiqləndi":["#F0FDF4","#16A34A"],"ləğv edildi":["#FEF2F2","#DC2626"],"tamamlandı":["#e8f2fb","#1a5c8a"]};
    const [bg,c]=m[s]||["#F1F5F9","#64748B"];
    return <span style={S.badge(bg,c)}>{s}</span>;
  };

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",minHeight:"100vh",background:"#eef3f8",display:"flex"}}>
      {/* Sidebar */}
      <aside style={{width:"220px",background:"#12487a",color:"#fff",padding:"1.2rem",flexShrink:0,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:"2rem",padding:".5rem 0"}}>
          <div style={{width:"34px",height:"34px",borderRadius:"9px",background:"#1a3d5e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>🍽️</div>
          <div><div style={{fontWeight:800,fontSize:"1rem"}}>MasaAz</div><div style={{fontSize:".58rem",color:"#475569",letterSpacing:".1em"}}>ADMIN</div></div>
        </div>
        <nav style={{display:"flex",flexDirection:"column",gap:".3rem",flex:1}}>
          {tabs.map(({id,icon,label})=>(
            <button key={id} onClick={()=>setTab(id)} style={SB(tab===id)}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </nav>
        <div style={{borderTop:"1px solid #1a3d5e",paddingTop:"1rem",marginTop:"1rem"}}>
          <div style={{fontSize:".75rem",color:"#475569",marginBottom:".5rem"}}>
            {adminUser.display_name||adminUser.username}
            {isSuper&&<span style={{background:"#1a3d5e",color:"#78b8d4",borderRadius:"4px",padding:".1rem .4rem",fontSize:".6rem",marginLeft:".4rem"}}>SUPER</span>}
          </div>
          <button onClick={onLogout} style={{width:"100%",background:"#1a3d5e",color:"#94A3B8",border:"none",borderRadius:"8px",padding:".55rem",fontFamily:"inherit",fontSize:".8rem",cursor:"pointer"}}>Çıxış</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{flex:1,padding:"1.8rem",overflow:"auto"}}>

        {/* ══ REZERVASIYALAR ══ */}
        {tab==="reservations"&&(
          <ErrorBoundary>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
              <div><div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-.02em"}}>Rezervasiyalar</div><div style={{fontSize:".8rem",color:"#94A3B8"}}>Bütün rezervasiyaları idarə edin</div></div>
              <button onClick={load} style={S.btn()}>🔄 Yenilə</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",marginBottom:"1.5rem"}}>
              {[
                {label:"Cəmi",val:reservations.length,bg:"#12487a",c:"#fff"},
                {label:"Gözlənilir",val:reservations.filter(r=>r.status==="gözlənilir").length,bg:"#FEF9C3",c:"#A16207"},
                {label:"Təsdiqlənib",val:reservations.filter(r=>r.status==="təsdiqləndi").length,bg:"#F0FDF4",c:"#16A34A"},
                {label:"Ləğv",val:reservations.filter(r=>r.status==="ləğv edildi").length,bg:"#FEF2F2",c:"#DC2626"},
              ].map(s=>(
                <div key={s.label} style={{background:s.bg,borderRadius:"12px",padding:"1rem 1.2rem",border:"1px solid #E2E8F0"}}>
                  <div style={{fontSize:"1.8rem",fontWeight:800,color:s.c}}>{s.val}</div>
                  <div style={{fontSize:".72rem",color:s.c,opacity:.75,marginTop:".2rem"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:".7rem",marginBottom:"1.2rem",flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSrch(e.target.value)} placeholder="🔍 Ad, telefon, kod..." style={{...S.inp,width:"220px"}}/>
              <select value={fStatus} onChange={e=>setFS(e.target.value)} style={{...S.inp,width:"160px",cursor:"pointer"}}>
                <option value="all">Bütün statuslar</option>
                <option value="gözlənilir">Gözlənilir</option>
                <option value="təsdiqləndi">Təsdiqləndi</option>
                <option value="ləğv edildi">Ləğv edildi</option>
                <option value="tamamlandı">Tamamlandı</option>
              </select>
              {isSuper&&<select value={fRest} onChange={e=>setFR(e.target.value)} style={{...S.inp,width:"180px",cursor:"pointer"}}>
                <option value="all">Bütün restoranlar</option>
                {restaurants.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
              </select>}
            </div>
            {loading?<div style={{textAlign:"center",padding:"3rem",color:"#94A3B8"}}>⏳ Yüklənir...</div>
            :filteredRes.length===0?<div style={{textAlign:"center",padding:"3rem",color:"#94A3B8",background:"#fff",borderRadius:"12px",border:"1px solid #E2E8F0"}}><div style={{fontSize:"2rem",marginBottom:".5rem"}}>📋</div><div style={{fontWeight:600}}>Rezervasiya tapılmadı</div></div>
            :(
              <div style={{background:"#fff",borderRadius:"12px",border:"1px solid #E2E8F0",overflow:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:".83rem",minWidth:"700px"}}>
                  <thead>
                    <tr style={{background:"#eef3f8",borderBottom:"1px solid #E2E8F0"}}>
                      {["Kod","Ad / Tel","Restoran","Tarix","Saat","Masa","Qonaq","Status","Əməliyyat"].map(h=>(
                        <th key={h} style={{padding:".75rem 1rem",textAlign:"left",fontWeight:700,fontSize:".68rem",letterSpacing:".08em",textTransform:"uppercase",color:"#64748B",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRes.map((r,i)=>(
                      <tr key={r.id} style={{borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFC"}}>
                        <td style={{padding:".75rem 1rem",fontWeight:700,color:"#12487a",fontSize:".75rem",whiteSpace:"nowrap"}}>#{r.booking_code||r.id}</td>
                        <td style={{padding:".75rem 1rem"}}><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:".72rem",color:"#94A3B8"}}>{r.phone}</div></td>
                        <td style={{padding:".75rem 1rem",color:"#64748B",fontSize:".82rem"}}>{r.restaurant_name}</td>
                        <td style={{padding:".75rem 1rem",fontWeight:500,whiteSpace:"nowrap"}}>{r.date}</td>
                        <td style={{padding:".75rem 1rem",color:"#64748B"}}>{r.time}</td>
                        <td style={{padding:".75rem 1rem",color:"#64748B"}}>{r.table_label}</td>
                        <td style={{padding:".75rem 1rem",textAlign:"center",color:"#64748B"}}>{r.guests}</td>
                        <td style={{padding:".75rem 1rem"}}>{statusBadge(r.status)}</td>
                        <td style={{padding:".75rem 1rem"}}>
                          <div style={{display:"flex",gap:".4rem"}}>
                            {r.status==="gözlənilir"&&<button onClick={()=>updateStatus(r.id,"təsdiqləndi")} style={{background:"#F0FDF4",color:"#16A34A",border:"1px solid #86EFAC",borderRadius:"6px",padding:".28rem .6rem",fontSize:".72rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} title="Təsdiqlə">✓</button>}
                            {r.status!=="ləğv edildi"&&r.status!=="tamamlandı"&&<button onClick={()=>updateStatus(r.id,"ləğv edildi")} style={{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:"6px",padding:".28rem .6rem",fontSize:".72rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} title="Ləğv et">✕</button>}
                            {r.status==="təsdiqləndi"&&<button onClick={()=>updateStatus(r.id,"tamamlandı")} style={{background:"#e8f2fb",color:"#1a5c8a",border:"1px solid #a8cce0",borderRadius:"6px",padding:".28rem .6rem",fontSize:".72rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} title="Tamamla">✔✔</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ErrorBoundary>
        )}

        {/* ══ RESTORANLAR ══ */}
        {tab==="restaurants"&&<RestaurantManager restaurants={myRests} allRestaurants={restaurants} isSuper={isSuper} onReload={load} />}

        {/* ══ MASALAR ══ */}
        {tab==="tables"&&<TableManager restaurants={myRests} tables={tables} onReload={load} />}

        {/* ══ MENYU ══ */}
        {tab==="menu"&&<MenuManager restaurants={myRests} onReload={load} />}

        {/* ══ RƏYLƏR ══ */}
        {tab==="reviews"&&(
          <ErrorBoundary>
            <div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-.02em",marginBottom:"1.5rem"}}>Müştəri Rəyləri</div>
            {reviews.filter(r=>isSuper||r.restaurant_name===(myRests[0]?.name||"")).length===0
              ?<div style={{...S.card,textAlign:"center",padding:"3rem",color:"#94A3B8"}}><div style={{fontSize:"2rem",marginBottom:".5rem"}}>⭐</div><div style={{fontWeight:600}}>Hələ rəy yoxdur</div></div>
              :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem"}}>
                {reviews.filter(r=>isSuper||r.restaurant_name===(myRests[0]?.name||"")).map(r=>(
                  <div key={r.id} style={S.card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".8rem"}}>
                      <div><div style={{fontWeight:700}}>{r.customer_name||"Anonim"}</div><div style={{fontSize:".72rem",color:"#94A3B8"}}>{r.restaurant_name}</div></div>
                      <div style={{color:"#F59E0B",fontSize:"1rem"}}>{"★".repeat(r.stars||0)}{"☆".repeat(5-(r.stars||0))}</div>
                    </div>
                    {r.comment&&<div style={{fontSize:".85rem",color:"#475569",lineHeight:1.5,marginBottom:".8rem"}}>"{r.comment}"</div>}
                    <div style={{fontSize:".7rem",color:"#94A3B8"}}>{new Date(r.created_at).toLocaleDateString("az-AZ")}</div>
                  </div>
                ))}
              </div>
            }
          </ErrorBoundary>
        )}

        {/* ══ ADMİNLƏR ══ */}
        {tab==="admins"&&isSuper&&<AdminUsers restaurants={restaurants} />}
      </main>
    </div>
  );
}

// ─── RESTORAN İDARƏETMƏSİ ────────────────────────────────────
function RestaurantManager({ restaurants, isSuper, onReload }) {
  const empty = { name:"", cuisine:"", location:"", emoji:"🍽️", accent:"#12487a", price_range:"₼₼", rating:"4.5", available:true, tags:"" };
  const [form,setForm]=useState(empty); const [editId,setEditId]=useState(null); const [saving,setSaving]=useState(false);
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const save = async()=>{
    if(!form.name) return;
    setSaving(true);
    const payload={...form, tags:form.tags?form.tags.split(",").map(t=>t.trim()).filter(Boolean):[], rating:parseFloat(form.rating)||4.5 };
    if(editId) await supabase.from("restaurants").update(payload).eq("id",editId);
    else await supabase.from("restaurants").insert(payload);
    setSaving(false); setEditId(null); setForm(empty); onReload();
  };
  const del = async id=>{ if(!confirm("Restoranı silmək istəyirsiniz?")) return; await supabase.from("restaurants").delete().eq("id",id); onReload(); };
  const edit = r=>{ setEditId(r.id); setForm({name:r.name,cuisine:r.cuisine||"",location:r.location||"",emoji:r.emoji||"🍽️",accent:r.accent||"#12487a",price_range:r.price_range||"₼₼",rating:String(r.rating||4.5),available:r.available!==false,tags:(r.tags||[]).join(", ")}); window.scrollTo(0,0); };
  return (
    <ErrorBoundary>
      <div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-.02em",marginBottom:"1.5rem"}}>Restoranlar</div>
      <div style={{...S.card,marginBottom:"1.5rem"}}>
        <div style={{fontWeight:700,fontSize:"1rem",marginBottom:"1.2rem"}}>{editId?"✏️ Redaktə et":"➕ Yeni restoran"}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
          <div><label style={S.lbl}>Ad *</label><input value={form.name} onChange={set("name")} style={S.inp} placeholder="Restoran adı"/></div>
          <div><label style={S.lbl}>Mətbəx</label><input value={form.cuisine} onChange={set("cuisine")} style={S.inp} placeholder="Azərbaycan, İtalyan..."/></div>
          <div><label style={S.lbl}>Ünvan</label><input value={form.location} onChange={set("location")} style={S.inp} placeholder="Bakı, Nizami..."/></div>
          <div><label style={S.lbl}>Emoji</label><input value={form.emoji} onChange={set("emoji")} style={S.inp} placeholder="🍽️"/></div>
          <div>
            <label style={S.lbl}>Rəng</label>
            <div style={{display:"flex",gap:".5rem",alignItems:"center"}}>
              <input type="color" value={form.accent} onChange={set("accent")} style={{width:"42px",height:"38px",border:"1px solid #E2E8F0",borderRadius:"8px",cursor:"pointer",padding:"2px"}}/>
              <input value={form.accent} onChange={set("accent")} style={{...S.inp,flex:1}}/>
            </div>
          </div>
          <div>
            <label style={S.lbl}>Qiymət</label>
            <select value={form.price_range} onChange={set("price_range")} style={{...S.inp,cursor:"pointer"}}>
              {["₼","₼₼","₼₼₼","₼₼₼₼"].map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div><label style={S.lbl}>Reytinq</label><input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={set("rating")} style={S.inp}/></div>
          <div><label style={S.lbl}>Etiketlər (vergüllə)</label><input value={form.tags} onChange={set("tags")} style={S.inp} placeholder="Pizzacı, Ailə, Romantik"/></div>
          <div>
            <label style={S.lbl}>Status</label>
            <select value={form.available} onChange={e=>setForm(p=>({...p,available:e.target.value==="true"}))} style={{...S.inp,cursor:"pointer"}}>
              <option value="true">Açıqdır</option><option value="false">Bağlıdır</option>
            </select>
          </div>
        </div>
        <div style={{display:"flex",gap:".7rem"}}>
          <button onClick={save} disabled={saving||!form.name} style={{...S.btn(saving||!form.name?"#94A3B8":"#12487a"),cursor:saving||!form.name?"not-allowed":"pointer"}}>
            {saving?"⏳...":editId?"✓ Saxla":"➕ Əlavə et"}
          </button>
          {editId&&<button onClick={()=>{setEditId(null);setForm(empty);}} style={{...S.btn("#64748B")}}>İmtina</button>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem"}}>
        {restaurants.map(r=>(
          <div key={r.id} style={{...S.card,borderTop:`3px solid ${r.accent||"#12487a"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".8rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:".7rem"}}>
                <span style={{fontSize:"1.5rem"}}>{r.emoji||"🍽️"}</span>
                <div><div style={{fontWeight:700}}>{r.name}</div><div style={{fontSize:".72rem",color:"#94A3B8"}}>{r.cuisine} · {r.location}</div></div>
              </div>
              <span style={S.badge(r.available?"#F0FDF4":"#FEF2F2",r.available?"#16A34A":"#DC2626")}>{r.available?"Açıq":"Bağlı"}</span>
            </div>
            <div style={{fontSize:".78rem",color:"#64748B",marginBottom:"1rem"}}>★ {r.rating} · {r.price_range}</div>
            <div style={{display:"flex",gap:".5rem"}}>
              <button onClick={()=>edit(r)} style={{flex:1,background:"#e8f2fb",color:"#1a5c8a",border:"1px solid #a8cce0",borderRadius:"7px",padding:".5rem",fontFamily:"inherit",fontSize:".8rem",fontWeight:600,cursor:"pointer"}}>✏️ Redaktə</button>
              {isSuper&&<button onClick={()=>del(r.id)} style={{flex:1,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:"7px",padding:".5rem",fontFamily:"inherit",fontSize:".8rem",fontWeight:600,cursor:"pointer"}}>🗑️ Sil</button>}
            </div>
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
}

// ─── MASA İDARƏETMƏSİ ────────────────────────────────────────
function TableManager({ restaurants, tables, onReload }) {
  const empty = { label:"", seats:"4", zone:"", shape:"rect", x:"20", y:"20", restaurant_id:"" };
  const [form,setForm]=useState(empty); const [editId,setEditId]=useState(null); const [saving,setSaving]=useState(false);
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const save = async()=>{
    if(!form.label||!form.restaurant_id) return;
    setSaving(true);
    const payload={...form,seats:parseInt(form.seats)||4,restaurant_id:parseInt(form.restaurant_id),x:parseFloat(form.x)||20,y:parseFloat(form.y)||20};
    if(editId) await supabase.from("tables").update(payload).eq("id",editId);
    else await supabase.from("tables").insert(payload);
    setSaving(false); setEditId(null); setForm(empty); onReload();
  };
  const del = async id=>{ if(!confirm("Masanı silmək istəyirsiniz?")) return; await supabase.from("tables").delete().eq("id",id); onReload(); };
  const edit = t=>{ setEditId(t.id); setForm({label:t.label,seats:String(t.seats||4),zone:t.zone||"",shape:t.shape||"rect",x:String(t.x||20),y:String(t.y||20),restaurant_id:String(t.restaurant_id||"")}); window.scrollTo(0,0); };
  return (
    <ErrorBoundary>
      <div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-.02em",marginBottom:"1.5rem"}}>Masalar</div>
      <div style={{...S.card,marginBottom:"1.5rem"}}>
        <div style={{fontWeight:700,fontSize:"1rem",marginBottom:"1.2rem"}}>{editId?"✏️ Masanı redaktə et":"➕ Yeni masa"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginBottom:"1rem"}}>
          <div>
            <label style={S.lbl}>Restoran *</label>
            <select value={form.restaurant_id} onChange={set("restaurant_id")} style={{...S.inp,cursor:"pointer"}}>
              <option value="">Seçin...</option>
              {restaurants.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div><label style={S.lbl}>Masa adı *</label><input value={form.label} onChange={set("label")} style={S.inp} placeholder="A1, VIP-1..."/></div>
          <div>
            <label style={S.lbl}>Oturacaq</label>
            <select value={form.seats} onChange={set("seats")} style={{...S.inp,cursor:"pointer"}}>
              {[1,2,3,4,5,6,7,8,10,12].map(n=><option key={n} value={n}>{n} nəfər</option>)}
            </select>
          </div>
          <div><label style={S.lbl}>Zona</label><input value={form.zone} onChange={set("zone")} style={S.inp} placeholder="Terasa, VIP, İçəri..."/></div>
          <div>
            <label style={S.lbl}>Forma</label>
            <select value={form.shape} onChange={set("shape")} style={{...S.inp,cursor:"pointer"}}>
              <option value="rect">Düzbucaqlı (4 nf)</option>
              <option value="rect6">Böyük (6 nf)</option>
              <option value="round">Dairəvi</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div>
            <label style={S.lbl}>Mövqe X% / Y%</label>
            <div style={{display:"flex",gap:".5rem"}}>
              <input type="number" value={form.x} onChange={set("x")} style={S.inp} placeholder="X (%)"/>
              <input type="number" value={form.y} onChange={set("y")} style={S.inp} placeholder="Y (%)"/>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:".7rem"}}>
          <button onClick={save} disabled={saving||!form.label||!form.restaurant_id} style={{...S.btn(saving||!form.label||!form.restaurant_id?"#94A3B8":"#12487a"),cursor:"pointer"}}>
            {saving?"⏳...":editId?"✓ Saxla":"➕ Əlavə et"}
          </button>
          {editId&&<button onClick={()=>{setEditId(null);setForm(empty);}} style={{...S.btn("#64748B")}}>İmtina</button>}
        </div>
      </div>
      {restaurants.map(rest=>{
        const rt=tables.filter(t=>t.restaurant_id===rest.id);
        return (
          <div key={rest.id} style={{marginBottom:"1.5rem"}}>
            <div style={{fontWeight:700,fontSize:".9rem",marginBottom:".8rem",color:"#64748B"}}>{rest.emoji} {rest.name} ({rt.length} masa)</div>
            {rt.length===0?<div style={{...S.card,textAlign:"center",color:"#94A3B8",padding:"1.5rem"}}>Masa yoxdur</div>:(
              <div style={{background:"#fff",borderRadius:"12px",border:"1px solid #E2E8F0",overflow:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:".83rem",minWidth:"500px"}}>
                  <thead><tr style={{background:"#eef3f8",borderBottom:"1px solid #E2E8F0"}}>
                    {["Ad","Oturacaq","Zona","Forma","Mövqe","Əməliyyat"].map(h=><th key={h} style={{padding:".7rem 1rem",textAlign:"left",fontWeight:700,fontSize:".68rem",letterSpacing:".08em",textTransform:"uppercase",color:"#64748B"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {rt.map(t=>(
                      <tr key={t.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                        <td style={{padding:".7rem 1rem",fontWeight:700}}>{t.label}</td>
                        <td style={{padding:".7rem 1rem",color:"#64748B"}}>{t.seats} nf</td>
                        <td style={{padding:".7rem 1rem",color:"#64748B"}}>{t.zone||"—"}</td>
                        <td style={{padding:".7rem 1rem",color:"#64748B"}}>{t.shape}</td>
                        <td style={{padding:".7rem 1rem",color:"#94A3B8",fontSize:".78rem"}}>x:{t.x} y:{t.y}</td>
                        <td style={{padding:".7rem 1rem"}}>
                          <div style={{display:"flex",gap:".4rem"}}>
                            <button onClick={()=>edit(t)} style={{background:"#e8f2fb",color:"#1a5c8a",border:"1px solid #a8cce0",borderRadius:"6px",padding:".28rem .7rem",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
                            <button onClick={()=>del(t.id)} style={{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:"6px",padding:".28rem .7rem",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
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
    </ErrorBoundary>
  );
}

// ─── MENYU İDARƏETMƏSİ ───────────────────────────────────────
function MenuManager({ restaurants, onReload }) {
  const [selRest,setSelRest] = useState(null);
  const [items,setItems]     = useState([]);
  const [loading,setLoad]    = useState(false);
  const emptyItem = { id:"", name:"", cat:"Əsas yemək", price:"", emoji:"🍽️", desc:"" };
  const [form,setForm]       = useState(emptyItem);
  const [editIdx,setEditIdx] = useState(null);
  const [saving,setSaving]   = useState(false);

  const CATS = ["Əsas yemək","Salatlar","Çorbalar","Desert","Soyuq içki","İsti içki","Qəlyanaltı"];

  const loadMenu = async (rest) => {
    setLoad(true); setSelRest(rest); setEditIdx(null); setForm(emptyItem);
    const {data} = await supabase.from("restaurants").select("menu_items").eq("id",rest.id).maybeSingle();
    setItems(Array.isArray(data?.menu_items)?data.menu_items:[]);
    setLoad(false);
  };

  const saveItems = async (newItems) => {
    await supabase.from("restaurants").update({menu_items:newItems}).eq("id",selRest.id);
    setItems(newItems);
  };

  const addOrUpdate = async () => {
    if(!form.name||!form.price) return;
    setSaving(true);
    const item = { ...form, id: form.id||Date.now().toString(), price: parseFloat(form.price)||0 };
    let newItems;
    if(editIdx!==null) {
      newItems = items.map((it,i)=>i===editIdx?item:it);
    } else {
      newItems = [...items, item];
    }
    await saveItems(newItems);
    setSaving(false); setEditIdx(null); setForm(emptyItem); onReload();
  };

  const deleteItem = async (idx) => {
    if(!confirm("Bu məhsulu silmək istəyirsiniz?")) return;
    const newItems = items.filter((_,i)=>i!==idx);
    await saveItems(newItems);
  };

  const editItem = (item,idx) => {
    setEditIdx(idx);
    setForm({...item, price:String(item.price)});
    window.scrollTo(0,0);
  };

  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const cats = [...new Set([...CATS,...items.map(i=>i.cat)])].filter(Boolean);

  return (
    <ErrorBoundary>
      <div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-.02em",marginBottom:"1.5rem"}}>Menyu İdarəetməsi</div>

      {/* Restoran seçimi */}
      <div style={{display:"flex",gap:".7rem",flexWrap:"wrap",marginBottom:"1.5rem"}}>
        {restaurants.map(r=>(
          <button key={r.id} onClick={()=>loadMenu(r)}
            style={{background:selRest?.id===r.id?"#12487a":"#fff",color:selRest?.id===r.id?"#fff":"#12487a",border:"1px solid #E2E8F0",borderRadius:"10px",padding:".6rem 1.2rem",fontFamily:"inherit",fontSize:".88rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:".5rem"}}>
            <span>{r.emoji||"🍽️"}</span>{r.name}
          </button>
        ))}
      </div>

      {!selRest&&<div style={{...S.card,textAlign:"center",padding:"3rem",color:"#94A3B8"}}><div style={{fontSize:"2rem",marginBottom:".5rem"}}>🍽️</div><div style={{fontWeight:600}}>Yuxarıdan restoran seçin</div></div>}

      {selRest&&(
        <>
          {/* Əlavə etmə formu */}
          <div style={{...S.card,marginBottom:"1.5rem",borderTop:`3px solid ${selRest.accent||"#12487a"}`}}>
            <div style={{fontWeight:700,fontSize:"1rem",marginBottom:"1.2rem"}}>
              {editIdx!==null?"✏️ Məhsulu redaktə et":"➕ Yeni məhsul əlavə et"}
              <span style={{fontSize:".78rem",fontWeight:400,color:"#94A3B8",marginLeft:".7rem"}}>— {selRest.name}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
              <div><label style={S.lbl}>Ad *</label><input value={form.name} onChange={set("name")} style={S.inp} placeholder="Məsələn: Qutab"/></div>
              <div>
                <label style={S.lbl}>Kateqoriya</label>
                <select value={form.cat} onChange={set("cat")} style={{...S.inp,cursor:"pointer"}}>
                  {cats.map(c=><option key={c} value={c}>{c}</option>)}
                  <option value="__new__">+ Yeni kateqoriya...</option>
                </select>
              </div>
              <div><label style={S.lbl}>Qiymət (₼) *</label><input type="number" min="0" step="0.5" value={form.price} onChange={set("price")} style={S.inp} placeholder="12.50"/></div>
              <div><label style={S.lbl}>Emoji</label><input value={form.emoji} onChange={set("emoji")} style={S.inp} placeholder="🍽️"/></div>
              <div style={{gridColumn:"2/4"}}><label style={S.lbl}>Qısa izahat</label><input value={form.desc} onChange={set("desc")} style={S.inp} placeholder="Qısa təsvir..."/></div>
            </div>
            {form.cat==="__new__"&&(
              <div style={{marginBottom:"1rem"}}>
                <label style={S.lbl}>Yeni kateqoriya adı</label>
                <input value={form._newCat||""} onChange={e=>setForm(p=>({...p,cat:e.target.value,_newCat:e.target.value}))} style={S.inp} placeholder="Kateqoriya adı" autoFocus/>
              </div>
            )}
            <div style={{display:"flex",gap:".7rem"}}>
              <button onClick={addOrUpdate} disabled={saving||!form.name||!form.price}
                style={{...S.btn(saving||!form.name||!form.price?"#94A3B8":"#12487a"),cursor:saving||!form.name||!form.price?"not-allowed":"pointer"}}>
                {saving?"⏳...":editIdx!==null?"✓ Saxla":"➕ Əlavə et"}
              </button>
              {editIdx!==null&&<button onClick={()=>{setEditIdx(null);setForm(emptyItem);}} style={S.btn("#64748B")}>İmtina</button>}
            </div>
          </div>

          {/* Menyu siyahısı */}
          {loading?<div style={{textAlign:"center",padding:"2rem",color:"#94A3B8"}}>⏳ Yüklənir...</div>
          :items.length===0?<div style={{...S.card,textAlign:"center",padding:"2rem",color:"#94A3B8"}}><div style={{fontSize:"1.5rem",marginBottom:".5rem"}}>🍽️</div><div>Hələ menyu yoxdur. Yuxarıdan məhsul əlavə edin.</div></div>
          :(
            <div style={{background:"#fff",borderRadius:"12px",border:"1px solid #E2E8F0",overflow:"hidden"}}>
              {[...new Set(items.map(i=>i.cat))].map((cat,ci)=>(
                <div key={cat}>
                  {ci>0&&<div style={{height:"1px",background:"#F1F5F9"}}/>}
                  <div style={{padding:".7rem 1.2rem",background:"#eef3f8",fontSize:".62rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#94A3B8",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>{cat}</span>
                    <span style={{fontWeight:400,fontSize:".72rem",color:"#CBD5E1"}}>{items.filter(i=>i.cat===cat).length} məhsul</span>
                  </div>
                  {items.map((item,idx)=>item.cat!==cat?null:(
                    <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".9rem 1.2rem",borderBottom:"1px solid #F8FAFC",background:editIdx===idx?"#e8f2fb":"#fff"}}>
                      <div style={{display:"flex",alignItems:"center",gap:".8rem"}}>
                        <span style={{fontSize:"1.4rem"}}>{item.emoji||"🍽️"}</span>
                        <div>
                          <div style={{fontWeight:600,fontSize:".92rem"}}>{item.name}</div>
                          {item.desc&&<div style={{fontSize:".72rem",color:"#94A3B8"}}>{item.desc}</div>}
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                        <span style={{fontWeight:700,color:"#12487a"}}>{item.price}₼</span>
                        <div style={{display:"flex",gap:".4rem"}}>
                          <button onClick={()=>editItem(item,idx)} style={{background:"#e8f2fb",color:"#1a5c8a",border:"1px solid #a8cce0",borderRadius:"6px",padding:".28rem .7rem",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
                          <button onClick={()=>deleteItem(idx)} style={{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:"6px",padding:".28rem .7rem",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{padding:".75rem 1.2rem",background:"#eef3f8",borderTop:"1px solid #E2E8F0",fontSize:".75rem",color:"#94A3B8",fontWeight:500}}>
                Cəmi: {items.length} məhsul
              </div>
            </div>
          )}
        </>
      )}
    </ErrorBoundary>
  );
}

// ─── ADMİN İSTİFADƏÇİLƏR ────────────────────────────────────
async function hashPassword(plain){
  if(!plain) return null;
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(plain));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

function AdminUsers({ restaurants }) {
  const empty = { username:"", password_hash:"", display_name:"", restaurant_id:"", is_super:false, is_active:true };
  const [admins,setAdmins]=useState([]); const [form,setForm]=useState(empty);
  const [saving,setSaving]=useState(false); const [editId,setEditId]=useState(null);
  const load=async()=>{ const {data}=await supabase.from("admin_users").select("*").order("created_at"); setAdmins(data||[]); };
  useEffect(()=>{load();},[]);
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const save=async()=>{
    setSaving(true);
    const payload={...form, restaurant_id:form.restaurant_id?parseInt(form.restaurant_id):null};
    // SHA-256 şifrə hashlaması
    if(form.password_hash){
      payload.password_hash = await hashPassword(form.password_hash);
    } else if(editId) {
      delete payload.password_hash; // dəyişmə
    }
    if(editId){
      await supabase.from("admin_users").update(payload).eq("id",editId);
    } else await supabase.from("admin_users").insert(payload);
    setSaving(false); setEditId(null); setForm(empty); load();
  };
  const remove=async id=>{ if(!confirm("Bu admini silmək istəyirsiniz?")) return; await supabase.from("admin_users").delete().eq("id",id); load(); };
  return (
    <ErrorBoundary>
      <div style={{fontWeight:800,fontSize:"1.4rem",letterSpacing:"-.02em",marginBottom:"1.5rem"}}>Adminlər</div>
      <div style={{...S.card,marginBottom:"1.5rem"}}>
        <div style={{fontWeight:700,fontSize:"1rem",marginBottom:"1.2rem"}}>{editId?"✏️ Redaktə et":"➕ Yeni admin"}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
          <div><label style={S.lbl}>İstifadəçi adı *</label><input value={form.username} onChange={set("username")} style={S.inp} placeholder="username"/></div>
          <div><label style={S.lbl}>{editId?"Yeni şifrə (boş=dəyişmə)":"Şifrə *"}</label><input type="password" value={form.password_hash} onChange={set("password_hash")} style={S.inp} placeholder="••••••••"/></div>
          <div><label style={S.lbl}>Ad</label><input value={form.display_name} onChange={set("display_name")} style={S.inp} placeholder="Ad Soyad"/></div>
          <div>
            <label style={S.lbl}>Restoran</label>
            <select value={form.restaurant_id} onChange={set("restaurant_id")} style={{...S.inp,cursor:"pointer"}}>
              <option value="">Hamısı (super)</option>
              {restaurants.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label style={S.lbl}>Rol</label>
            <select value={form.is_super} onChange={e=>setForm(p=>({...p,is_super:e.target.value==="true"}))} style={{...S.inp,cursor:"pointer"}}>
              <option value="false">Restoran admini</option><option value="true">Super admin</option>
            </select>
          </div>
          <div>
            <label style={S.lbl}>Status</label>
            <select value={form.is_active} onChange={e=>setForm(p=>({...p,is_active:e.target.value==="true"}))} style={{...S.inp,cursor:"pointer"}}>
              <option value="true">Aktivdir</option><option value="false">Deaktivdir</option>
            </select>
          </div>
        </div>
        <div style={{display:"flex",gap:".7rem"}}>
          <button onClick={save} disabled={saving||!form.username} style={{...S.btn(saving||!form.username?"#94A3B8":"#12487a"),cursor:"pointer"}}>{saving?"⏳...":editId?"✓ Saxla":"➕ Əlavə et"}</button>
          {editId&&<button onClick={()=>{setEditId(null);setForm(empty);}} style={S.btn("#64748B")}>İmtina</button>}
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:"12px",border:"1px solid #E2E8F0",overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:".83rem",minWidth:"600px"}}>
          <thead><tr style={{background:"#eef3f8",borderBottom:"1px solid #E2E8F0"}}>
            {["İstifadəçi","Ad","Restoran","Rol","Status","Əməliyyat"].map(h=><th key={h} style={{padding:".75rem 1rem",textAlign:"left",fontWeight:700,fontSize:".68rem",letterSpacing:".08em",textTransform:"uppercase",color:"#64748B"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {admins.map(a=>(
              <tr key={a.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                <td style={{padding:".75rem 1rem",fontWeight:700}}>{a.username}</td>
                <td style={{padding:".75rem 1rem",color:"#64748B"}}>{a.display_name||"—"}</td>
                <td style={{padding:".75rem 1rem",color:"#64748B"}}>{restaurants.find(r=>r.id===a.restaurant_id)?.name||"Hamısı"}</td>
                <td style={{padding:".75rem 1rem"}}><span style={S.badge(a.is_super?"#e8f2fb":"#F1F5F9",a.is_super?"#1a5c8a":"#64748B")}>{a.is_super?"Super":"Restoran"}</span></td>
                <td style={{padding:".75rem 1rem"}}><span style={S.badge(a.is_active?"#F0FDF4":"#FEF2F2",a.is_active?"#16A34A":"#DC2626")}>{a.is_active?"Aktiv":"Deaktiv"}</span></td>
                <td style={{padding:".75rem 1rem"}}>
                  <div style={{display:"flex",gap:".4rem"}}>
                    <button onClick={()=>{setEditId(a.id);setForm({username:a.username,password_hash:"",display_name:a.display_name||"",restaurant_id:String(a.restaurant_id||""),is_super:a.is_super,is_active:a.is_active});window.scrollTo(0,0);}} style={{background:"#e8f2fb",color:"#1a5c8a",border:"1px solid #a8cce0",borderRadius:"6px",padding:".28rem .7rem",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
                    <button onClick={()=>remove(a.id)} style={{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:"6px",padding:".28rem .7rem",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}


// ════════════════════════════════════════════════════════════
// 🔀 URL ROUTER — Hər step özünəməxsus endpoint-ə malikdir
// ════════════════════════════════════════════════════════════
//
//  /                          → Ana səhifə (restoranlar siyahısı)
//  /r/:restSlug               → Restoran seçildi → tarix/saat
//  /r/:restSlug/table         → Masa seçimi
//  /r/:restSlug/menu          → Menyu / ön sifariş
//  /r/:restSlug/success       → Uğurlu rezervasiya
//  /cancel                    → Rezervasiya ləğvi
//  /review                    → Rəy forması  (?code=...)
//  /admin                     → Admin paneli  (admin.html-ə yönləndirir)
//  /owner                     → Owner paneli  (owner.html-ə yönləndirir)
//
function useRouter() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      setSearch(window.location.search);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }
    setPath(window.location.pathname);
    setSearch(window.location.search);
    window.scrollTo(0, 0);
  }, []);

  return { path, search, navigate };
}

// Slug köməkçisi
function toSlug(name) {
  return encodeURIComponent(name.trim());
}
function fromSlug(slug) {
  return decodeURIComponent(slug);
}

// ─── ROUTER ──────────────────────────────────────────────────
export default function App() {
  const { path, search, navigate } = useRouter();

  // /admin və /owner → statik HTML fayllarına yönləndir
  if (path === "/admin" || path.startsWith("/admin/")) {
    window.location.replace("/admin.html");
    return null;
  }
  if (path === "/owner" || path.startsWith("/owner/")) {
    window.location.replace("/owner.html");
    return null;
  }

  // /review → Rəy forması
  if (path === "/review") return <ReviewPage />;

  // /cancel → Ləğv səhifəsi
  if (path === "/cancel") return <CancelPage navigate={navigate} />;

  // /onboard → Restoran Onboarding forması
  if (path === "/onboard") return <OnboardingPage navigate={navigate} />;

  // /r/:slug[/step] → Rezervasiya axını
  if (path.startsWith("/r/")) {
    const parts = path.slice(3).split("/");          // ["buxar", "table"] və ya ["buxar"]
    const restSlug = parts[0] || "";
    const step = parts[1] || "";                      // "" = profil | "book" = başlanğıc | table | menu | success

    // /r/:slug → Restoran profil səhifəsi (ictimai landing)
    if (!step || step === "profile") {
      return (
        <ErrorBoundary>
          <RestaurantProfilePage navigate={navigate} restSlug={restSlug} />
        </ErrorBoundary>
      );
    }

    // /r/:slug/book → Rezervasiya başlanğıcı (datetime step)
    const initialStep = (step === "book" || step === "table" || !step) ? "table" : step;
    const params = new URLSearchParams(search);
    return (
      <ErrorBoundary>
        <MainApp
          navigate={navigate}
          restSlug={fromSlug(restSlug)}
          initialStep={initialStep}
          preTable={params.get("table") || ""}
        />
      </ErrorBoundary>
    );
  }

  // / → Ana səhifə
  return (
    <ErrorBoundary>
      <HomePage navigate={navigate} search={search} />
    </ErrorBoundary>
  );
}


// ════════════════════════════════════════════════════════════
// 🏛️ RESTORAN PROFİL SƏHİFƏSİ  →  /r/:slug
// İctimai landing: info, menyu, rəylər + "Rezervasiya et" CTA
// ════════════════════════════════════════════════════════════
function RestaurantProfilePage({ navigate, restSlug }) {
  const [rest, setRest]       = useState(null);
  const [menuItems, setMenu]  = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoad]    = useState(true);
  const [notFound, setNF]     = useState(false);

  useEffect(() => {
    const load = async () => {
      // Slug ilə tap (yeni slug sahəsi və ya köhnə name-based)
      let { data: rs } = await supabase
        .from("restaurants").select("*")
        .or(`slug.eq.${restSlug},name.ilike.${decodeURIComponent(restSlug).replace(/-/g," ")}`)
        .maybeSingle();

      if (!rs) {
        // Fallback: name-based slug match
        const { data: all } = await supabase.from("restaurants").select("*");
        rs = (all || []).find(r =>
          toSlug(r.name) === restSlug ||
          r.slug === restSlug
        ) || null;
      }

      if (!rs) { setNF(true); setLoad(false); return; }
      setRest({ ...rs, tags: Array.isArray(rs.tags) ? rs.tags : [] });

      // Menyu (yeni cədvəldən əvvəl köhnə JSONB-ə bax)
      const { data: mi } = await supabase
        .from("menu_items").select("*")
        .eq("restaurant_id", rs.id).eq("available", true).order("sort_order");
      if (mi && mi.length > 0) {
        setMenu(mi);
      } else if (rs.menu_items && rs.menu_items.length > 0) {
        setMenu(rs.menu_items);
      }

      // Son 10 rəy
      const { data: rv } = await supabase
        .from("reviews").select("*")
        .eq("restaurant_name", rs.name).order("created_at", { ascending: false }).limit(10);
      setReviews(rv || []);
      setLoad(false);
    };
    load();
  }, [restSlug]);

  const f = { fontFamily:"'Inter',system-ui,sans-serif" };
  const cats = useMemo(() => [...new Set(menuItems.map(i => i.cat))].filter(Boolean), [menuItems]);
  const avgStars = useMemo(() => {
    if (!reviews.length) return null;
    return (reviews.reduce((s, r) => s + (r.stars || 0), 0) / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading) return (
    <div style={{ ...f, minHeight:"100vh", background:"#eef3f8", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}><div style={{ fontSize:"2rem", marginBottom:"1rem" }}>⏳</div><div style={{ color:"#94A3B8" }}>Yüklənir...</div></div>
    </div>
  );

  if (notFound || !rest) return (
    <div style={{ ...f, minHeight:"100vh", background:"#eef3f8", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", padding:"3rem" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🏛️</div>
        <div style={{ fontWeight:700, fontSize:"1.2rem", marginBottom:".5rem" }}>Restoran tapılmadı</div>
        <div style={{ color:"#94A3B8", marginBottom:"1.5rem" }}>Bu ünvan mövcud deyil.</div>
        <button onClick={() => navigate("/")} style={{ background:"#12487a", color:"#fff", border:"none", borderRadius:"10px", padding:".8rem 2rem", fontFamily:"inherit", fontSize:".9rem", fontWeight:700, cursor:"pointer" }}>← Ana Səhifə</button>
      </div>
    </div>
  );

  return (
    <div style={{ ...f, background:"#eef3f8", minHeight:"100vh", color:"#12487a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Header */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem", position:"sticky", top:0, zIndex:100 }}>
        <div onClick={() => navigate("/")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:".6rem" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"#12487a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>🍽️</div>
          <div style={{ fontWeight:800, fontSize:"1.05rem" }}>MasaAz</div>
        </div>
        <button onClick={() => navigate("/")} style={{ background:"none", border:"1px solid #E2E8F0", color:"#64748B", padding:".4rem .9rem", borderRadius:"8px", fontSize:".78rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>← Bütün Restoranlar</button>
      </header>

      {/* Hero */}
      <div style={{ background:rest.cover_url?`linear-gradient(135deg,#0a2d4a,#12487a)`:`linear-gradient(135deg, ${rest.accent||"#12487a"}18 0%, #fff 100%)`, borderBottom:"1px solid #E2E8F0", padding:rest.cover_url?"0":"2.5rem 2rem", position:"relative", overflow:"hidden" }}>
        {rest.cover_url && <><img src={rest.cover_url} alt={rest.name} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.35 }}/><div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(10,29,42,.6),rgba(10,29,42,.85))" }}/></>}
        <div style={{ maxWidth:"800px", margin:"0 auto", display:"flex", gap:"1.5rem", alignItems:"flex-start", flexWrap:"wrap", position:"relative", zIndex:1, padding:rest.cover_url?"2.5rem 2rem":"0", color:rest.cover_url?"#fff":"inherit" }}>
          <div style={{ width:"80px", height:"80px", borderRadius:"20px", background:rest.cover_url?"rgba(255,255,255,.15)":`${rest.accent||"#12487a"}20`, border:`2px solid ${rest.cover_url?"rgba(255,255,255,.3)":rest.accent||"#12487a"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.5rem", flexShrink:0 }}>{rest.emoji||"🍽️"}</div>
          <div style={{ flex:1, minWidth:"200px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:".8rem", flexWrap:"wrap", marginBottom:".3rem" }}>
              <h1 style={{ fontWeight:800, fontSize:"1.8rem", letterSpacing:"-.02em" }}>{rest.name}</h1>
              {!rest.available && <span style={{ fontSize:".62rem", padding:".2rem .55rem", background:"#FEF2F2", border:"1px solid #FECACA", color:"#DC2626", borderRadius:"20px", fontWeight:600 }}>Bağlıdır</span>}
            </div>
            <div style={{ fontSize:".85rem", color:"#64748B", marginBottom:".6rem", textTransform:"uppercase", letterSpacing:".08em" }}>{rest.cuisine}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:".6rem", fontSize:".8rem", color:"#64748B", marginBottom:".8rem" }}>
              {rest.location && <span>📍 {rest.location}</span>}
              {rest.hours    && <span>🕐 {rest.hours}</span>}
              {rest.phone    && <span>📞 {rest.phone}</span>}
              <span>{rest.price_range||"₼₼"}</span>
              {avgStars && <span>⭐ {avgStars} ({reviews.length} rəy)</span>}
            </div>
            {rest.description && <p style={{ fontSize:".88rem", color:"#475569", lineHeight:1.6, maxWidth:"500px" }}>{rest.description}</p>}
            <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem", marginTop:".8rem" }}>
              {rest.tags.map(t => <span key={t} style={{ fontSize:".65rem", padding:".2rem .55rem", borderRadius:"20px", background:`${rest.accent||"#12487a"}12`, color:rest.accent||"#12487a", border:`1px solid ${rest.accent||"#12487a"}25`, fontWeight:500 }}>{t}</span>)}
            </div>
          </div>
          {rest.available && (
            <button onClick={() => navigate(`/r/${toSlug(rest.name)}/book`)}
              style={{ background:"#12487a", color:"#fff", border:"none", padding:"1rem 2rem", fontFamily:"inherit", fontSize:"1rem", fontWeight:800, cursor:"pointer", borderRadius:"12px", flexShrink:0, boxShadow:"0 4px 16px rgba(0,0,0,.2)" }}>
              🍽️ Rezervasiya Et
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth:"800px", margin:"0 auto", padding:"2rem" }}>

        {/* Menyu Preview */}
        {menuItems.length > 0 && (
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontWeight:700, fontSize:"1.1rem", marginBottom:"1rem" }}>🍽️ Menyu</div>
            <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px", overflow:"hidden" }}>
              {cats.map((cat, ci) => (
                <div key={cat}>
                  {ci > 0 && <div style={{ height:"1px", background:"#F1F5F9" }}/>}
                  <div style={{ padding:".6rem 1.2rem", background:"#eef3f8", fontSize:".62rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"#94A3B8" }}>{cat}</div>
                  {menuItems.filter(i => i.cat === cat).map((item, idx, arr) => (
                    <div key={item.id||idx} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".85rem 1.2rem", borderBottom:idx < arr.length-1?"1px solid #F1F5F9":"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
                        <span style={{ fontSize:"1.3rem" }}>{item.emoji||"🍽️"}</span>
                        <div>
                          <div style={{ fontWeight:600, fontSize:".9rem" }}>{item.name}</div>
                          {item.desc && <div style={{ fontSize:".72rem", color:"#94A3B8" }}>{item.desc}</div>}
                          {item.description && <div style={{ fontSize:".72rem", color:"#94A3B8" }}>{item.description}</div>}
                        </div>
                      </div>
                      <span style={{ fontWeight:700, fontSize:".9rem", flexShrink:0, marginLeft:"1rem" }}>{item.price}₼</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rəylər */}
        {reviews.length > 0 && (
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontWeight:700, fontSize:"1.1rem", marginBottom:"1rem" }}>⭐ Rəylər</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1rem" }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"12px", padding:"1rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".5rem" }}>
                    <span style={{ fontWeight:600, fontSize:".88rem" }}>{r.customer_name||"Anonim"}</span>
                    <span style={{ color:"#F59E0B" }}>{"★".repeat(r.stars||0)}{"☆".repeat(5-(r.stars||0))}</span>
                  </div>
                  {r.comment && <div style={{ fontSize:".82rem", color:"#475569", lineHeight:1.5 }}>"{r.comment}"</div>}
                  <div style={{ fontSize:".68rem", color:"#94A3B8", marginTop:".5rem" }}>{new Date(r.created_at).toLocaleDateString("az-AZ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {rest.available && (
          <div style={{ background:"#12487a", borderRadius:"16px", padding:"2rem", textAlign:"center", color:"#fff" }}>
            <div style={{ fontSize:"1.4rem", fontWeight:800, marginBottom:".4rem" }}>Masanızı rezerv edin</div>
            <div style={{ color:"#94A3B8", marginBottom:"1.5rem", fontSize:".88rem" }}>Cəmi 2 dəqiqə çəkir</div>
            <button onClick={() => navigate(`/r/${toSlug(rest.name)}/book`)}
              style={{ background:"#12487a", color:"#fff", border:"none", padding:".9rem 2.5rem", fontFamily:"inherit", fontSize:"1rem", fontWeight:700, cursor:"pointer", borderRadius:"10px" }}>
              Rezervasiya Et →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// 🚀 ONBOARDİNG SƏHİFƏSİ  →  /onboard
// Yeni restoran qeydiyyatı üçün forma
// ════════════════════════════════════════════════════════════
function OnboardingPage({ navigate }) {
  const empty = { business_name:"", contact_name:"", phone:"", email:"", cuisine:"", location:"", table_count:"", message:"" };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.business_name || !form.contact_name || !form.phone) {
      setErr("Restoran adı, əlaqə adı və telefon mütləqdir.");
      return;
    }
    setSaving(true); setErr("");
    const { error } = await supabase.from("onboarding_requests").insert({
      ...form,
      table_count: form.table_count ? parseInt(form.table_count) : null
    });
    setSaving(false);
    if (error) { setErr("Xəta baş verdi, yenidən cəhd edin."); return; }
    setDone(true);
  };

  const f = { fontFamily:"'Inter',system-ui,sans-serif" };
  const box = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"10px", padding:".9rem 1rem" };
  const lbl = { fontSize:".65rem", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:"#94A3B8", marginBottom:".4rem", display:"block" };
  const inp = { width:"100%", border:"none", background:"transparent", fontSize:".9rem", color:"#12487a", outline:"none" };

  if (done) return (
    <div style={{ ...f, minHeight:"100vh", background:"#eef3f8", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", padding:"3rem", maxWidth:"440px" }}>
        <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🎉</div>
        <div style={{ fontWeight:800, fontSize:"1.5rem", marginBottom:".5rem" }}>Müraciətiniz qəbul edildi!</div>
        <div style={{ color:"#64748B", marginBottom:"1.5rem", lineHeight:1.6 }}>MasaAz komandası ən qısa zamanda sizinlə əlaqə saxlayacaq. Adətən 24 saat ərzində cavablanır.</div>
        <button onClick={() => navigate("/")} style={{ background:"#12487a", color:"#fff", border:"none", borderRadius:"10px", padding:".8rem 2rem", fontFamily:"inherit", fontSize:".9rem", fontWeight:700, cursor:"pointer" }}>← Ana Səhifə</button>
      </div>
    </div>
  );

  return (
    <div style={{ ...f, background:"#eef3f8", minHeight:"100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <header style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem" }}>
        <div onClick={() => navigate("/")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:".6rem" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"#12487a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>🍽️</div>
          <div style={{ fontWeight:800, fontSize:"1.05rem" }}>MasaAz</div>
        </div>
      </header>

      <div style={{ maxWidth:"580px", margin:"0 auto", padding:"1rem" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:".8rem" }}>🚀</div>
          <div style={{ fontWeight:800, fontSize:"1.6rem", letterSpacing:"-.02em", marginBottom:".3rem" }}>Restoranınızı əlavə edin</div>
          <div style={{ color:"#64748B", fontSize:".88rem" }}>MasaAz platformasına qoşulun — pulsuz başlayın</div>
        </div>

        {err && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:".75rem 1rem", marginBottom:"1rem", color:"#DC2626", fontSize:".85rem" }}>{err}</div>}

        <div style={{ display:"grid", gap:"1rem" }}>
          <div style={box}><label style={lbl}>Restoran Adı *</label><input value={form.business_name} onChange={set("business_name")} placeholder="Buxar Restaurant" style={inp}/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            <div style={box}><label style={lbl}>Əlaqədar Şəxs *</label><input value={form.contact_name} onChange={set("contact_name")} placeholder="Adınız" style={inp}/></div>
            <div style={box}><label style={lbl}>Telefon *</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+994 50 000 00 00" style={inp}/></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            <div style={box}><label style={lbl}>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="info@restoran.az" style={inp}/></div>
            <div style={box}><label style={lbl}>Mətbəx növü</label><input value={form.cuisine} onChange={set("cuisine")} placeholder="Azərbaycan, İtalyan..." style={inp}/></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            <div style={box}><label style={lbl}>Ünvan</label><input value={form.location} onChange={set("location")} placeholder="Bakı, Nizami küçəsi..." style={inp}/></div>
            <div style={box}><label style={lbl}>Masa sayı (təxmini)</label><input type="number" min="1" value={form.table_count} onChange={set("table_count")} placeholder="20" style={inp}/></div>
          </div>
          <div style={box}><label style={lbl}>Əlavə qeyd</label><textarea value={form.message} onChange={set("message")} placeholder="Bizimlə bölüşmək istədiyiniz hər hansı məlumat..." rows={3} style={{ ...inp, resize:"vertical" }}/></div>
        </div>

        <button onClick={submit} disabled={saving}
          style={{ width:"100%", marginTop:"1.5rem", background:saving?"#94A3B8":"#12487a", color:"#fff", border:"none", padding:"1rem", fontFamily:"inherit", fontSize:"1rem", fontWeight:700, cursor:saving?"not-allowed":"pointer", borderRadius:"10px" }}>
          {saving ? "⏳ Göndərilir..." : "Müraciət Et →"}
        </button>
        <div style={{ textAlign:"center", marginTop:"1rem", fontSize:".75rem", color:"#94A3B8" }}>Komandamız 24 saat ərzində sizinlə əlaqə saxlayacaq</div>
      </div>
    </div>
  );
}



function HomePage({ navigate, search: searchProp }) {
  const [restaurants, setRests] = useState([]);
  const [loading, setLoad]      = useState(true);
  const [searchQ, setSearchQ]   = useState("");
  const [activeCat, setActiveCat] = useState("Hamısı");

  useEffect(() => {
    supabase.from("restaurants").select("*").order("name").then(({ data }) => {
      setRests((data || []).map(r => ({
        ...r, priceRange: r.price_range || "₼₼",
        tags: Array.isArray(r.tags) ? r.tags : []
      })));
      setLoad(false);
    });
  }, []);

  // Bütün unikal kateqoriyaları topla
  const allCuisines = useMemo(() => {
    const cats = new Set();
    restaurants.forEach(r => { if(r.cuisine) cats.add(r.cuisine); });
    return ["Hamısı", ...Array.from(cats)];
  }, [restaurants]);

  const filtered = useMemo(() => {
    let list = restaurants;
    if (activeCat !== "Hamısı") list = list.filter(r => r.cuisine === activeCat);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        (r.tags||[]).some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [restaurants, searchQ, activeCat]);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Inter:wght@300;400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#f0ece4;}
    input,select,textarea,button{font-family:'Inter',system-ui,sans-serif;}
    .rcard{transition:box-shadow .25s,transform .25s;cursor:pointer;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);}
    .rcard:hover{box-shadow:0 12px 40px rgba(0,0,0,.14);transform:translateY(-4px);}
    .rcard-disabled{opacity:.55;cursor:default;}
    .cat-btn{border:1.5px solid #d9d4cc;background:#fff;color:#4a4a4a;border-radius:50px;padding:.42rem 1.1rem;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .18s;white-space:nowrap;}
    .cat-btn:hover{border-color:#1a1a2e;color:#1a1a2e;}
    .cat-btn.active{background:#1a1a2e;color:#fff;border-color:#1a1a2e;}
    .hero-search input:focus{outline:none;}
    ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#ccc;border-radius:10px;}
  `;

  // Restoran adından 2 hərflik placeholder
  const initials = (name) => name ? name.slice(0,2) : "R";

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#f0ece4", minHeight:"100vh", color:"#1a1a2e", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* ── HEADER ── */}
      <header style={{ background:"#fff", position:"sticky", top:0, zIndex:200, height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2rem", boxShadow:"0 1px 0 rgba(0,0,0,.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:".75rem", cursor:"pointer" }} onClick={() => navigate("/")}>
          <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>🍽️</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", letterSpacing:"-.01em", lineHeight:1.1 }}>MasaAz</div>
            <div style={{ fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"#9c9c9c", marginTop:"1px" }}>Rezervasiya</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:".5rem", alignItems:"center" }}>
          <button onClick={() => navigate("/cancel")} style={{ background:"none", border:"1.5px solid #e0ddd8", color:"#6b6b6b", padding:".38rem .9rem", borderRadius:"8px", fontSize:".78rem", fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:".3rem" }}>
            ✕ Ləğv et
          </button>
          <button onClick={() => navigate("/onboard")} style={{ background:"#1a1a2e", color:"#fff", border:"none", padding:".42rem 1rem", borderRadius:"8px", fontSize:".78rem", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:".3rem" }}>
            + Qeydiyyat
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{ background:"linear-gradient(160deg,#0d1b2a 0%,#1a2d42 45%,#12345a 100%)", minHeight:"480px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"4rem 2rem 3rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"320px", height:"320px", borderRadius:"50%", background:"rgba(255,255,255,.03)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-60px", left:"-60px", width:"240px", height:"240px", borderRadius:"50%", background:"rgba(255,255,255,.025)", pointerEvents:"none" }}/>

        <div style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", borderRadius:"50px", padding:".4rem 1.2rem", marginBottom:"2rem" }}>
          <span style={{ fontSize:".65rem", letterSpacing:".18em", textTransform:"uppercase", color:"#c8b89a", fontWeight:500 }}>✦ Bakının seçilmiş restoranları</span>
        </div>

        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.6rem,5.5vw,4.2rem)", fontWeight:700, lineHeight:1.15, letterSpacing:"-.01em", color:"#fff", marginBottom:"1rem" }}>
          Masanızı elə indi
        </h1>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.6rem,5.5vw,4.2rem)", fontWeight:700, fontStyle:"italic", lineHeight:1.15, color:"#c8a96e", marginBottom:"1.5rem", marginTop:"-.4rem" }}>
          rezerv edin
        </h1>
        <p style={{ color:"rgba(255,255,255,.55)", fontSize:".98rem", maxWidth:"400px", lineHeight:1.7, marginBottom:"2.5rem" }}>
          Restoranı seçin, masanı rezerv edin, menyudan əvvəlcədən sifariş verin.
        </p>

        {/* Search box */}
        <div className="hero-search" style={{ position:"relative", width:"100%", maxWidth:"520px", marginBottom:"0" }}>
          <span style={{ position:"absolute", left:"1.1rem", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.4)", fontSize:"1rem", pointerEvents:"none" }}>🔍</span>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Restoran, mətbəx, məkan axtar..."
            style={{ width:"100%", background:"rgba(255,255,255,.1)", border:"1.5px solid rgba(255,255,255,.18)", borderRadius:"14px", padding:".9rem 1.2rem .9rem 3rem", fontSize:".92rem", color:"#fff", backdropFilter:"blur(12px)" }}
          />
          {searchQ && <button onClick={() => setSearchQ("")} style={{ position:"absolute", right:"1rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(255,255,255,.5)", fontSize:"1rem", cursor:"pointer" }}>✕</button>}
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #ede9e3", padding:".85rem 2rem", display:"flex", justifyContent:"center", gap:"3rem", flexWrap:"wrap" }}>
        {[
          ["📍", `${restaurants.length} restoran`],
          ["🪑", "Bu gün 140+ masa boşdur"],
          ["⏱️", "2 dəq ərzində təsdiq"],
        ].map(([icon, text]) => {
          const parts = text.split(/(\d+\+?)/);
          return (
            <div key={text} style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".82rem", color:"#6b6b6b" }}>
              <span style={{ fontSize:".9rem" }}>{icon}</span>
              <span>
                {parts.map((p,i) => /\d+\+?/.test(p)
                  ? <strong key={i} style={{ color:"#1a1a2e", fontWeight:700 }}>{p}</strong>
                  : p
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"2rem 2rem 4rem" }}>

        {/* Category filters */}
        <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:"2rem", overflowX:"auto", paddingBottom:".2rem" }}>
          {allCuisines.map(cat => (
            <button key={cat} className={`cat-btn${activeCat===cat?" active":""}`} onClick={() => setActiveCat(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Section header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"1.5rem" }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.7rem", fontWeight:700, color:"#1a1a2e" }}>Restoranlar</h2>
            <div style={{ fontSize:".8rem", color:"#9c9c9c", marginTop:".2rem" }}>{filtered.length} restoran tapıldı</div>
          </div>
          <span style={{ fontSize:".85rem", color:"#c8a96e", fontWeight:600, cursor:"pointer" }}>Hamısına bax →</span>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:"center", padding:"5rem", color:"#9c9c9c" }}>
            <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>⏳</div>
            <div style={{ fontWeight:600 }}>Restoranlar yüklənir...</div>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"4rem", color:"#9c9c9c" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>{searchQ ? "🔍" : "🏛️"}</div>
            <div style={{ fontWeight:700, fontSize:"1rem" }}>{searchQ ? `"${searchQ}" üçün nəticə yoxdur` : "Hələ restoran yoxdur"}</div>
          </div>
        )}

        {/* Restaurant grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.5rem" }}>
          {filtered.map(r => (
            <div
              key={r.id}
              className={`rcard${!r.available?" rcard-disabled":""}`}
              onClick={() => { if(!r.available) return; navigate(`/r/${toSlug(r.name)}`); }}
            >
              {/* Card image area */}
              <div style={{ position:"relative", height:"200px", background: r.cover_url ? "transparent" : `linear-gradient(135deg, ${r.accent||"#1a2d42"}cc, ${r.accent||"#0d1b2a"}ee)`, overflow:"hidden" }}>
                {r.cover_url
                  ? <img src={r.cover_url} alt={r.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                  : (
                    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"5rem", fontWeight:700, color:"rgba(255,255,255,.12)", userSelect:"none", letterSpacing:"-.05em" }}>{initials(r.name)}</span>
                    </div>
                  )
                }
                {/* Gradient overlay */}
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.55))" }}/>
                {/* Rating badge */}
                <div style={{ position:"absolute", top:"12px", right:"12px", background:"rgba(255,255,255,.92)", borderRadius:"50px", padding:".28rem .7rem", display:"flex", alignItems:"center", gap:".3rem", fontSize:".78rem", fontWeight:700, color:"#1a1a2e" }}>
                  <span style={{ color:"#c8a96e" }}>★</span> {r.rating}
                </div>
                {/* Status badge */}
                {!r.available && (
                  <div style={{ position:"absolute", top:"12px", left:"12px", background:"#DC2626", color:"#fff", borderRadius:"50px", padding:".25rem .7rem", fontSize:".72rem", fontWeight:700 }}>Tam dolu</div>
                )}
                {/* Cuisine tag bottom left */}
                <div style={{ position:"absolute", bottom:"12px", left:"12px" }}>
                  <span style={{ fontSize:".65rem", letterSpacing:".1em", textTransform:"uppercase", color:"rgba(255,255,255,.7)", fontWeight:500 }}>{r.cuisine}</span>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding:"1.2rem 1.4rem 1.4rem" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.25rem", color:"#1a1a2e", marginBottom:".35rem" }}>{r.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"#7a7a7a", marginBottom:".8rem" }}>
                  <span>📍</span><span>{r.location}</span>
                  <span style={{ color:"#d0ccc6", margin:"0 .1rem" }}>·</span>
                  <span>{r.priceRange}</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:".35rem", marginBottom:"1.1rem" }}>
                  {r.tags.map(t => (
                    <span key={t} style={{ fontSize:".65rem", padding:".2rem .6rem", borderRadius:"50px", background:"#f0ece4", color:"#5a5a5a", fontWeight:500 }}>{t}</span>
                  ))}
                </div>
                {r.available
                  ? <button style={{ width:"100%", background:"#1a1a2e", color:"#fff", border:"none", borderRadius:"10px", padding:".75rem", fontSize:".88rem", fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:".5rem" }}>
                      Rezervasiya et <span>→</span>
                    </button>
                  : <div style={{ width:"100%", background:"#f0ece4", color:"#9c9c9c", borderRadius:"10px", padding:".75rem", fontSize:".85rem", textAlign:"center", fontWeight:500 }}>Bu gün üçün yer yoxdur</div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── ƏSAS REZERVASIYA ────────────────────────────────────────
// YENİ AXIN: masa planı → tarix/saat → menyu → bitir
// Müştəri əvvəl masaları görür, seçir, sonra detalları doldurur

// Saat slotları: 12:00-22:30, hər 30 dəqiqə
function getTimeSlots() {
  const slots=[];
  for(let h=12;h<=22;h++){
    slots.push(String(h).padStart(2,"0")+":00");
    if(h<22) slots.push(String(h).padStart(2,"0")+":30");
  }
  return slots;
}
const ALL_TIME_SLOTS = getTimeSlots();
function timeToMins(t){ const [h,m]=t.split(":").map(Number); return h*60+m; }

// Hər masa üçün seçilmiş gündə boş saat slotlarını qaytarır
// Min 30 dəq, max 90 dəq (1.5 saat) oturma müddəti
function getTableFreeSlots(tableLabel, allRevs, date) {
  const DURATION = 90;
  const occupied = allRevs
    .filter(r => r.table_label===tableLabel && r.date===date && r.status!=="ləğv edildi")
    .map(r => ({ s: timeToMins(r.time), e: timeToMins(r.time)+DURATION }));
  return ALL_TIME_SLOTS.filter(slot => {
    const s=timeToMins(slot), e=s+DURATION;
    return !occupied.some(r => s<r.e && e>r.s);
  });
}

function MainApp({ navigate, restSlug, initialStep, preTable }) {
  const [step,setStep]           = useState("table");
  const [restaurants,setRests]   = useState([]);
  const [dbTables,setTbls]       = useState([]);
  const [allRevs,setAllRevs]     = useState([]);
  const [bookedLabels,setBkd]    = useState([]);
  const [slotCounts,setSlots]    = useState({});
  const [loadingRests,setLR]     = useState(true);
  const [loadingSlots,setLS]     = useState(false);
  const [selRest,setSelRest]     = useState(null);
  const [selDate,setSelDate]     = useState("");
  const [selTime,setSelTime]     = useState("");
  const [selTable,setSelTbl]     = useState(null);
  const [hoverTable,setHover]    = useState(null);
  const [cart,setCart]           = useState({});
  const [guests,setGuests]       = useState(2);
  const [custName,setCustName]   = useState("");
  const [custPhone,setCustPhone] = useState("");
  const [specialOccasion,setSpecialOccasion] = useState("");
  const [bookingCode,setBkCode]  = useState("");
  const [saving,setSaving]       = useState(false);
  const [saveError,setSaveErr]   = useState("");
  const today = new Date().toISOString().split("T")[0];




  // ── URL-based navigation ──
  const navigateStep = useCallback((targetStep, options = {}) => {
    const slug = toSlug(options.restName || (selRest ? selRest.name : restSlug));
    if (targetStep === "home") {
      navigate("/");
    } else if (targetStep === "success") {
      navigate(`/r/${slug}/success`, { replace: true });
    } else {
      navigate(`/r/${slug}/${targetStep}`);
    }
    setStep(targetStep);
  }, [navigate, selRest, restSlug]);

  // ── Restoran + masaları + BÜTÜn rezervasiyaları yüklə ──────
  useEffect(()=>{
    supabase.from("restaurants").select("*").order("name").then(({data})=>{
      const mapped=(data||[]).map(r=>({...r,priceRange:r.price_range||"₼₼",tags:Array.isArray(r.tags)?r.tags:[]}));
      setRests(mapped);
      setLR(false);
      if(restSlug){
        const slug=toSlug(restSlug);
        const match=mapped.find(r=>toSlug(r.name)===slug||r.name.toLowerCase()===restSlug.toLowerCase()||r.slug===slug);
        if(match&&match.available){
          setSelRest(match);
          // Masaları yüklə
          supabase.from("tables").select("*").eq("restaurant_id",match.id).order("label").then(({data:td})=>{
            setTbls((td||[]).map(t=>({...t,desc:t.zone||"",img:t.img_url||""})));
          });
          // Bu restoranın bütün gələcək rezervasiyalarını yüklə (real-time masa göstərmək üçün)
          supabase.from("reservations").select("table_label,date,time,status")
            .eq("restaurant_name",match.name).gte("date",new Date().toISOString().split("T")[0])
            .neq("status","ləğv edildi").then(({data:rv})=>setAllRevs(rv||[]));
        }
      }
    });
  },[restSlug]);

  // ── Real-time: yeni rezervasiya gəlsə yenilə ─────────────
  useEffect(()=>{
    if(!selRest) return;
    const ch=supabase.channel("revs_"+selRest.id)
      .on("postgres_changes",{event:"*",schema:"public",table:"reservations",filter:`restaurant_name=eq.${selRest.name}`},
        ()=>{
          supabase.from("reservations").select("table_label,date,time,status")
            .eq("restaurant_name",selRest.name).gte("date",today)
            .neq("status","ləğv edildi").then(({data:rv})=>setAllRevs(rv||[]));
        })
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  },[selRest]);

  // ── Tarix dəyişdikdə seçimləri sıfırla ──────────────────
  useEffect(()=>{ if(selDate){ setSelTime(""); } },[selDate]);

  const getSlotStatus=time=>{
    const total=dbTables.length||1;
    const booked=allRevs.filter(r=>r.date===selDate&&r.time===time).length;
    if(booked>=total) return "busy";
    if(booked>=Math.ceil(total*0.6)) return "few";
    return "free";
  };
  const menuItems=Array.isArray(selRest?.menu_items)?selRest.menu_items:[];
  const categories=[...new Set(menuItems.map(i=>i.cat))];
  const addItem=item=>setCart(p=>({...p,[item.id]:(p[item.id]||0)+1}));
  const removeItem=item=>setCart(p=>{const n={...p};if(n[item.id]>1)n[item.id]--;else delete n[item.id];return n;});
  const cartTotal=menuItems.reduce((s,i)=>s+(cart[i.id]||0)*i.price,0);
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const preview=hoverTable||selTable;
  const stepNum={home:0,table:1,menu:2,datetime:3,success:4}[step]||0;

  const reset=()=>{navigate("/");setSelRest(null);setSelDate("");setSelTime("");setSelTbl(null);setHover(null);setCart({});setGuests(2);setCustName("");setCustPhone("");setSpecialOccasion("");setBkCode("");setSaveErr("");setBkd([]);setSlots({});setAllRevs([]);};

  const submitReservation=async()=>{
    setSaving(true);setSaveErr("");
    const preOrderItems=menuItems.filter(i=>cart[i.id]).map(i=>({name:i.name,qty:cart[i.id],price:i.price}));
    const code=Math.random().toString(36).substr(2,8).toUpperCase();
    const {error}=await supabase.from("reservations").insert({
      name:custName,phone:custPhone,restaurant_name:selRest.name,
      date:selDate,time:selTime,guests,table_label:selTable.label,table_zone:selTable.zone||"",
      status:"gözlənilir",booking_code:code,pre_order_total:cartTotal,pre_order_items:preOrderItems,
      special_occasion:specialOccasion||null,
    });
    setSaving(false);
    if(error){setSaveErr("Xəta baş verdi. Yenidən cəhd edin.");return;}
    setBkCode(code);navigateStep("success");
    // WhatsApp xəbərdarlığı
    const lines=[
      "Salam "+custName+"! 🍽️","",
      "✅ *Rezervasiyanız qeydə alındı*","",
      "🏛️ Restoran: "+selRest.name,
      "📅 Tarix: "+selDate,
      "⏰ Saat: "+selTime,
      "🪑 Masa: "+selTable.label+" · 👥 "+guests+" nəfər",
    ];
    if(cartTotal>0) lines.push("💰 Ön sifariş: "+cartTotal+"₼");
    if(specialOccasion) lines.push("🎉 Xüsusi gün: "+specialOccasion);
    lines.push("","🔑 Kod: *#"+code+"*","","Ləğv etmək üçün sayta daxil olun.");
    sendWA(custPhone, lines.filter(Boolean).join("\n"));
  };
  const searchCancel=async()=>{
    if(!cancelPhone.trim()) return;
    setCLoad(true);setCMsg("");setCL(null);
    const {data,error}=await supabase.from("reservations").select("*").eq("phone",cancelPhone.trim()).neq("status","ləğv edildi").order("date",{ascending:true});
    setCLoad(false);
    if(error||!data||data.length===0) setCMsg("Bu nömrə ilə aktiv rezervasiya tapılmadı.");
    else setCL(data);
  };
  const doCancel=async id=>{
    await supabase.from("reservations").update({status:"ləğv edildi"}).eq("id",id);
    setCL(prev=>prev?prev.filter(r=>r.id!==id):[]);setCMsg("Rezervasiya ləğv edildi ✓");
  };

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}body{background:#eef3f8;}
    input,select,textarea{font-family:'Inter',system-ui,sans-serif;}
    input[type="date"]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer;}
    .card{transition:box-shadow .2s,transform .2s;}.card:hover{box-shadow:0 8px 32px rgba(0,0,0,.1);transform:translateY(-3px);}
    .btnp{transition:all .18s;}.btnp:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);}
    .tsvg{transition:transform .18s;}.tsvg:hover{transform:scale(1.07);}
    ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:10px;}
  `;
  const inp={width:"100%",border:"none",background:"transparent",fontSize:".95rem",color:"#12487a",outline:"none"};
  const box={background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",padding:".9rem 1rem",boxShadow:"0 1px 3px rgba(0,0,0,.04)"};
  const lbl={fontSize:".65rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"#94A3B8",marginBottom:".4rem",display:"block"};
  const back={background:"none",border:"1px solid #E2E8F0",color:"#64748B",padding:".5rem 1rem",fontFamily:"inherit",fontSize:".8rem",cursor:"pointer",borderRadius:"8px",marginBottom:"1.5rem",fontWeight:500};

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#eef3f8",minHeight:"100vh",color:"#12487a"}}>
      <style>{css}</style>
      <header style={{background:"#fff",borderBottom:"1px solid #E2E8F0",position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 2rem",height:"60px",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
        <div onClick={reset} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:".6rem"}}>
          <div style={{width:"32px",height:"32px",borderRadius:"8px",background:"#12487a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>🍽️</div>
          <div><div style={{fontWeight:800,fontSize:"1.05rem",letterSpacing:"-.03em"}}>MasaAz</div><div style={{fontSize:".55rem",letterSpacing:".15em",textTransform:"uppercase",color:"#94A3B8",marginTop:"-2px"}}>Rezervasiya</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:".8rem"}}>
          {cartCount>0&&step!=="success"&&<div style={{background:"#e8f2fb",border:"1px solid #a8cce0",borderRadius:"20px",padding:".35rem .9rem",fontSize:".82rem",fontWeight:600,color:"#1a5c8a"}}>🛒 {cartCount} · {cartTotal}₼</div>}
          <button onClick={()=>navigate("/cancel")} style={{background:"none",border:"1px solid #E2E8F0",color:"#64748B",padding:".4rem .9rem",borderRadius:"8px",fontSize:".78rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            Rezervasiyanı ləğv et
          </button>
        </div>
      </header>

      {!["home","success","cancel"].includes(step)&&(
        <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",justifyContent:"center",overflow:"hidden"}}>
          {["Masa Seçimi","Menyu","Məlumatlar"].map((s,i)=>{
            const done=stepNum>i+1,active=stepNum===i+1;
            return (
              <div key={s} style={{display:"flex",alignItems:"center",gap:".3rem",padding:".75rem .8rem",borderBottom:`2px solid ${done?"#1a5c8a":active?"#90bfda":"transparent"}`,flex:1,justifyContent:"center",minWidth:0}}>
                <div style={{width:"20px",height:"20px",borderRadius:"50%",background:done?"#1a5c8a":active?"#e8f2fb":"#F1F5F9",border:`1.5px solid ${done?"#1a5c8a":active?"#12487a":"#E2E8F0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",fontWeight:700,color:done?"#fff":active?"#1a5c8a":"#94A3B8",flexShrink:0}}>{done?"✓":i+1}</div>
                <span style={{fontSize:".65rem",fontWeight:600,letterSpacing:".03em",textTransform:"uppercase",color:done?"#1a5c8a":active?"#0e3d6b":"#94A3B8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s}</span>
              </div>
            );
          })}
        </div>
      )}


      {step==="datetime"&&selRest&&(
        <div style={{maxWidth:"720px",margin:"0 auto",padding:".8rem"}}>
          <button onClick={()=>navigateStep("menu")} style={back}>← Geri (Menyu)</button>

          {/* Seçilmiş masa xülasəsi */}
          <div style={{...box,marginBottom:"1.2rem",display:"flex",gap:"1rem",alignItems:"center",background:"#F0FDF4",border:"1.5px solid #86EFAC"}}>
            <div style={{fontSize:"1.8rem"}}>🪑</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:".95rem",color:"#16A34A"}}>Masa {selTable?.label} seçildi</div>
              <div style={{fontSize:".75rem",color:"#166534"}}>{selRest.name} · {selDate} · ⏰ {selTime} · {selTable?.seats} nəfərlik</div>
            </div>
            <button onClick={()=>navigateStep("table")} style={{background:"none",border:"1px solid #86EFAC",borderRadius:"6px",padding:".3rem .7rem",fontSize:".72rem",color:"#16A34A",cursor:"pointer",fontFamily:"inherit"}}>Dəyiş</button>
          </div>

          <div style={{fontWeight:800,fontSize:"1.3rem",letterSpacing:"-.02em",marginBottom:".3rem"}}>Məlumatlarınız</div>
          <div style={{fontSize:".78rem",color:"#94A3B8",marginBottom:"1.2rem"}}>Rezervasiyanı tamamlamaq üçün doldurun</div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem",marginBottom:"1rem"}}>
            <div style={box}><label style={lbl}>Ad Soyad *</label><input value={custName} onChange={e=>setCustName(e.target.value)} placeholder="Əli Həsənov" style={inp} autoFocus/></div>
            <div style={box}><label style={lbl}>Telefon *</label><input type="tel" value={custPhone} onChange={e=>setCustPhone(e.target.value)} placeholder="+994 50 000 00 00" style={inp}/></div>
          </div>
          <div style={{...box,marginBottom:"1.5rem"}}>
            <label style={lbl}>Qonaq sayı</label>
            <select value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{...inp,cursor:"pointer"}}>
              {[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} nəfər</option>)}
            </select>
          </div>
          <div style={{...box,marginBottom:"1.5rem",border:"1.5px solid #FDE68A",background:"#FFFBEB"}}>
            <label style={{...lbl,color:"#92400E"}}>🎉 Xüsusi gün <span style={{fontWeight:400,color:"#B45309"}}>(istəyə görə)</span></label>
            <select value={specialOccasion} onChange={e=>setSpecialOccasion(e.target.value)} style={{...inp,cursor:"pointer",background:"transparent"}}>
              <option value="">— Yox, adi axşam —</option>
              <option value="🎂 Ad günü">🎂 Ad günü</option>
              <option value="💍 Evlilik ildönümü">💍 Evlilik ildönümü</option>
              <option value="💑 Evlilik təklifi">💑 Evlilik təklifi</option>
              <option value="👶 Körpə şənliyi">👶 Körpə şənliyi</option>
              <option value="🎓 Məzuniyyət">🎓 Məzuniyyət</option>
              <option value="💼 İş görüşü">💼 İş görüşü</option>
              <option value="🥳 Şirkət partisi">🥳 Şirkət partisi</option>
              <option value="🌹 Romantik axşam">🌹 Romantik axşam</option>
            </select>
            {specialOccasion&&<div style={{marginTop:".5rem",fontSize:".78rem",color:"#92400E",fontWeight:600}}>✨ Restoran sizin üçün xüsusi hazırlıq edəcək!</div>}
          </div>

          {saveError&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",padding:".75rem 1rem",marginBottom:"1rem",color:"#DC2626",fontSize:".85rem"}}>{saveError}</div>}

          <button className="btnp" onClick={submitReservation} disabled={!custName.trim()||!custPhone.trim()||saving}
            style={{background:custName&&custPhone?"#12487a":"#E2E8F0",color:custName&&custPhone?"#fff":"#94A3B8",border:"none",padding:".9rem 2rem",fontFamily:"inherit",fontSize:".95rem",fontWeight:700,cursor:custName&&custPhone?"pointer":"not-allowed",borderRadius:"10px"}}>
            {saving?"⏳ Göndərilir...":"✓ Rezervasiyanı Tamamla"}
          </button>
        </div>
      )}

      {step==="table"&&selRest&&(
        <div style={{maxWidth:"960px",margin:"0 auto",padding:".8rem"}}>
          <button onClick={()=>navigate("/")} style={back}>← Geri</button>

          {/* Restoran başlığı */}
          <div style={{display:"flex",alignItems:"center",gap:".9rem",...box,marginBottom:"1rem",flexWrap:"wrap"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"10px",background:`${selRest.accent||"#12487a"}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>{selRest.emoji||"🍽️"}</div>
            <div style={{flex:1,minWidth:"120px"}}>
              <div style={{fontWeight:800,fontSize:"1rem"}}>{selRest.name}</div>
              <div style={{fontSize:".72rem",color:"#94A3B8"}}>{selRest.cuisine} · {selRest.location}</div>
            </div>
            <div style={{fontSize:".75rem",color:"#64748B",textAlign:"right"}}>
              <div style={{fontWeight:600,marginBottom:".2rem"}}>Tarix seçin</div>
              <input type="date" min={today} value={selDate} onChange={e=>setSelDate(e.target.value)}
                style={{border:"1.5px solid #E2E8F0",borderRadius:"8px",padding:".4rem .7rem",fontSize:".82rem",outline:"none",fontFamily:"inherit",cursor:"pointer",color:"#12487a"}}/>
            </div>
          </div>

          {dbTables.length===0?(
            <div style={{background:"#fff",borderRadius:"14px",border:"1px solid #E2E8F0",padding:"3rem",textAlign:"center",color:"#94A3B8"}}>
              <div style={{fontSize:"2rem",marginBottom:".7rem"}}>🪑</div>
              <div style={{fontWeight:600}}>Bu restoran üçün masa əlavə edilməyib</div>
            </div>
          ):(
            <>
              {/* Legenda */}
              <div style={{display:"flex",gap:"1rem",marginBottom:"1rem",flexWrap:"wrap",alignItems:"center"}}>
                {[{bg:"#F0FDF4",bc:"#86EFAC",tc:"#16A34A",l:"🟢 Boş"},{bg:"#e8f2fb",bc:"#12487a",tc:"#1a5c8a",l:"✅ Seçilmiş"},{bg:"#FEF2F2",bc:"#FCA5A5",tc:"#DC2626",l:"🔴 Tam dolu"}].map(s=>(
                  <span key={s.l} style={{fontSize:".75rem",color:s.tc,fontWeight:600,background:s.bg,border:`1px solid ${s.bc}`,borderRadius:"20px",padding:".2rem .7rem"}}>{s.l}</span>
                ))}
              </div>

              {/* Masa kartları — responsive grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:".75rem",marginBottom:"1.2rem"}}>
                {dbTables.map(t=>{
                  const freeSlots = selDate ? getTableFreeSlots(t.label, allRevs, selDate) : ALL_TIME_SLOTS;
                  const isFullyBooked = selDate && freeSlots.length===0;
                  const isSelected=selTable?.id===t.id;
                  const shapeEmoji = t.shape==="round"?"⭕":t.shape==="sofa"?"🛋️":"⬛";
                  return (
                    <div key={t.id}
                      onClick={()=>{ if(!isFullyBooked){ if(isSelected) setSelTbl(null); else setSelTbl(t); }}}
                      style={{
                        background: isSelected?"#e8f2fb":isFullyBooked?"#FEF2F2":"#F0FDF4",
                        border:`2px solid ${isSelected?"#12487a":isFullyBooked?"#FCA5A5":"#86EFAC"}`,
                        borderRadius:"14px",
                        padding:"1rem .75rem",
                        cursor:isFullyBooked?"not-allowed":"pointer",
                        opacity:isFullyBooked?0.7:1,
                        textAlign:"center",
                        transition:"all .15s",
                        position:"relative",
                      }}>
                      {/* shape icon */}
                      <div style={{fontSize:"1.6rem",marginBottom:".3rem"}}>{isFullyBooked?"🔴":isSelected?"✅":"🟢"}</div>
                      <div style={{fontWeight:800,fontSize:"1rem",color:isSelected?"#1a5c8a":isFullyBooked?"#DC2626":"#12487a"}}>
                        Masa {t.label}
                      </div>
                      <div style={{fontSize:".7rem",color:"#64748B",marginTop:".2rem"}}>👥 {t.seats} nəfər</div>
                      {t.zone&&<div style={{fontSize:".65rem",color:"#94A3B8",marginTop:".15rem"}}>📍 {t.zone}</div>}
                      {selDate&&!isFullyBooked&&(
                        <div style={{marginTop:".4rem",background:isSelected?"#a8cce0":"#DCFCE7",borderRadius:"20px",padding:".15rem .5rem",fontSize:".65rem",fontWeight:700,color:isSelected?"#0e3d6b":"#16A34A"}}>
                          {freeSlots.length} boş saat
                        </div>
                      )}
                      {selDate&&isFullyBooked&&(
                        <div style={{marginTop:".4rem",background:"#FEE2E2",borderRadius:"20px",padding:".15rem .5rem",fontSize:".65rem",fontWeight:700,color:"#DC2626"}}>
                          Tam dolu
                        </div>
                      )}
                      {isSelected&&(
                        <div style={{position:"absolute",top:"-6px",right:"-6px",background:"#1a5c8a",color:"#fff",borderRadius:"50%",width:"20px",height:"20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:800}}>✓</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Seçilmiş masanın saat kartı */}
              {selTable&&(()=>{
                const freeSlots = selDate ? getTableFreeSlots(selTable.label, allRevs, selDate) : ALL_TIME_SLOTS;
                return (
                  <div style={{background:"#fff",border:"2px solid #12487a",borderRadius:"14px",padding:"1.2rem",marginBottom:"1.2rem",boxShadow:"0 2px 12px rgba(59,130,246,.1)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:"1rem"}}>🪑 Masa {selTable.label} seçildi</div>
                        {selTable.zone&&<div style={{fontSize:".72rem",color:"#64748B"}}>📍 {selTable.zone} · 👥 {selTable.seats} nəfərlik</div>}
                      </div>
                      <button onClick={()=>setSelTbl(null)} style={{background:"none",border:"1px solid #E2E8F0",borderRadius:"6px",padding:".3rem .7rem",fontSize:".72rem",color:"#94A3B8",cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                    </div>

                    {selTable.img&&<img src={selTable.img} alt={selTable.label} style={{width:"100%",maxHeight:"180px",objectFit:"cover",borderRadius:"10px",marginBottom:"1rem"}} onError={e=>e.target.style.display="none"}/>}

                    {!selDate?(
                      <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:"8px",padding:".75rem 1rem",fontSize:".82rem",color:"#92400E",fontWeight:600}}>
                        ⬆️ Yuxarıdan tarix seçin — boş saatları görəsiniz
                      </div>
                    ):(
                      <>
                        <div style={{fontSize:".72rem",fontWeight:700,color:"#64748B",marginBottom:".6rem",textTransform:"uppercase",letterSpacing:".08em"}}>
                          {selDate} — Boş saatlar ({freeSlots.length})
                        </div>
                        {freeSlots.length===0?(
                          <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",padding:".75rem",fontSize:".82rem",color:"#DC2626",fontWeight:600,textAlign:"center"}}>
                            Bu gün bu masa tamamilə doludur
                          </div>
                        ):(
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:".4rem"}}>
                            {freeSlots.map(slot=>(
                              <button key={slot} onClick={()=>setSelTime(slot)}
                                style={{padding:".55rem .4rem",background:selTime===slot?"#12487a":"#F8FAFC",color:selTime===slot?"#fff":"#12487a",border:`1.5px solid ${selTime===slot?"#12487a":"#E2E8F0"}`,borderRadius:"8px",fontSize:".82rem",fontWeight:selTime===slot?700:500,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Heç masa seçilməyibsə ipucu */}
              {!selTable&&(
                <div style={{background:"#eef3f8",border:"1.5px dashed #CBD5E1",borderRadius:"12px",padding:"1.2rem",textAlign:"center",color:"#94A3B8",marginBottom:"1.2rem"}}>
                  <div style={{fontSize:"1.5rem",marginBottom:".4rem"}}>👆</div>
                  <div style={{fontWeight:600,marginBottom:".2rem"}}>Masaya basın</div>
                  <div style={{fontSize:".8rem"}}>{selDate?"Boş masaları yuxarıda görə bilərsiniz":"Əvvəlcə tarix seçin, sonra masa seçin"}</div>
                </div>
              )}

              <button className="btnp" onClick={()=>navigateStep("menu")} disabled={!selTable||!selTime||!selDate}
                style={{background:selTable&&selTime&&selDate?"#12487a":"#E2E8F0",color:selTable&&selTime&&selDate?"#fff":"#94A3B8",border:"none",padding:".9rem 2rem",fontFamily:"inherit",fontSize:".95rem",fontWeight:700,cursor:selTable&&selTime&&selDate?"pointer":"not-allowed",borderRadius:"10px",width:"100%"}}>
                Davam et — Menyu →
              </button>
            </>
          )}
        </div>
      )}

      {step==="menu"&&selRest&&selTable&&(
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"1rem"}}>
          <button onClick={()=>navigateStep("table")} style={back}>← Geri (Masa seçimi)</button>
          <div style={{fontWeight:800,fontSize:"1.5rem",letterSpacing:"-.02em",marginBottom:".3rem"}}>Əvvəlcədən sifariş</div>
          <div style={{fontSize:".75rem",color:"#94A3B8",marginBottom:"1.8rem"}}>Gəlincə hazır olsun (istəyə görə)</div>
          {menuItems.length===0?(
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",textAlign:"center",padding:"2rem",marginBottom:"1.5rem"}}><div style={{fontSize:"1.5rem",marginBottom:".5rem"}}>🍽️</div><div style={{color:"#94A3B8"}}>Bu restoran üçün menyu əlavə edilməyib</div></div>
          ):(
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",overflow:"hidden",marginBottom:"1.5rem"}}>
              {categories.map((cat,ci)=>(
                <div key={cat}>
                  {ci>0&&<div style={{height:"1px",background:"#F1F5F9"}}/>}
                  <div style={{padding:".7rem 1.2rem",background:"#eef3f8",fontSize:".62rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#94A3B8"}}>{cat}</div>
                  {menuItems.filter(i=>i.cat===cat).map((item,idx,arr)=>(
                    <div key={item.id||idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".9rem 1.2rem",borderBottom:idx<arr.length-1?"1px solid #F1F5F9":"none",background:cart[item.id]?"#F0F9FF":"#fff"}}>
                      <div style={{display:"flex",alignItems:"center",gap:".8rem"}}>
                        <span style={{fontSize:"1.3rem"}}>{item.emoji||"🍽️"}</span>
                        <div><div style={{fontWeight:600,fontSize:".92rem"}}>{item.name}</div><div style={{fontSize:".72rem",color:"#94A3B8"}}>{item.desc}</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:".8rem"}}>
                        <span style={{fontWeight:700,fontSize:".9rem"}}>{item.price}₼</span>
                        <div style={{display:"flex",alignItems:"center",gap:".4rem"}}>
                          <button onClick={()=>removeItem(item)} style={{width:"28px",height:"28px",background:"#F1F5F9",border:"1px solid #E2E8F0",color:"#475569",cursor:"pointer",borderRadius:"7px",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                          <span style={{minWidth:"20px",textAlign:"center",fontWeight:700,fontSize:".9rem",color:cart[item.id]?"#1a5c8a":"#CBD5E1"}}>{cart[item.id]||0}</span>
                          <button onClick={()=>addItem(item)} style={{width:"28px",height:"28px",background:"#e8f2fb",border:"1px solid #a8cce0",color:"#1a5c8a",cursor:"pointer",borderRadius:"7px",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",padding:"1.2rem",marginBottom:"1.5rem"}}>
            <div style={{fontSize:".65rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#94A3B8",marginBottom:".9rem"}}>Rezervasiya xülasəsi</div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:".4rem 1rem",fontSize:".875rem"}}>
              {[["Ad",custName],["Telefon",custPhone],["Restoran",selRest.name],["Tarix",selDate],["Saat",selTime],["Masa",`${selTable.label} (${selTable.seats} nf)`],["Qonaqlar",`${guests} nəfər`]].map(([k,v])=>(
                <Fragment key={k}><span style={{color:"#94A3B8"}}>{k}:</span><span style={{fontWeight:600}}>{v}</span></Fragment>
              ))}
              {cartCount>0&&<Fragment><span style={{color:"#94A3B8"}}>Ön sifariş:</span><span style={{fontWeight:700,color:"#1a5c8a"}}>{cartTotal}₼</span></Fragment>}
            </div>
          </div>
          {saveError&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",padding:".75rem 1rem",marginBottom:"1rem",color:"#DC2626",fontSize:".85rem"}}>{saveError}</div>}
          <div style={{display:"flex",gap:".8rem",flexWrap:"wrap"}}>
            <button className="btnp" onClick={()=>navigateStep("datetime")} style={{background:"#12487a",color:"#fff",border:"none",padding:".9rem 1.8rem",fontFamily:"inherit",fontSize:".92rem",fontWeight:700,cursor:"pointer",borderRadius:"10px"}}>
              Davam et — Məlumatlar →
            </button>
            <button onClick={()=>navigateStep("datetime")} style={{background:"none",border:"1px solid #E2E8F0",color:"#64748B",padding:".9rem 1.3rem",fontFamily:"inherit",fontSize:".85rem",cursor:"pointer",borderRadius:"10px",fontWeight:500}}>Sifariş olmadan keç</button>
          </div>
        </div>
      )}

      {step==="success"&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"70vh",padding:"3rem 2rem",textAlign:"center"}}>
          <div style={{width:"72px",height:"72px",borderRadius:"50%",background:"#F0FDF4",border:"2px solid #86EFAC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",marginBottom:"1.2rem"}}>✓</div>
          <div style={{fontSize:"1.8rem",fontWeight:800,letterSpacing:"-.02em",marginBottom:".4rem"}}>Rezervasiya Təsdiqləndi!</div>
          <div style={{color:"#64748B",marginBottom:"1rem"}}>Kod: <span style={{fontWeight:700,color:"#12487a",background:"#F1F5F9",padding:".2rem .6rem",borderRadius:"6px",fontSize:"1.1rem"}}>#{bookingCode}</span></div>
          <div style={{background:"#fff",border:"2px solid #E2E8F0",borderRadius:"16px",padding:"1.2rem",marginBottom:"1rem",display:"inline-block"}}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("MASAAZ:"+bookingCode)}&bgcolor=ffffff&color=0f172a&margin=8`} alt="QR" style={{width:"180px",height:"180px",borderRadius:"8px",display:"block"}}/>
            <div style={{marginTop:".6rem",fontSize:".72rem",color:"#94A3B8"}}>Restoranda bu QR-i göstərin</div>
          </div>
          <div style={{background:"#e8f2fb",border:"1px solid #a8cce0",borderRadius:"10px",padding:".65rem 1.2rem",marginBottom:"1.2rem",fontSize:".8rem",color:"#0e3d6b",fontWeight:500}}>📱 Ekran görüntüsü çəkin — restoranda oxudacaqlar</div>
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",padding:"1.4rem 1.8rem",marginBottom:"1.5rem",textAlign:"left",minWidth:"300px"}}>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:".5rem 1rem",fontSize:".875rem"}}>
              {[["Ad",custName],["Telefon",custPhone],["Restoran",selRest?.name],["Tarix",selDate],["Saat",selTime],["Masa",selTable?.label],["Qonaqlar",`${guests} nəfər`]].map(([k,v])=>(
                <Fragment key={k}><span style={{color:"#94A3B8"}}>{k}:</span><span style={{fontWeight:600}}>{v}</span></Fragment>
              ))}
              {cartTotal>0&&<Fragment><span style={{color:"#94A3B8"}}>Ön sifariş:</span><span style={{fontWeight:700,color:"#1a5c8a"}}>{cartTotal}₼</span></Fragment>}
              {specialOccasion&&<Fragment><span style={{color:"#94A3B8"}}>Xüsusi gün:</span><span style={{fontWeight:700,color:"#D97706"}}>{specialOccasion}</span></Fragment>}
            </div>
          </div>
          {specialOccasion&&<div style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:"10px",padding:".75rem 1.2rem",marginBottom:"1rem",fontSize:".85rem",color:"#92400E",fontWeight:600}}>🎊 Xüsusi gününüz münasibətilə restoran xüsusi hazırlıq edəcək!</div>}
          <a href={"/review?code="+bookingCode} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",background:"#FFFBEB",border:"1px solid #FDE047",borderRadius:"10px",padding:".75rem 1.5rem",marginBottom:"1rem",color:"#92400E",textDecoration:"none",fontSize:".85rem",fontWeight:600}}>⭐ Rəyinizi bildirin — 30 saniyə çəkir</a>
          <button className="btnp" onClick={reset} style={{background:"#12487a",color:"#fff",border:"none",padding:".9rem 2rem",fontFamily:"inherit",fontSize:".92rem",fontWeight:700,cursor:"pointer",borderRadius:"10px"}}>Yeni Rezervasiya</button>
        </div>
      )}
    </div>
  );
}
