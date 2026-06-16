'use client';

import { useState } from 'react';

type Props = { initialUpiId: string };

export default function AdminUPISettings({ initialUpiId }: Props) {
  const [upiId, setUpiId] = useState(initialUpiId);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'UPI_ID', value: upiId })
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || 'Unable to save UPI ID');
      } else {
        setMessage('UPI ID saved successfully.');
      }
    } catch (error) {
      setMessage('Server error saving UPI ID.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">UPI Settings</h2>
          <p className="text-sm text-neutral-400">Change the checkout UPI ID used for manual payments.</p>
        </div>
      </div>
      {message && <div className="mb-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}
      <label className="space-y-2 text-sm">
        <span>UPI ID</span>
        <input value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" placeholder="example@upi" />
      </label>
      <button type="button" onClick={save} disabled={saving} className="btn-primary mt-4 px-5 py-2.5 disabled:opacity-50">
        {saving ? 'Saving...' : 'Save UPI ID'}
      </button>
    </div>
  );
}
