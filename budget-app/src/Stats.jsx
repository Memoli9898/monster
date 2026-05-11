import { useMemo } from 'react';

export default function Stats({ expenses, budget }) {
  const income = budget.income || 0;

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthExp = expenses.filter(e => e.date?.startsWith(thisMonth));

  const byCategory = useMemo(() => {
    const map = {};
    monthExp.forEach(e => {
      const k = e.category || 'Digər';
      if (!map[k]) map[k] = { label: k, emoji: e.emoji, total: 0, count: 0 };
      map[k].total += e.amount || 0;
      map[k].count++;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [monthExp]);

  const totalSpent = monthExp.reduce((s, e) => s + (e.amount || 0), 0);
  const budgeted = (budget.arzaq || 0) + (budget.usaq || 0);

  // group expenses by date
  const byDate = useMemo(() => {
    const map = {};
    [...monthExp].reverse().forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [monthExp]);

  const colors = ['var(--orange)', 'var(--blue)', 'var(--pink)', 'var(--purple)', 'var(--green)', 'var(--yellow)'];

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', paddingBottom: 100 }}>
      {/* Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Bu ay xərcləndi', val: totalSpent, color: 'var(--red)' },
          { label: 'Planlaşdırılan', val: budgeted, color: 'var(--blue)' },
          { label: 'Fərq', val: budgeted - totalSpent, color: budgeted - totalSpent >= 0 ? 'var(--green)' : 'var(--red)' },
          { label: 'Əməliyyat sayı', val: monthExp.length, color: 'var(--muted)', noDecimal: true },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: item.color }}>
              {item.noDecimal ? item.val : item.val.toFixed(2)} {!item.noDecimal && '₼'}
            </p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {byCategory.length > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px', marginBottom: 16, border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Kateqoriyaya görə</p>
          {byCategory.map((cat, i) => {
            const pct = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
            const color = colors[i % colors.length];
            return (
              <div key={cat.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{cat.emoji}</span> {cat.label}
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>({cat.count} əməliyyat)</span>
                  </span>
                  <span style={{ fontWeight: 700, color, fontSize: 14 }}>{cat.total.toFixed(2)} ₼</span>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline */}
      {byDate.length > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px', border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Tarix üzrə</p>
          {byDate.map(([date, exps]) => {
            const dayTotal = exps.reduce((s, e) => s + e.amount, 0);
            return (
              <div key={date} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, padding: '0 2px' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{date}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>-{dayTotal.toFixed(2)} ₼</span>
                </div>
                {exps.map(exp => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--surface2)', borderRadius: 8, marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span>{exp.emoji}</span>
                      <span style={{ color: 'var(--text)' }}>{exp.note || exp.category}</span>
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--red)' }}>-{exp.amount} ₼</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {monthExp.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontWeight: 600, fontSize: 16 }}>Bu ay heç bir xərc yoxdur</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Xərc bölməsindən əlavə et</p>
        </div>
      )}
    </div>
  );
}
