import { useState } from 'react';
import { Save, Info } from 'lucide-react';

const FIELDS = [
  { id: 'income',    label: '💵 Aylıq Gəlir',     color: 'var(--green)',  desc: 'Maaş, əlavə gəlir', group: 'income' },
  { id: 'komunalka', label: '🏠 Ev Komunalka',     color: 'var(--blue)',   desc: 'Su, işıq, qaz, internet', group: 'fixed' },
  { id: 'yol',       label: '🚌 İş Yol Pulu',      color: 'var(--blue)',   desc: 'Avtobus, metro, taksi', group: 'fixed' },
  { id: 'bank',      label: '🏦 Bank Borcu',        color: 'var(--purple)', desc: 'Kredit, borc ödənişi', group: 'fixed' },
  { id: 'arzaq',     label: '🛒 Yemək & Arzaq',    color: 'var(--orange)', desc: 'Bazar, market, bərbər', group: 'variable' },
  { id: 'usaq',      label: '👶 Uşaq Xərcləri',    color: 'var(--pink)',   desc: 'Yemək, paltar, kurslar', group: 'variable' },
];

export default function BudgetSetup({ budget, onSave }) {
  const [form, setForm] = useState({ ...budget });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v === '' ? '' : parseFloat(v) || 0 }));

  const income = form.income || 0;
  const totalFixed = (form.komunalka || 0) + (form.yol || 0) + (form.bank || 0);
  const totalVar = (form.arzaq || 0) + (form.usaq || 0);
  const remaining = income - totalFixed - totalVar;
  const dailyFree = remaining > 0 ? (remaining / 30).toFixed(2) : '0.00';

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const groups = [
    { label: 'Gəlir', key: 'income', color: 'var(--green)' },
    { label: '🔒 Sabit Xərclər', key: 'fixed', color: 'var(--blue)', desc: 'Hər ay dəyişmir' },
    { label: '📊 Dəyişkən Xərclər', key: 'variable', color: 'var(--orange)', desc: 'Azaldıla bilər' },
  ];

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', paddingBottom: 100 }}>
      {/* Live preview */}
      <div style={{
        background: 'linear-gradient(135deg, #0e1f12, #122018)',
        borderRadius: 20, padding: '20px 24px', marginBottom: 20,
        border: '1px solid #3ddc8430'
      }}>
        <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Günlük Sərbəst Limit</p>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, color: remaining >= 0 ? 'var(--green)' : 'var(--red)', lineHeight: 1 }}>
          {dailyFree} <span style={{ fontSize: 20 }}>₼</span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
          <span>Sabit: <strong style={{ color: 'var(--blue)' }}>{totalFixed} ₼</strong></span>
          <span>Dəyişkən: <strong style={{ color: 'var(--orange)' }}>{totalVar} ₼</strong></span>
          <span>Qalır: <strong style={{ color: remaining >= 0 ? 'var(--green)' : 'var(--red)' }}>{remaining.toFixed(2)} ₼</strong></span>
        </div>
      </div>

      {groups.map(group => (
        <div key={group.key} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 18, background: group.color, borderRadius: 2 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{group.label}</span>
            {group.desc && <span style={{ fontSize: 11, color: 'var(--muted)' }}>— {group.desc}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FIELDS.filter(f => f.group === group.key).map(field => (
              <div key={field.id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '14px 16px', border: `1px solid ${field.color}22` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontWeight: 600, fontSize: 14, color: field.color }}>{field.label}</label>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
                    <Info size={11} />{field.desc}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 8, border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form[field.id] === 0 ? '' : form[field.id]}
                    onChange={e => set(field.id, e.target.value)}
                    style={{
                      flex: 1, background: 'none', border: 'none', padding: '11px 14px',
                      fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700,
                      color: 'var(--text)', outline: 'none'
                    }}
                  />
                  <span style={{ padding: '0 14px', fontWeight: 700, color: 'var(--muted)', fontSize: 16 }}>₼</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave} style={{
        width: '100%', padding: '16px', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
        fontWeight: 700, fontSize: 16, letterSpacing: 0.5,
        background: saved ? 'var(--green)' : 'linear-gradient(135deg, var(--green), var(--blue))',
        color: saved ? '#fff' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'all 0.3s'
      }}>
        <Save size={18} />
        {saved ? '✓ Saxlanıldı!' : 'Büdcəni Saxla'}
      </button>
    </div>
  );
}
