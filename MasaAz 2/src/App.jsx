import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jhyaiuvubbrtngvyoyhi.supabase.co";
const SUPABASE_KEY = "sb_publishable_-AK2kMXWLWYqhA7V5GoW_w_tuFg-B1W";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const timeSlots = ["12:00","13:00","14:00","15:00","18:00","19:00","20:00","21:00","22:00"];

function TableSVG({ shape, label, seats, isBooked, isSelected, isHovered }) {
  const tF = isBooked?"#FEE2E2":isSelected?"#EFF6FF":isHovered?"#F8FAFC":"#F1F5F9";
  const tB = isBooked?"#FCA5A5":isSelected?"#3B82F6":isHovered?"#94A3B8":"#CBD5E1";
  const cF = isBooked?"#FECACA":isSelected?"#BFDBFE":"#E2E8F0";
  const cB = isBooked?"#FCA5A5":isSelected?"#93C5FD":"#CBD5E1";
  const lC = isBooked?"#DC2626":isSelected?"#2563EB":"#475569";
  const sC = isBooked?"#EF4444":isSelected?"#3B82F6":"#94A3B8";
  if(shape==="round") return(
    <svg width="68" height="76" viewBox="0 0 68 76" style={{display:"block"}}>
      <rect x="16" y="1"  width="36" height="14" rx="7" fill={cF} stroke={cB} strokeWidth="1.2"/>
      <rect x="16" y="61" width="36" height="14" rx="7" fill={cF} stroke={cB} strokeWidth="1.2"/>
      <circle cx="34" cy="38" r="22" fill={tF} stroke={tB} strokeWidth="1.5"/>
      <text x="34" y="35" textAnchor="middle" fill={lC} fontSize="9"   fontWeight="700" fontFamily="system-ui,sans-serif">{label}</text>
      <text x="34" y="46" textAnchor="middle" fill={sC} fontSize="6.5"                  fontFamily="system-ui,sans-serif">{seats} nf</text>
    </svg>
  );
  if(shape==="rect") return(
    <svg width="96" height="82" viewBox="0 0 96 82" style={{display:"block"}}>
      <rect x="5"  y="1"  width="24" height="13" rx="6.5" fill={cF} stroke={cB} strokeWidth="1.2"/>
      <rect x="67" y="1"  width="24" height="13" rx="6.5" fill={cF} stroke={cB} strokeWidth="1.2"/>
      <rect x="5"  y="68" width="24" height="13" rx="6.5" fill={cF} stroke={cB} strokeWidth="1.2"/>
      <rect x="67" y="68" width="24" height="13" rx="6.5" fill={cF} stroke={cB} strokeWidth="1.2"/>
      <rect x="3" y="16" width="90" height="50" rx="8" fill={tF} stroke={tB} strokeWidth="1.5"/>
      <text x="48" y="39" textAnchor="middle" fill={lC} fontSize="9.5" fontWeight="700" fontFamily="system-ui,sans-serif">{label}</text>
      <text x="48" y="51" textAnchor="middle" fill={sC} fontSize="7"                   fontFamily="system-ui,sans-serif">{seats} nəfər</text>
    </svg>
  );
  if(shape==="rect6") return(
    <svg width="114" height="82" viewBox="0 0 114 82" style={{display:"block"}}>
      {[4,45,86].map((x,i)=><rect key={i} x={x} y="1"  width="24" height="13" rx="6.5" fill={cF} stroke={cB} strokeWidth="1.2"/>)}
      {[4,45,86].map((x,i)=><rect key={i} x={x} y="68" width="24" height="13" rx="6.5" fill={cF} stroke={cB} strokeWidth="1.2"/>)}
      <rect x="3" y="16" width="108" height="50" rx="8" fill={tF} stroke={tB} strokeWidth="1.5"/>
      <text x="57" y="39" textAnchor="middle" fill={lC} fontSize="9.5" fontWeight="700" fontFamily="system-ui,sans-serif">{label}</text>
      <text x="57" y="51" textAnchor="middle" fill={sC} fontSize="7"                   fontFamily="system-ui,sans-serif">{seats} nəfər</text>
    </svg>
  );
  if(shape==="vip") return(
    <svg width="150" height="88" viewBox="0 0 150 88" style={{display:"block"}}>
      {[4,43,82,121].map((x,i)=><rect key={i} x={x} y="1"  width="24" height="13" rx="6.5" fill={isSelected?"#FEF9C3":"#FEF3C7"} stroke={isSelected?"#FCD34D":"#FDE68A"} strokeWidth="1.2"/>)}
      {[4,43,82,121].map((x,i)=><rect key={i} x={x} y="74" width="24" height="13" rx="6.5" fill={isSelected?"#FEF9C3":"#FEF3C7"} stroke={isSelected?"#FCD34D":"#FDE68A"} strokeWidth="1.2"/>)}
      <rect x="3" y="16" width="144" height="56" rx="10" fill={isSelected?"#FFFBEB":"#FFFDF5"} stroke={isSelected?"#F59E0B":"#FDE68A"} strokeWidth="1.5"/>
      <rect x="40" y="27" width="70" height="20" rx="10" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1"/>
      <text x="75" y="41" textAnchor="middle" fill="#92400E" fontSize="9"  fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2">VIP</text>
      <text x="75" y="58" textAnchor="middle" fill="#A16207" fontSize="7"  fontFamily="system-ui,sans-serif">{seats} nəfər</text>
    </svg>
  );
  return null;
}

export default function App() {
  const [step,setStep]                   = useState("home");
  const [restaurants,setRestaurants]     = useState([]);
  const [selectedRestaurant,setSR]       = useState(null);
  const [tables,setTables]               = useState([]); // cari restoranın masaları
  const [selectedDate,setSelectedDate]   = useState("");
  const [selectedTime,setSelectedTime]   = useState("");
  const [selectedTable,setSelectedTable] = useState(null);
  const [hoveredTable,setHoveredTable]   = useState(null);
  const [cart,setCart]                   = useState({});
  const [guests,setGuests]               = useState(2);
  const [customerName,setCustomerName]   = useState("");
  const [customerPhone,setCustomerPhone] = useState("");
  const [bookingCode,setBookingCode]     = useState("");
  const [saving,setSaving]               = useState(false);
  const [saveError,setSaveError]         = useState("");
  const [activeRes,setActiveRes]         = useState([]);
  const [loadingRest,setLoadingRest]     = useState(true);
  // Cancel
  const [showCancel,setShowCancel]       = useState(false);
  const [cancelPhone,setCancelPhone]     = useState("");
  const [cancelMatches,setCancelMatches] = useState([]);
  const [cancelLoading,setCancelLoading] = useState(false);
  const [cancelMsg,setCancelMsg]         = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Restoranları Supabase-dən yüklə
  useEffect(()=>{
    supabase.from("restaurants").select("*").eq("available",true).order("name")
      .then(({data})=>{ setRestaurants(data||[]); setLoadingRest(false); });
  },[]);

  // Restoran seçildikdə onun masalarını yüklə
  useEffect(()=>{
    if(!selectedRestaurant) { setTables([]); return; }
    supabase.from("tables").select("*").eq("restaurant_id",selectedRestaurant.id).order("label")
      .then(({data})=>setTables(data||[]));
  },[selectedRestaurant]);

  // Real-time masa dolulugu
  useEffect(()=>{
    if(!selectedDate||!selectedRestaurant) { setActiveRes([]); return; }
    const fetch = async () => {
      const {data} = await supabase.from("reservations").select("table_label,time,status")
        .eq("restaurant_name",selectedRestaurant.name).eq("date",selectedDate).neq("status","ləğv edildi");
      setActiveRes(data||[]);
    };
    fetch();
    const ch = supabase.channel("avail_ch")
      .on("postgres_changes",{event:"*",schema:"public",table:"reservations"},fetch)
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  },[selectedDate,selectedRestaurant]);

  const isTableBooked = (label) => selectedTime ? activeRes.some(r=>r.table_label===label&&r.time===selectedTime) : false;

  const getTimeStatus = (time) => {
    if(!selectedDate||!selectedRestaurant) return "free";
    const booked = activeRes.filter(r=>r.time===time).length;
    const total  = tables.length||1;
    const ratio  = booked/total;
    if(ratio>=1) return "busy"; if(ratio>=0.5) return "few"; return "free";
  };

  const menuItems  = selectedRestaurant?.menu_items || [];
  const addToCart  = (item) => setCart(p=>({...p,[item.id]:(p[item.id]||0)+1}));
  const remCart    = (item) => setCart(p=>{const n={...p};if(n[item.id]>1)n[item.id]--;else delete n[item.id];return n;});
  const cartTotal  = menuItems.reduce((s,i)=>s+(cart[i.id]||0)*i.price,0);
  const cartCount  = Object.values(cart).reduce((a,b)=>a+b,0);
  const categories = [...new Set(menuItems.map(i=>i.cat))];
  const stepNum    = {home:0,datetime:1,table:2,menu:3,success:4}[step]||0;
  const stepNames  = ["Restoran","Tarix & Saat","Masa","Menyu"];
  const preview    = hoveredTable||selectedTable;

  const reset = () => {
    setStep("home"); setSR(null); setTables([]); setSelectedDate(""); setSelectedTime("");
    setSelectedTable(null); setHoveredTable(null); setCart({}); setGuests(2);
    setCustomerName(""); setCustomerPhone(""); setBookingCode(""); setSaveError("");
    setActiveRes([]); setShowCancel(false); setCancelPhone(""); setCancelMatches([]); setCancelMsg("");
  };

  const submitReservation = async () => {
    setSaving(true); setSaveError("");
    const code = Math.random().toString(36).substr(2,8).toUpperCase();
    const preOrderItems = menuItems.filter(i=>cart[i.id]).map(i=>({name:i.name,qty:cart[i.id],price:i.price}));
    const {error} = await supabase.from("reservations").insert({
      name:customerName, phone:customerPhone, restaurant_name:selectedRestaurant.name,
      date:selectedDate, time:selectedTime, guests,
      table_label:selectedTable.label, table_zone:selectedTable.zone,
      status:"gözlənilir", pre_order_total:cartTotal, pre_order_items:preOrderItems,
      booking_code:code,
    });
    setSaving(false);
    if(error){setSaveError("Xəta: "+error.message);return;}
    setBookingCode(code); setStep("success");
  };

  const searchCancel = async () => {
    if(!cancelPhone.trim()) return;
    setCancelLoading(true); setCancelMsg("");
    const {data} = await supabase.from("reservations").select("*")
      .eq("phone",cancelPhone.trim()).neq("status","ləğv edildi").order("created_at",{ascending:false});
    setCancelLoading(false);
    if(!data||data.length===0){setCancelMsg("Bu nömrə ilə aktiv rezervasiya tapılmadı.");setCancelMatches([]);}
    else setCancelMatches(data);
  };

  const doCancel = async (id) => {
    setCancelLoading(true);
    await supabase.from("reservations").update({status:"ləğv edildi"}).eq("id",id);
    setCancelLoading(false);
    setCancelMatches(p=>p.filter(r=>r.id!==id));
    setCancelMsg("Rezervasiya uğurla ləğv edildi ✓");
  };

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#F8FAFC;}
    input,select{font-family:'Inter',system-ui,sans-serif;}
    input[type="date"]::-webkit-calendar-picker-indicator{opacity:0.5;cursor:pointer;}
    .card{transition:box-shadow .2s,transform .2s;}
    .card:hover{box-shadow:0 8px 32px rgba(0,0,0,.1);transform:translateY(-3px);}
    .btn-p{transition:all .18s;}
    .btn-p:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);}
    .t-svg{transition:transform .18s;}
    .t-svg:hover{transform:scale(1.07);}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:#F1F5F9;}
    ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:10px;}
  `;

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#F8FAFC",minHeight:"100vh",color:"#0F172A"}}>
      <style>{css}</style>

      {/* HEADER */}
      <header style={{background:"#fff",borderBottom:"1px solid #E2E8F0",position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 2rem",height:"60px",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
        <div onClick={reset} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"0.6rem"}}>
          <div style={{width:"32px",height:"32px",borderRadius:"8px",background:"#0F172A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>🍽️</div>
          <div>
            <div style={{fontWeight:800,fontSize:"1.05rem",letterSpacing:"-0.03em"}}>MasaAz</div>
            <div style={{fontSize:"0.55rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#94A3B8",marginTop:"-2px"}}>Rezervasiya</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"0.8rem",alignItems:"center"}}>
          {cartCount>0&&step!=="success"&&(
            <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:"20px",padding:"0.35rem 0.9rem",fontSize:"0.82rem",fontWeight:600,color:"#2563EB"}}>🛒 {cartCount} · {cartTotal}₼</div>
          )}
          {step==="home"&&(
            <button onClick={()=>setShowCancel(p=>!p)} style={{background:"none",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"0.4rem 0.9rem",fontSize:"0.78rem",fontWeight:600,color:"#64748B",cursor:"pointer"}}>
              {showCancel?"✕ Bağla":"Rezervi ləğv et"}
            </button>
          )}
        </div>
      </header>

      {/* ADDIM BAR */}
      {step!=="home"&&step!=="success"&&(
        <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",justifyContent:"center"}}>
          {stepNames.map((s,i)=>{
            const done=stepNum>i+1; const active=stepNum===i+1;
            return(
              <div key={s} style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.9rem 1.5rem",borderBottom:`2px solid ${done?"#2563EB":active?"#93C5FD":"transparent"}`}}>
                <div style={{width:"20px",height:"20px",borderRadius:"50%",background:done?"#2563EB":active?"#EFF6FF":"#F1F5F9",border:`1.5px solid ${done?"#2563EB":active?"#3B82F6":"#E2E8F0"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",fontWeight:700,color:done?"#fff":active?"#2563EB":"#94A3B8"}}>
                  {done?"✓":i+1}
                </div>
                <span style={{fontSize:"0.72rem",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",color:done?"#2563EB":active?"#1E40AF":"#94A3B8"}}>{s}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* LƏĞV PANELİ */}
      {step==="home"&&showCancel&&(
        <div style={{maxWidth:"500px",margin:"1.5rem auto 0",padding:"0 1rem"}}>
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",padding:"1.4rem",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
            <div style={{fontWeight:700,fontSize:"1rem",marginBottom:"0.3rem"}}>Rezervasiyanı ləğv et</div>
            <div style={{fontSize:"0.75rem",color:"#94A3B8",marginBottom:"1rem"}}>Telefon nömrənizi daxil edin</div>
            <div style={{display:"flex",gap:"0.6rem",marginBottom:"1rem"}}>
              <input value={cancelPhone} onChange={e=>setCancelPhone(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchCancel()}
                placeholder="+994 50 000 00 00" style={{flex:1,border:"1px solid #E2E8F0",borderRadius:"8px",padding:"0.6rem 0.9rem",fontSize:"0.9rem",outline:"none"}}/>
              <button onClick={searchCancel} disabled={cancelLoading} style={{background:"#0F172A",color:"#fff",border:"none",borderRadius:"8px",padding:"0.6rem 1.1rem",fontSize:"0.85rem",fontWeight:700,cursor:"pointer"}}>
                {cancelLoading?"...":"Axtar"}
              </button>
            </div>
            {cancelMsg&&<div style={{padding:"0.65rem 0.9rem",borderRadius:"8px",marginBottom:"0.8rem",fontSize:"0.82rem",fontWeight:500,background:cancelMsg.includes("✓")?"#F0FDF4":"#FEF2F2",color:cancelMsg.includes("✓")?"#16A34A":"#DC2626",border:`1px solid ${cancelMsg.includes("✓")?"#86EFAC":"#FECACA"}`}}>{cancelMsg}</div>}
            {cancelMatches.map(r=>(
              <div key={r.id} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:"10px",padding:"0.9rem",marginBottom:"0.6rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
                  <div><div style={{fontWeight:700,fontSize:"0.9rem"}}>{r.restaurant_name}</div><div style={{fontSize:"0.75rem",color:"#64748B"}}>{r.date} · {r.time} · Masa {r.table_label} · {r.guests} nəfər</div></div>
                  <span style={{fontSize:"0.65rem",padding:"0.2rem 0.5rem",background:"#FEF9C3",color:"#CA8A04",border:"1px solid #FDE047",borderRadius:"20px",fontWeight:600,flexShrink:0,marginLeft:"0.5rem"}}>{r.status}</span>
                </div>
                <button onClick={()=>doCancel(r.id)} disabled={cancelLoading} style={{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:"7px",padding:"0.45rem 0.9rem",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",width:"100%"}}>Bu rezervasiyanı ləğv et</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOME */}
      {step==="home"&&(
        <div>
          <div style={{background:"#0F172A",color:"#fff",padding:"4rem 2rem 3.5rem",textAlign:"center"}}>
            <div style={{display:"inline-block",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:"20px",padding:"0.35rem 1rem",fontSize:"0.7rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#94A3B8",marginBottom:"1.2rem"}}>Bakının ən yaxşı restoranları</div>
            <h1 style={{fontSize:"clamp(2rem,5vw,3.8rem)",fontWeight:800,lineHeight:1.1,letterSpacing:"-0.03em",marginBottom:"1rem",color:"#F8FAFC"}}>Masanızı indi<br/><span style={{color:"#60A5FA"}}>rezerv edin</span></h1>
            <p style={{color:"#94A3B8",fontSize:"1rem",maxWidth:"440px",margin:"0 auto",lineHeight:1.6}}>Restoranı seçin, masanı rezerv edin, menyudan əvvəlcədən sifariş verin.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1.2rem",padding:"2rem",maxWidth:"1200px",margin:"0 auto"}}>
            {loadingRest&&[1,2,3].map(i=>(
              <div key={i} style={{background:"#fff",borderRadius:"14px",height:"200px",border:"1px solid #E2E8F0",animation:"pulse 1.5s ease infinite"}}/>
            ))}
            {restaurants.map(r=>(
              <div key={r.id} className="card" style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",overflow:"hidden",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}
                onClick={()=>{setSR(r);setStep("datetime");}}>
                <div style={{height:"5px",background:r.accent||"#3B82F6"}}/>
                <div style={{padding:"1.4rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
                    <div style={{width:"48px",height:"48px",borderRadius:"12px",background:`${r.accent||"#3B82F6"}15`,border:`1px solid ${r.accent||"#3B82F6"}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"}}>{r.emoji||"🍽️"}</div>
                    <span style={{fontSize:"0.72rem",color:"#94A3B8",fontWeight:500}}>{r.price_range}</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:"1.2rem",marginBottom:"0.2rem"}}>{r.name}</div>
                  <div style={{fontSize:"0.72rem",color:"#94A3B8",marginBottom:"0.8rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>{r.cuisine}</div>
                  <div style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.4rem"}}>
                    <span style={{color:"#F59E0B"}}>★</span><span style={{fontWeight:700,fontSize:"0.9rem"}}>{r.rating}</span>
                  </div>
                  <div style={{fontSize:"0.76rem",color:"#64748B",marginBottom:"1rem"}}>📍 {r.location}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginBottom:"1.1rem"}}>
                    {(r.tags||[]).map(t=><span key={t} style={{fontSize:"0.65rem",padding:"0.2rem 0.55rem",borderRadius:"20px",background:`${r.accent||"#3B82F6"}10`,color:r.accent||"#3B82F6",border:`1px solid ${r.accent||"#3B82F6"}25`,fontWeight:500}}>{t}</span>)}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0.65rem",borderRadius:"8px",background:"#0F172A",color:"#fff",fontSize:"0.82rem",fontWeight:600}}>Rezervasiya et →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TARİX & SAAT */}
      {step==="datetime"&&selectedRestaurant&&(
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"2rem"}}>
          <button onClick={()=>setStep("home")} style={{background:"none",border:"1px solid #E2E8F0",color:"#64748B",padding:"0.5rem 1rem",fontFamily:"inherit",fontSize:"0.8rem",cursor:"pointer",borderRadius:"8px",marginBottom:"1.5rem",fontWeight:500}}>← Geri</button>
          <div style={{display:"flex",alignItems:"center",gap:"0.9rem",background:"#fff",border:"1px solid #E2E8F0",borderRadius:"12px",padding:"1rem 1.2rem",marginBottom:"1.8rem"}}>
            <div style={{width:"42px",height:"42px",borderRadius:"10px",background:`${selectedRestaurant.accent||"#3B82F6"}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>{selectedRestaurant.emoji||"🍽️"}</div>
            <div><div style={{fontWeight:700,fontSize:"1rem"}}>{selectedRestaurant.name}</div><div style={{fontSize:"0.72rem",color:"#94A3B8"}}>{selectedRestaurant.cuisine} · {selectedRestaurant.location}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
            {[{label:"Ad Soyad",val:customerName,set:setCustomerName,ph:"Əli Həsənov",type:"text"},{label:"Telefon",val:customerPhone,set:setCustomerPhone,ph:"+994 50 000 00 00",type:"tel"}].map(f=>(
              <div key={f.label} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",padding:"0.9rem 1rem"}}>
                <div style={{fontSize:"0.65rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#94A3B8",marginBottom:"0.4rem"}}>{f.label}</div>
                <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",border:"none",background:"transparent",fontSize:"0.95rem",color:"#0F172A",outline:"none"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"}}>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",padding:"0.9rem 1rem"}}>
              <div style={{fontSize:"0.65rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#94A3B8",marginBottom:"0.4rem"}}>Tarix seçin</div>
              <input type="date" min={today} value={selectedDate} onChange={e=>{setSelectedDate(e.target.value);setSelectedTime("");setSelectedTable(null);}} style={{width:"100%",border:"none",background:"transparent",fontSize:"0.95rem",color:"#0F172A",outline:"none",cursor:"pointer"}}/>
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",padding:"0.9rem 1rem"}}>
              <div style={{fontSize:"0.65rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#94A3B8",marginBottom:"0.4rem"}}>Qonaq sayı</div>
              <select value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{width:"100%",border:"none",background:"transparent",fontSize:"0.95rem",color:"#0F172A",outline:"none",cursor:"pointer"}}>
                {[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} nəfər</option>)}
              </select>
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"12px",padding:"1.2rem",marginBottom:"1.8rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
              <div style={{fontSize:"0.65rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#94A3B8"}}>Saat seçin</div>
              <div style={{display:"flex",gap:"0.9rem"}}>
                {[{c:"#22C55E",l:"Boş"},{c:"#F59E0B",l:"Az yer"},{c:"#EF4444",l:"Dolu"}].map(s=>(
                  <span key={s.l} style={{display:"flex",alignItems:"center",gap:"0.3rem",fontSize:"0.65rem",color:"#64748B"}}>
                    <span style={{width:"7px",height:"7px",borderRadius:"50%",background:s.c,display:"inline-block"}}/>{s.l}
                  </span>
                ))}
              </div>
            </div>
            {!selectedDate
              ?<div style={{color:"#94A3B8",fontSize:"0.82rem",textAlign:"center",padding:"1rem"}}>Əvvəlcə tarix seçin</div>
              :<div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
                {timeSlots.map(time=>{
                  const status=getTimeStatus(time); const sel=selectedTime===time; const busy=status==="busy";
                  const dc=status==="free"?"#22C55E":status==="few"?"#F59E0B":"#EF4444";
                  return(
                    <button key={time} disabled={busy} onClick={()=>!busy&&(setSelectedTime(time),setSelectedTable(null))}
                      style={{padding:"0.6rem 0.9rem",minWidth:"72px",background:sel?"#0F172A":busy?"#F8FAFC":"#fff",border:`1.5px solid ${sel?"#0F172A":"#E2E8F0"}`,color:sel?"#fff":busy?"#CBD5E1":"#0F172A",cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",fontSize:"0.88rem",fontWeight:sel?700:500,borderRadius:"8px",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.22rem",transition:"all .15s"}}>
                      <span>{time}</span>
                      <span style={{display:"flex",alignItems:"center",gap:"0.2rem",fontSize:"0.52rem",color:sel?"rgba(255,255,255,.7)":dc}}>
                        <span style={{width:"5px",height:"5px",borderRadius:"50%",background:sel?"rgba(255,255,255,.6)":dc,display:"inline-block"}}/>
                        {status==="free"?"Boş":status==="few"?"Az yer":"Dolu"}
                      </span>
                    </button>
                  );
                })}
              </div>
            }
          </div>
          <button onClick={()=>setStep("table")} disabled={!selectedDate||!selectedTime||!customerName} className="btn-p"
            style={{background:selectedDate&&selectedTime&&customerName?"#0F172A":"#E2E8F0",color:selectedDate&&selectedTime&&customerName?"#fff":"#94A3B8",border:"none",padding:"0.9rem 2rem",fontFamily:"inherit",fontSize:"0.95rem",fontWeight:700,cursor:selectedDate&&selectedTime&&customerName?"pointer":"not-allowed",borderRadius:"10px"}}>
            Masa Seç →
          </button>
        </div>
      )}

      {/* MASA — FIX: overflow:hidden + sabit hündürlük */}
      {step==="table"&&(
        <div style={{maxWidth:"880px",margin:"0 auto",padding:"2rem"}}>
          <button onClick={()=>setStep("datetime")} style={{background:"none",border:"1px solid #E2E8F0",color:"#64748B",padding:"0.5rem 1rem",fontFamily:"inherit",fontSize:"0.8rem",cursor:"pointer",borderRadius:"8px",marginBottom:"1.5rem",fontWeight:500}}>← Geri</button>
          <div style={{fontWeight:800,fontSize:"1.5rem",letterSpacing:"-0.02em",marginBottom:"0.3rem"}}>Masanı seçin</div>
          <div style={{fontSize:"0.75rem",color:"#94A3B8",marginBottom:"1.2rem"}}>{selectedRestaurant.name} · {selectedDate} · {selectedTime} · {guests} nəfər</div>
          <div style={{display:"flex",gap:"1.2rem",marginBottom:"1rem"}}>
            {[{bg:"#F1F5F9",bc:"#CBD5E1",l:"Boş"},{bg:"#EFF6FF",bc:"#3B82F6",l:"Seçilmiş"},{bg:"#FEF2F2",bc:"#FCA5A5",l:"Tutulmuş (real-time)"}].map(s=>(
              <span key={s.l} style={{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.7rem",color:"#64748B",fontWeight:500}}>
                <span style={{width:"13px",height:"13px",background:s.bg,border:`1.5px solid ${s.bc}`,display:"inline-block",borderRadius:"3px"}}/>{s.l}
              </span>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",overflow:"hidden",marginBottom:"1.5rem"}}>
            {/* DÜZƏLIŞ: position:relative + sabit hündürlük (paddingBottom əvəzinə) */}
            <div style={{position:"relative",width:"100%",height:"420px",background:"linear-gradient(135deg,#F8FAFC,#F1F5F9)",overflow:"hidden"}}>
              {tables.length===0&&(
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#94A3B8",fontSize:"0.9rem"}}>Bu restoran üçün masa tapılmadı</div>
              )}
              {tables.map(t=>{
                const booked=isTableBooked(t.label); const sel=selectedTable?.id===t.id; const hov=hoveredTable?.id===t.id;
                return(
                  <div key={t.id} className="t-svg"
                    style={{position:"absolute",left:`${t.x}%`,top:`${t.y}%`,cursor:booked?"not-allowed":"pointer",opacity:booked?0.85:1,userSelect:"none"}}
                    onClick={()=>!booked&&setSelectedTable(sel?null:t)}
                    onMouseEnter={()=>setHoveredTable(t)}
                    onMouseLeave={()=>setHoveredTable(null)}>
                    <TableSVG shape={t.shape} label={t.label} seats={t.seats} isBooked={booked} isSelected={sel} isHovered={hov&&!booked}/>
                  </div>
                );
              })}
            </div>
            {/* Preview panel — ayrıca, planın altında */}
            {preview&&(
              <div style={{padding:"1rem 1.4rem",borderTop:"1px solid #F1F5F9",display:"flex",alignItems:"center",gap:"1rem",background:"#fff"}}>
                {preview.img_url&&<img src={preview.img_url} alt={preview.label} style={{width:"70px",height:"50px",borderRadius:"8px",objectFit:"cover",flexShrink:0}}/>}
                <div>
                  <div style={{fontWeight:700,fontSize:"0.9rem",marginBottom:"0.1rem"}}>Masa {preview.label} — {preview.zone}</div>
                  <div style={{fontSize:"0.7rem",color:"#64748B"}}>{preview.seats} nəfərlik
                    {isTableBooked(preview.label)&&<span style={{marginLeft:"0.5rem",color:"#DC2626",fontWeight:600}}>· Bu saat tutulmuşdur</span>}
                  </div>
                </div>
                {selectedTable?.id===preview.id&&<div style={{marginLeft:"auto",color:"#2563EB",fontWeight:700,fontSize:"0.82rem"}}>✓ Seçildi</div>}
              </div>
            )}
          </div>
          <button onClick={()=>setStep("menu")} disabled={!selectedTable} className="btn-p"
            style={{background:selectedTable?"#0F172A":"#E2E8F0",color:selectedTable?"#fff":"#94A3B8",border:"none",padding:"0.9rem 2rem",fontFamily:"inherit",fontSize:"0.95rem",fontWeight:700,cursor:selectedTable?"pointer":"not-allowed",borderRadius:"10px"}}>
            Menyuya keç →
          </button>
        </div>
      )}

      {/* MENYU */}
      {step==="menu"&&(
        <div style={{maxWidth:"720px",margin:"0 auto",padding:"2rem"}}>
          <button onClick={()=>setStep("table")} style={{background:"none",border:"1px solid #E2E8F0",color:"#64748B",padding:"0.5rem 1rem",fontFamily:"inherit",fontSize:"0.8rem",cursor:"pointer",borderRadius:"8px",marginBottom:"1.5rem",fontWeight:500}}>← Geri</button>
          <div style={{fontWeight:800,fontSize:"1.5rem",letterSpacing:"-0.02em",marginBottom:"0.3rem"}}>Əvvəlcədən sifariş</div>
          <div style={{fontSize:"0.75rem",color:"#94A3B8",marginBottom:"1.8rem"}}>Gəlincə hazır olsun</div>
          {menuItems.length===0
            ?<div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",padding:"2rem",textAlign:"center",color:"#94A3B8",marginBottom:"1.5rem"}}>Bu restoran üçün menyu hələ əlavə edilməyib</div>
            :<div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",overflow:"hidden",marginBottom:"1.5rem"}}>
              {categories.map((cat,ci)=>(
                <div key={cat}>
                  {ci>0&&<div style={{height:"1px",background:"#F1F5F9"}}/>}
                  <div style={{padding:"0.7rem 1.2rem",background:"#F8FAFC",fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#94A3B8"}}>{cat}</div>
                  {menuItems.filter(i=>i.cat===cat).map((item,idx,arr)=>(
                    <div key={item.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.9rem 1.2rem",borderBottom:idx<arr.length-1?"1px solid #F1F5F9":"none",background:cart[item.id]?"#F0F9FF":"#fff",transition:"background .15s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.8rem"}}>
                        <span style={{fontSize:"1.3rem"}}>{item.emoji||"🍽️"}</span>
                        <div><div style={{fontWeight:600,fontSize:"0.92rem"}}>{item.name}</div><div style={{fontSize:"0.72rem",color:"#94A3B8"}}>{item.desc}</div></div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"0.8rem"}}>
                        <span style={{fontWeight:700,fontSize:"0.9rem"}}>{item.price}₼</span>
                        <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
                          <button onClick={()=>remCart(item)} style={{width:"28px",height:"28px",background:"#F1F5F9",border:"1px solid #E2E8F0",color:"#475569",cursor:"pointer",borderRadius:"7px",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                          <span style={{minWidth:"20px",textAlign:"center",fontWeight:700,fontSize:"0.9rem",color:cart[item.id]?"#2563EB":"#CBD5E1"}}>{cart[item.id]||0}</span>
                          <button onClick={()=>addToCart(item)} style={{width:"28px",height:"28px",background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#2563EB",cursor:"pointer",borderRadius:"7px",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          }
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",padding:"1.2rem",marginBottom:"1.5rem"}}>
            <div style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#94A3B8",marginBottom:"0.9rem"}}>Rezervasiya xülasəsi</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",fontSize:"0.875rem"}}>
              {[["Ad",customerName],["Telefon",customerPhone],["Restoran",selectedRestaurant.name],["Tarix",selectedDate],["Saat",selectedTime],["Masa",`${selectedTable?.label} (${selectedTable?.seats} nf)`],["Qonaqlar",`${guests} nəfər`]].map(([k,v])=>(
                <React.Fragment key={k}><span style={{color:"#94A3B8"}}>{k}:</span><span style={{fontWeight:600}}>{v}</span></React.Fragment>
              ))}
              {cartCount>0&&<React.Fragment><span style={{color:"#94A3B8"}}>Ön sifariş ({cartCount}):</span><span style={{fontWeight:700,color:"#2563EB"}}>{cartTotal}₼</span></React.Fragment>}
            </div>
          </div>
          {saveError&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"8px",padding:"0.75rem 1rem",marginBottom:"1rem",color:"#DC2626",fontSize:"0.85rem"}}>{saveError}</div>}
          <div style={{display:"flex",gap:"0.8rem",flexWrap:"wrap"}}>
            <button onClick={submitReservation} disabled={saving} className="btn-p"
              style={{background:saving?"#94A3B8":"#0F172A",color:"#fff",border:"none",padding:"0.9rem 1.8rem",fontFamily:"inherit",fontSize:"0.92rem",fontWeight:700,cursor:saving?"not-allowed":"pointer",borderRadius:"10px"}}>
              {saving?"⏳ Göndərilir...":"✓ Rezervasiyanı Tamamla"}
            </button>
            {cartCount===0&&!saving&&(
              <button onClick={submitReservation} style={{background:"none",border:"1px solid #E2E8F0",color:"#64748B",padding:"0.9rem 1.3rem",fontFamily:"inherit",fontSize:"0.85rem",cursor:"pointer",borderRadius:"10px",fontWeight:500}}>Sifariş olmadan davam et</button>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {step==="success"&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"70vh",padding:"3rem 2rem",textAlign:"center"}}>
          <div style={{width:"72px",height:"72px",borderRadius:"50%",background:"#F0FDF4",border:"2px solid #86EFAC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",marginBottom:"1.2rem"}}>✓</div>
          <div style={{fontSize:"1.8rem",fontWeight:800,letterSpacing:"-0.02em",marginBottom:"0.4rem"}}>Rezervasiya Təsdiqləndi!</div>
          <div style={{color:"#64748B",marginBottom:"2rem"}}>Nömrəniz: <span style={{fontWeight:700,color:"#0F172A",background:"#F1F5F9",padding:"0.2rem 0.6rem",borderRadius:"6px"}}>#{bookingCode}</span></div>
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"14px",padding:"1.4rem 1.8rem",marginBottom:"1rem",textAlign:"left",minWidth:"300px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",fontSize:"0.875rem"}}>
              {[["Ad",customerName],["Telefon",customerPhone],["Restoran",selectedRestaurant?.name],["Tarix",selectedDate],["Saat",selectedTime],["Masa",selectedTable?.label],["Qonaqlar",`${guests} nəfər`]].map(([k,v])=>(
                <React.Fragment key={k}><span style={{color:"#94A3B8"}}>{k}:</span><span style={{fontWeight:600}}>{v}</span></React.Fragment>
              ))}
              {cartTotal>0&&<React.Fragment><span style={{color:"#94A3B8"}}>Ön sifariş:</span><span style={{fontWeight:700,color:"#2563EB"}}>{cartTotal}₼</span></React.Fragment>}
            </div>
          </div>
          <div style={{color:"#94A3B8",fontSize:"0.78rem",marginBottom:"2rem"}}>Rezervi ləğv etmək üçün ana səhifədə "Rezervi ləğv et" düyməsini istifadə edin</div>
          <button onClick={reset} className="btn-p" style={{background:"#0F172A",color:"#fff",border:"none",padding:"0.9rem 2rem",fontFamily:"inherit",fontSize:"0.92rem",fontWeight:700,cursor:"pointer",borderRadius:"10px"}}>Yeni Rezervasiya</button>
        </div>
      )}
    </div>
  );
}
