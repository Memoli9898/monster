import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Calendar, Zap } from 'lucide-react';

const DAYS = 30;

export default function Dashboard({ budget, expenses, onNav }) {
  const stats = useMemo(() => {
    const income = budget.income || 0;
    const fixed = (budget.komunalka || 0) + (budget.yol || 0) + (budget.bank || 0);
    const variable = (budget.arzaq || 0) + (budget.usaq || 0);
    const totalBudgeted = fixed + variable;

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthExpenses = expenses.filter(e => e.date?.startsWith(thisMonth));
    const spent = monthExpenses.reduce((s, e) => s + (e.amount || 0), 0);

    const remaining = income - totalBudgeted;
    const freeDaily = remaining > 0 ? (remaining / DAYS) : 0;
    const day = now.getDate();
    const expectedSpent = freeDaily * day;
    const overUnder = spent - expectedSpent;

    const savingsPct = income > 0 ? ((remaining / income) * 100) : 0;

    return { income, fixed, variable, totalBudgeted, spent, remaining, freeDaily, overUnder, savingsPct, monthExpenses };
  }, [budget, expenses]);

  const statusColor = stats.remaining < 0 ? 'var(--red)' : stats.remaining < stats.income * 0.1 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', paddingBottom: 100 }}>
      {/* Hero card */}
      <div style={{
        background: 'linear-gradient(135deg, #111a2e 0%, #1a1a2e 60%, #1a1128 100%)',
        borderRadius: 20, padding: '28px 24px', marginBottom: 16,
        border: '1px solid #2a2a4a', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'radial-gradient(circle, #4d9fff15, transparent 70%)', borderRadius: '50%' }} />
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Günlük Sərbəst Limit</p>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 54, fontWeight: 800, color: 'var(--blue)', lineHeight: 1, marginBottom: 4 }}>
          {stats.freeDaily.toFixed(2)}<span style={{ fontSize: 24, fontWeight: 600 }}> ₼</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Aylıq qənaət: <span style={{ color: statusColor, fontWeight: 700 }}>{stats.remaining.toFixed(2)} ₼</span> · {stats.savingsPct.toFixed(1)}%
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Aylıq Gəlir', val: stats.income, color: 'var(--green)', icon: <TrendingUp size={16} /> },
          { label: 'Cəmi Büdcə', val: stats.totalBudgeted, color: 'var(--red)', icon: <TrendingDown size={16} /> },
          { label: 'Bu ay xərcləndi', val: stats.spent, color: 'var(--orange)', icon: <Calendar size={16} /> },
          { label: 'Sabit Xərclər', val: stats.fixed, color: 'var(--purple)', icon: <Zap size={16} /> },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{item.label}</span>
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: item.color }}>
              {item.val.toFixed(2)} <span style={{ fontSize: 12 }}>₼</span>
            </div>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      {stats.income > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px', marginBottom: 16, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Büdcə İstifadəsi</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{((stats.totalBudgeted / stats.income) * 100).toFixed(0)}%</span>
          </div>
          <div style={{ background: '#1e1e2e', borderRadius: 999, height: 10, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min((stats.totalBudgeted / stats.income) * 100, 100)}%`,
              height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg, var(--green), var(--blue))',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
            <span>Xərcləndən: {stats.totalBudgeted.toFixed(0)} ₼</span>
            <span>Qalır: {stats.remaining.toFixed(0)} ₼</span>
          </div>
        </div>
      )}

      {/* No budget warning */}
      {stats.income === 0 && (
        <div style={{ background: '#1a140a', border: '1px solid #ff8c4240', borderRadius: 'var(--radius)', padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <AlertCircle size={20} color="var(--orange)" />
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--orange)' }}>Büdcə qurulmayıb</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Başlamaq üçün Büdcə bölməsinə keç</p>
          </div>
          <button onClick={() => onNav('budget')} style={{ marginLeft: 'auto', background: 'var(--orange)', color: '#000', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
            Qur →
          </button>
        </div>
      )}

      {/* Recent expenses */}
      {stats.monthExpenses.length > 0 && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '18px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Son Xərclər</span>
            <button onClick={() => onNav('expenses')} style={{ background: 'none', color: 'var(--blue)', fontSize: 12, fontWeight: 600 }}>
              Hamısı →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.monthExpenses.slice(-4).reverse().map(exp => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{exp.emoji || '💸'}</span>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 13 }}>{exp.note || exp.category}</p>
                    <p style={{ fontSize: 11, color: 'var(--muted)' }}>{exp.date}</p>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)', fontSize: 15 }}>-{exp.amount} ₼</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
