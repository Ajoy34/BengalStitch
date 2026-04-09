'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const STATUSES = ['pending', 'confirmed', 'printing', 'shipped', 'delivered', 'cancelled'];

interface Props {
  orderId: string;
  currentStatus: string;
}

export function AdminOrderActions({ orderId, currentStatus }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(newStatus: string) {
    setSaving(true);
    setStatus(newStatus);
    await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      disabled={saving}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary capitalize"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
