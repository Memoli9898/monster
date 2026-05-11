import { useState } from 'react';
import { LayoutDashboard, Settings, PlusSquare, BarChart2 } from 'lucide-react';
import { useLocalStorage } from './useLocalStorage';
import Dashboard from './Dashboard';
import BudgetSetup from './BudgetSetup';
import AddExpense from './AddExpense';
import Stats from './Stats';

const TABS = [
  { id: 'dashboard', label: 'Ana Səhifə', icon: LayoutDashboard },
  { id: 'budget',    label: 'Büdcə',      icon: Settings },
  { id: 'add',       label: 'Xərc',       icon: PlusSquare },
  { id: 'stats',     label: 'Statistika', icon: BarChart2 },
];

const DEFAULT_BUDGET = { income: 0, komunalka: 0, yol: 0, bank: 0, arzaq: 0, usaq: 0 };

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [budget, setBudget] = useLocalStorage('ailə-budget', DEFAULT_BUDGET);
  const [expenses, setExpenses] = useLocalStorage('ailə-expenses', []);

  const addExpense = (exp) => setExpenses(prev => [...prev, exp]);
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const titles = { dashboard: 'Ana Səhifə', budget: 'Büdcə Ayarları', add: 'Xərc Əlavə Et', stats: 'Statistika' };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(9,9,15,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)', padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text)' }}>
            💰 Ailə Büdcəsi
          </h1>
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>{titles[tab]}</p>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--green)', background: 'var(--surface)', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>
          {new Date().toLocaleDateString('az-AZ', { month: 'short', day: 'numeric' })}
        </div>
      </header>

      <main style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
        {tab === 'dashboard' && <Dashboard budget={budget} expenses={expenses} onNav={setTab} />}
        {tab === 'budget'    && <BudgetSetup budget={budget} onSave={setBudget} />}
        {tab === 'add'       && <AddExpense expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />}
        {tab === 'stats'     && <Stats expenses={expenses} budget={budget} />}
      </main>

      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'rgba(17,17,24,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)', padding: '10px 8px 18px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4
      }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: active ? 'var(--surface2)' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '8px 4px', borderRadius: 12, transition: 'all 0.2s',
              color: active ? 'var(--blue)' : 'var(--muted)',
            }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
