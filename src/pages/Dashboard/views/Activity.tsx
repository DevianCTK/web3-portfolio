import { useToast } from '../../../components/ui/Toast';
import './Activity.scss';

export default function Activity() {
  const { showToast } = useToast();
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
            <div className="actions">
              <button className="btn-action" onClick={() => showToast('Filter applied: showing all transactions', 'info')}>
                <span className="material-symbols-outlined">filter_list</span>
                <span>Filter</span>
              </button>
              <button className="btn-action" onClick={() => showToast('Transaction history exported as CSV', 'success')}>
                <span className="material-symbols-outlined">download</span>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Transaction Table Container */}
          <div className="table-container">
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
                {/* Row 1: Receive */}
                <tr className="table-row group">
                  <td className="col-date">
                    <div className="date-time">
                      <span className="date">Oct 24, 2023</span>
                      <span className="time">14:22:10 PM</span>
                    </div>
                  </td>
                  <td className="col-action">
                    <span className="action-badge receive">
                      <span className="material-symbols-outlined">south_west</span>
                      <span>Receive</span>
                    </span>
                  </td>
                  <td className="col-asset">
                    <div className="asset-info">
                      <div className="icon eth">
                        <span className="material-symbols-outlined">currency_bitcoin</span>
                      </div>
                      <span className="name">Ethereum (ETH)</span>
                    </div>
                  </td>
                  <td className="col-amount">
                    <div className="amount-info">
                      <span className="value positive">+1.450 ETH</span>
                      <span className="fiat">≈ $2,642.12</span>
                    </div>
                  </td>
                  <td className="col-status">
                    <span className="status-badge completed">
                      <span className="dot"></span>
                      <span>Completed</span>
                    </span>
                  </td>
                  <td className="col-link text-right">
                    <button className="material-symbols-outlined icon-link" onClick={() => showToast('Opening transaction on Etherscan...', 'info')}>open_in_new</button>
                  </td>
                </tr>

                {/* Row 2: Swap */}
                <tr className="table-row group">
                  <td className="col-date">
                    <div className="date-time">
                      <span className="date">Oct 23, 2023</span>
                      <span className="time">09:45:02 AM</span>
                    </div>
                  </td>
                  <td className="col-action">
                    <span className="action-badge swap">
                      <span className="material-symbols-outlined">sync_alt</span>
                      <span>Swap</span>
                    </span>
                  </td>
                  <td className="col-asset">
                    <div className="asset-info">
                      <div className="swap-icons">
                        <div className="icon bnb"></div>
                        <div className="icon usdc"></div>
                      </div>
                      <span className="name">BNB → USDC</span>
                    </div>
                  </td>
                  <td className="col-amount">
                    <div className="amount-info">
                      <span className="value">500.00 USDC</span>
                      <span className="fiat">Gas: $4.12</span>
                    </div>
                  </td>
                  <td className="col-status">
                    <span className="status-badge pending">
                      <span className="dot animate-pulse"></span>
                      <span>Pending</span>
                    </span>
                  </td>
                  <td className="col-link text-right">
                    <button className="material-symbols-outlined icon-link" onClick={() => showToast('Opening transaction on Etherscan...', 'info')}>open_in_new</button>
                  </td>
                </tr>

                {/* Row 3: Send */}
                <tr className="table-row group">
                  <td className="col-date">
                    <div className="date-time">
                      <span className="date">Oct 21, 2023</span>
                      <span className="time">22:15:54 PM</span>
                    </div>
                  </td>
                  <td className="col-action">
                    <span className="action-badge send">
                      <span className="material-symbols-outlined">north_east</span>
                      <span>Send</span>
                    </span>
                  </td>
                  <td className="col-asset">
                    <div className="asset-info">
                      <div className="icon btc">
                        <span className="material-symbols-outlined">currency_bitcoin</span>
                      </div>
                      <span className="name">Bitcoin (BTC)</span>
                    </div>
                  </td>
                  <td className="col-amount">
                    <div className="amount-info">
                      <span className="value negative">-0.042 BTC</span>
                      <span className="fiat">≈ $1,440.00</span>
                    </div>
                  </td>
                  <td className="col-status">
                    <span className="status-badge failed">
                      <span className="dot"></span>
                      <span>Failed</span>
                    </span>
                  </td>
                  <td className="col-link text-right">
                    <button className="material-symbols-outlined icon-link" onClick={() => showToast('Opening transaction on Etherscan...', 'info')}>open_in_new</button>
                  </td>
                </tr>

                {/* Row 4: Receive */}
                <tr className="table-row group">
                  <td className="col-date">
                    <div className="date-time">
                      <span className="date">Oct 19, 2023</span>
                      <span className="time">11:04:12 AM</span>
                    </div>
                  </td>
                  <td className="col-action">
                    <span className="action-badge receive">
                      <span className="material-symbols-outlined">south_west</span>
                      <span>Receive</span>
                    </span>
                  </td>
                  <td className="col-asset">
                    <div className="asset-info">
                      <div className="icon arb">
                        <span className="material-symbols-outlined">token</span>
                      </div>
                      <span className="name">Arbitrum (ARB)</span>
                    </div>
                  </td>
                  <td className="col-amount">
                    <div className="amount-info">
                      <span className="value positive">+2,500 ARB</span>
                      <span className="fiat">≈ $2,125.00</span>
                    </div>
                  </td>
                  <td className="col-status">
                    <span className="status-badge completed">
                      <span className="dot"></span>
                      <span>Completed</span>
                    </span>
                  </td>
                  <td className="col-link text-right">
                    <button className="material-symbols-outlined icon-link" onClick={() => showToast('Opening transaction on Etherscan...', 'info')}>open_in_new</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination/Load More */}
          <div className="pagination">
            <button className="btn-load-more group" onClick={() => showToast('No more transactions to load', 'info')}>
              <span className="text">View Older Transactions</span>
              <span className="material-symbols-outlined icon">keyboard_double_arrow_down</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer / Metadata Detail */}
      <footer className="activity-footer">
        <div className="footer-left">
          <div className="sync-status">
            <span className="dot"></span>
            <span className="text">Nodes Syncing</span>
          </div>
          <span className="separator">/</span>
          <span className="block-height">Block Height: 18,442,109</span>
        </div>
        <div className="last-refreshed">
          Last refreshed: 2 minutes ago
        </div>
      </footer>

      {/* Floating Tooltip Placeholder */}
      <div className="floating-tooltip">
        <span className="material-symbols-outlined icon">bolt</span>
        <div className="tooltip-content">
          <span className="title">Gas Optimization Active</span>
          <span className="desc">Suggesting low-fee time windows.</span>
        </div>
      </div>
    </div>
  );
}
