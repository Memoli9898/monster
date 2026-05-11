import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const CATS = [
  { id: 'yemek',    label: 'Yemək',      emoji: '🍽️', color: 'var(--orange)' },
  { id: 'arzaq',    label: 'Arzaq',      emoji: '🛒', color: 'var(--green)' },
  { id: 'nesil',    label: 'Nəqliyyat',  emoji: '🚌', color: 'var(--blue)' },
  { id: 'saglik',   label: 'Sağlıq',     emoji: '💊', color: 'var(--red)' },
  { id: 'geyim',    label: 'Geyim',      emoji: '👕', color: 'var(--pink)' },
  { id: 'berber',   label: 'Bərbər',     emoji: '✂️', color: 'var(--purple)' },
  { id: 'usaq',     label: 'Uşaq',       emoji: '👶', color: 'var(--pink)' },
  { id: 'eglenche', label: 'Əyləncə',    emoji: '🎮', color: 'var(--yellow)' },
  { id: 'diger',    label: 'Digər',      emoji: '💸', color: 'var(--muted)' },
];

export default function AddExpense({ expenses, onAdd, onDelete }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ category: 'yemek', amount: '', note: '', date: today });
  const [added, setAdded] = useState(false);

  const selCat = CATS.find(c => c.id === form.category);

  const handleAdd = () => {
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    onAdd({
      id: Date.now(),
      category: selCat.label,
      emoji: selCat.emoji,
      amount: parseFloat(form.amount),
      note: form.note,
      date: form.date,
    });
    setForm(f => ({ ...f, amount: '', note: '' }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthExp = expenses.filter(e => e.date?.startsWith(thisMonth));
  const total = monthExp.reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', paddingBottom: 100 }}>
      {/* Total this month */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px 20px', marginBottom: 20, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 3 }}>Bu Ay Əlavə Xərclər</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--red)' }}>{total.toFixed(2)} ₼</p>
        </div>
        <span style={{ fontSize: 36 }}>📊</span>
      </div>

      {/* Category picker */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Kateqoriya</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {CATS.map(cat => (
            <button key={cat.id}
              onClick={() => setForm(f => ({ ...f, category: cat.id }))}
              style={{
                background: form.category === cat.id ? `${cat.color}25` : 'var(--surface)',
                border: `1.5px solid ${form.category === cat.id ? cat.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)', padding: '10px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                transition: 'all 0.2s', color: form.category === cat.id ? cat.color : 'var(--muted)'
              }}>
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount + Note + Date */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px', marginBottom: 16, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Məbləğ</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 8, border: `2px solid ${selCat.color}50`, overflow: 'hidden' }}>
            <span style={{ padding: '0 14px', fontSize: 20 }}>{selCat.emoji}</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              style={{ flex: 1, background: 'none', border: 'none', padding: '13px 0', fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: selCat.color, outline: 'none' }}
            />
            <span style={{ padding: '0 16px', fontWeight: 700, color: 'var(--muted)' }}>₼</span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Qeyd (İstəyə bağlı)</label>
          <input type="text" placeholder="Məs: Çörək, süd, pendir..." value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)' }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Tarix</label>
          <input type="date" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-body)', colorScheme: 'dark' }}
          />
        </div>
      </div>

      <button onClick={handleAdd} style={{
        width: '100%', padding: '15px', borderRadius: 'var(--radius)',
        background: added ? 'var(--green)' : `linear-gradient(135deg, ${selCat.color}, #ff8c42)`,
        color: '#000', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24,
        transition: 'background 0.3s'
      }}>
        <PlusCircle size={18} />
        {added ? '✓ Əlavə edildi!' : 'Xərc Əlavə Et'}
      </button>

      {/* Expense list */}
      {monthExp.length > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px', border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Bu Ayın Xərcləri</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...monthExp].reverse().map(exp => (
              <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{exp.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.note || exp.category}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>{exp.category} · {exp.date}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)', fontSize: 15, flexShrink: 0 }}>-{exp.amount} ₼</span>
                <button onClick={() => onDelete(exp.id)} style={{ background: 'none', color: 'var(--muted)', padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
