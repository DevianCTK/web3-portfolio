import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../../../hooks/useAppData';
import { TOKENS, SWAP_TOKENS, PORTFOLIO_ASSETS } from '../../../data/mockData';
import './Activity.scss';

export default function ActivityDetail() {
    const { txId } = useParams();
    const navigate = useNavigate();
    const { transactions } = useAppData();

    const tx = transactions.find((t) => t.id === txId);

    if (!tx) {
        return (
            <div className="activity-page">
                <section className="activity-content">
                    <div className="content-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <h2>Transaction not found</h2>
                        <p className="text-sm opacity-60">The requested transaction could not be located.</p>
                        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/dashboard/activity')}>Back</button>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="activity-page">
            <section className="activity-content">
                <div className="content-container">
                    <div className="page-header">
                        <div className="title-area">
                            <p className="subtitle">Transaction Detail</p>
                            <h1 className="title">{tx.action.charAt(0).toUpperCase() + tx.action.slice(1)}</h1>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button className="btn-ghost" onClick={() => navigate('/dashboard/activity')}>Back to Activity</button>
                        </div>
                    </div>

                    <div className="tx-detail-card">
                        <div className="row">
                            <div className="label">Date</div>
                            <div className="value">{tx.date} {tx.time}</div>
                        </div>
                        <div className="row">
                            <div className="label">Asset</div>
                            <div className="value" style={{ textAlign: 'right' }}>
                                {/* Render swap-like assets with icons: e.g. [USDC icon] USDC → [ARB icon] ARB */}
                                {(() => {
                                    const parts = tx.asset.split(/\s*→\s*|\s*->\s*/).map(p => p.trim());
                                    const combined = [
                                        ...Object.values(TOKENS),
                                        ...Object.values(SWAP_TOKENS),
                                        ...PORTFOLIO_ASSETS.map(a => ({ symbol: a.ticker, name: a.name, icon: a.icon })),
                                    ];

                                    const renderSegment = (segment: string, key: string) => {
                                        const bySymbol = combined.find(t => t.symbol && t.symbol.toLowerCase() === segment.toLowerCase());
                                        if (bySymbol) {
                                            return (
                                                <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                                    <img src={bySymbol.icon} alt={bySymbol.symbol} style={{ width: 24, height: 24, borderRadius: 9999, objectFit: 'cover' }} />
                                                    <span>{bySymbol.symbol}</span>
                                                </span>
                                            );
                                        }

                                        const byInclusion = combined.find(t => (t.symbol && segment.toLowerCase().includes(t.symbol.toLowerCase())) || (t.name && t.name.toLowerCase().includes(segment.toLowerCase())));
                                        if (byInclusion) {
                                            return (
                                                <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                                    <img src={byInclusion.icon} alt={byInclusion.symbol} style={{ width: 24, height: 24, borderRadius: 9999, objectFit: 'cover' }} />
                                                    <span>{byInclusion.symbol}</span>
                                                </span>
                                            );
                                        }

                                        return <span key={key}>{segment}</span>;
                                    };

                                    return parts.length > 1 ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                            {parts.map((seg, idx) => (
                                                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                    {renderSegment(seg, `seg-${idx}`)}
                                                    {idx < parts.length - 1 && <span style={{ opacity: 0.8 }}>→</span>}
                                                </span>
                                            ))}
                                        </span>
                                    ) : (
                                        renderSegment(parts[0], 'seg-0')
                                    );
                                })()}
                            </div>
                        </div>
                        <div className="row">
                            <div className="label">Amount</div>
                            <div className="value">{tx.amount}</div>
                        </div>
                        <div className="row">
                            <div className="label">Fiat</div>
                            <div className="value">{tx.fiat}</div>
                        </div>
                        <div className="row">
                            <div className="label">Status</div>
                            <div className="value">{tx.status}</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
