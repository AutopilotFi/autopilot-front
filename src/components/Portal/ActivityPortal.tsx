"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Address } from 'viem';
import { useWallet } from '@/providers/WalletProvider';
import { fetchIporUserBalanceHistories, type PlasmaUserBalanceHistory } from '@/lib/subgraph/ipor';

type ChainId = 1 | 137 | 324 | 8453 | 42161;

export function ActivityPortal({ vaultAddress, chainId, open, onClose }: { vaultAddress: Address; chainId: ChainId; open: boolean; onClose: () => void }) {
  const { account } = useWallet();
  const [events, setEvents] = useState<PlasmaUserBalanceHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!account?.address || !open) return;
      setLoading(true);
      try {
        const ev = await fetchIporUserBalanceHistories(chainId, vaultAddress, account.address);
        if (mounted) setEvents(ev);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [account?.address, chainId, open, vaultAddress]);

  if (!open) return null;
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#0d1117', color: '#c9d1d9', borderRadius: 12, padding: 16, width: 'min(720px, 95vw)', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Your Activity</h3>
          <button onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>
        {loading ? <p>Loading…</p> : (
          <ul style={{ marginTop: 12 }}>
            {events.map((e, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px dashed #30363d' }}>
                <span style={{ minWidth: 140, opacity: 0.8 }}>{new Date((e.timestamp || 0) * 1000).toLocaleString()}</span>
                <span style={{ minWidth: 100, textTransform: 'capitalize' }}>{e.action || 'event'}</span>
                <span style={{ flex: 1, textAlign: 'right', fontFamily: 'monospace' }}>{e.amount || e.assets || '0'}</span>
                {e.tx && <a href={`https://basescan.org/tx/${e.tx}`} target="_blank" rel="noreferrer" style={{ marginLeft: 8, opacity: 0.7 }}>tx</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
}
