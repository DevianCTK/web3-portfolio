import { useAppData } from '../../../hooks/useAppData';
import './Activity.scss';

const ACTION_CONFIG = {
  receive: { icon: 'south_west', className: 'receive', label: 'Receive' },
  send: { icon: 'north_east', className: 'send', label: 'Send' },
  swap: { icon: 'sync_alt', className: 'swap', label: 'Swap' },
} as const;

export default function Activity() {
  const { mode, transactions } = useAppData();

  return (
    <div className="activity-page">
      <section className="activity-content">
        <div className="content-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="title-area">
              <p className="subtitle">Historical Ledger</p>
              <h1 className="title">Activity</h1>
            </div>
          </div>

          {/* Transaction Table Container */}
          <div className="table-container">
            {transactions.length > 0 ? (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Action</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const config = ACTION_CONFIG[tx.action];
                    return (
                      <tr className="table-row group" key={tx.id}>
                        <td className="col-date">
                          <div className="date-time">
                            <span className="date">{tx.date}</span>
                            <span className="time">{tx.time}</span>
                          </div>
                        </td>
                        <td className="col-action">
                          <span className={`action-badge ${config.className}`}>
                            <span className="material-symbols-outlined">{config.icon}</span>
                            <span>{config.label}</span>
                          </span>
                        </td>
                        <td className="col-asset">
                          <div className="asset-info">
                            <div className={`icon ${tx.iconColor}`}>
                              <span className="material-symbols-outlined">
                                {tx.action === 'swap' ? 'sync_alt' : 'token'}
                              </span>
                            </div>
                            <span className="name">{tx.asset}</span>
                          </div>
                        </td>
                        <td className="col-amount">
                          <div className="amount-info">
                            <span className={`value ${tx.amountSign === '+' ? 'positive' : tx.amountSign === '-' ? 'negative' : ''}`}>
                              {tx.amount}
                            </span>
                            <span className="fiat">{tx.fiat}</span>
                          </div>
                        </td>
                        <td className="col-status">
                          <span className={`status-badge ${tx.status}`}>
                            <span className={`dot ${tx.status === 'pending' ? 'animate-pulse' : ''}`}></span>
                            <span>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
                          </span>
                        </td>
                        <td className="col-link text-right">
                          <span className="material-symbols-outlined icon-link" title="View on Etherscan">open_in_new</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
                <span className="material-symbols-outlined text-4xl">receipt_long</span>
                <h3 className="text-lg font-medium">
                  {mode === 'wallet' ? 'No on-chain transaction history' : 'No transactions yet'}
                </h3>
                <p className="text-sm text-gray-400">
                  {mode === 'wallet'
                    ? 'Transaction history requires an indexer integration'
                    : 'Connect your wallet to view activity'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
