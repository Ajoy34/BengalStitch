'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = ['printing', 'shipping', 'marketing', 'salary', 'misc'];

export default function ExpensesPage() {
  const supabase = createClient();
  interface Expense { id: string; category: string; amount: number; description: string; date: string; created_at: string }
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({ category: 'misc', amount: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('expenses').select('*').order('date', { ascending: false }).then(({ data }) => setExpenses(data || []));
  }, [supabase]);

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('expenses').insert({
      admin_id: user?.id,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description,
      date: new Date().toISOString().split('T')[0],
    }).select().single();

    if (!error && data) setExpenses((prev) => [data, ...prev]);
    setForm({ category: 'misc', amount: '', description: '' });
    setSaving(false);
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Expenses</h1>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold">Expense Log</h2>
            <span className="text-sm font-semibold text-red-600">Total: ৳ {total.toLocaleString()}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium capitalize">{exp.category}</p>
                  <p className="text-xs text-gray-400">{exp.description || 'No description'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">- ৳ {Number(exp.amount).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{exp.date}</p>
                </div>
              </div>
            ))}
            {expenses.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">No expenses</div>}
          </div>
        </div>

        <form onSubmit={addExpense} className="bg-white rounded-2xl p-6 border border-gray-100 h-fit space-y-4">
          <h2 className="font-bold">Add Expense</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm capitalize">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Amount (৳)</label>
            <input type="number" required min="0" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
          </div>
          <button type="submit" disabled={saving} className="w-full gradient-cta py-3 rounded-xl font-semibold disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}
