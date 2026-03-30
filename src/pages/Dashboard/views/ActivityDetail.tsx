import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../../../hooks/useAppData';
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
                            <div className="value">{tx.asset}</div>
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
