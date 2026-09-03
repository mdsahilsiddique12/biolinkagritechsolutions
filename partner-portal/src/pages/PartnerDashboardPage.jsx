import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerAuth } from '../context/PartnerAuthContext';
import { api } from '../lib/api';
import {
  Users, ShoppingCart, Truck, DollarSign, TrendingUp, Clock,
  Copy, CheckCircle, AlertCircle, LogOut, Lock,
  Handshake, BarChart3, FileText, User,
} from 'lucide-react';
import './PartnerDashboardPage.css';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className={`pdb-stat-card ${accent ? `pdb-stat-card--${accent}` : ''}`}>
      <div className="pdb-stat-icon">
        <Icon size={20} />
      </div>
      <div className="pdb-stat-info">
        <span className="pdb-stat-value">{value}</span>
        <span className="pdb-stat-label">{label}</span>
      </div>
    </div>
  );
}

export default function PartnerDashboardPage() {
  const { partner, partnerLogout } = usePartnerAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Password change form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!partner) {
      navigate('/login', { replace: true });
      return;
    }
    loadData();
  }, [partner]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashData, profData] = await Promise.all([
        api.getPartnerDashboard(),
        api.getPartnerProfile(),
      ]);
      setDashboard(dashData);
      setProfile(profData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReferrals = async () => {
    try {
      const data = await api.getPartnerReferrals();
      setReferrals(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCommissions = async () => {
    try {
      const data = await api.getPartnerCommissions();
      setCommissions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'referrals' && referrals.length === 0) loadReferrals();
    if (tab === 'commissions' && commissions.length === 0) loadCommissions();
  };

  const copyLink = () => {
    const code = profile?.referralCodes?.[0]?.code || partner?.codes?.[0] || '';
    if (!code) return;
    navigator.clipboard.writeText(`https://biolinkagri.in/institutional?ref=${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMsg({ type: '', text: '' });
    try {
      await api.changePartnerPassword(pwForm);
      setPwMsg({ type: 'success', text: 'Password updated successfully.' });
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    partnerLogout();
    navigate('/login');
  };

  const fmt = (n) => {
    if (n == null) return '—';
    return `₹${Number(n).toLocaleString('en-IN')}`;
  };

  if (!partner) return null;

  const mainCode = profile?.referralCodes?.[0]?.code || partner?.codes?.[0] || '';

  return (
    <main className="pdb-page">
      {/* Header Bar */}
      <header className="pdb-header">
        <div className="pdb-header__left">
          <Handshake size={22} className="pdb-header__icon" />
          <div>
            <h1 className="pdb-header__title">{partner.name}</h1>
            <span className="pdb-header__badge">{partner.partnerType?.replace('_', ' ')}</span>
          </div>
        </div>
        <div className="pdb-header__right">
          {mainCode && (
            <button className="pdb-copy-btn" onClick={copyLink} title="Copy referral link">
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : mainCode}</span>
            </button>
          )}
          <button className="pdb-logout-btn" onClick={handleLogout}>
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="pdb-tabs">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'referrals', label: 'Referrals', icon: Users },
          { id: 'commissions', label: 'Commissions', icon: FileText },
          { id: 'profile', label: 'Profile', icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pdb-tab ${activeTab === tab.id ? 'pdb-tab--active' : ''}`}
          >
            <tab.icon size={15} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {error && (
        <div className="pdb-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      <div className="pdb-content">
        {loading ? (
          <div className="pdb-loading">
            <div className="pdb-spinner" />
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* ══ Overview Tab ══ */}
            {activeTab === 'overview' && dashboard && (
              <section className="pdb-overview">
                <div className="pdb-stats-grid">
                  <StatCard icon={Users} label="Total Referred Farmers" value={dashboard.totalFarmers} accent="emerald" />
                  <StatCard icon={Users} label="Active Farmers" value={dashboard.activeFarmers} accent="blue" />
                  <StatCard icon={ShoppingCart} label="Total Orders" value={dashboard.totalOrders} />
                  <StatCard icon={Truck} label="Total Quantity" value={`${dashboard.totalMT} MT`} />
                  <StatCard icon={DollarSign} label="Gross Sales" value={fmt(dashboard.grossSales)} accent="emerald" />
                  <StatCard icon={DollarSign} label="Farmer Discounts" value={fmt(dashboard.totalDiscounts)} />
                  <StatCard icon={TrendingUp} label="Eligible Commission" value={fmt(dashboard.eligibleCommission)} accent="gold" />
                  <StatCard icon={Clock} label="Pending Commission" value={fmt(dashboard.pendingCommission)} accent="amber" />
                  <StatCard icon={CheckCircle} label="Paid Commission" value={fmt(dashboard.paidCommission)} accent="emerald" />
                </div>

                {mainCode && (
                  <div className="pdb-referral-link-card">
                    <h3>Your Referral Link</h3>
                    <p>Share this link with farmers. When they book through it, you're automatically credited.</p>
                    <div className="pdb-link-row">
                      <code>https://biolinkagri.in/institutional?ref={mainCode}</code>
                      <button onClick={copyLink} className="pdb-copy-inline">
                        {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ══ Referrals Tab ══ */}
            {activeTab === 'referrals' && (
              <section className="pdb-referrals">
                <h2>Referred Farmers</h2>
                {referrals.length === 0 ? (
                  <p className="pdb-empty">No referrals yet. Share your referral link to get started.</p>
                ) : (
                  <div className="pdb-table-wrap">
                    <table className="pdb-table">
                      <thead>
                        <tr>
                          <th>Farmer</th>
                          <th>Mobile</th>
                          <th>Date Referred</th>
                          <th>Source</th>
                          <th>Orders</th>
                          <th>MT</th>
                          <th>Revenue</th>
                          <th>Commission</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((r) => (
                          <tr key={r.id}>
                            <td className="pdb-td-name">{r.farmerName || '—'}</td>
                            <td>{r.farmerMobile}</td>
                            <td>{r.attributedAt ? new Date(r.attributedAt).toLocaleDateString('en-IN') : '—'}</td>
                            <td><span className="pdb-badge">{r.attributionSource}</span></td>
                            <td>{r.totalOrders}</td>
                            <td>{r.totalMT}</td>
                            <td>{fmt(r.totalRevenue)}</td>
                            <td>{fmt(r.totalCommission)}</td>
                            <td>
                              <span className={`pdb-status pdb-status--${r.status}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* ══ Commissions Tab ══ */}
            {activeTab === 'commissions' && (
              <section className="pdb-commissions">
                <h2>Commission Ledger</h2>
                {commissions.length === 0 ? (
                  <p className="pdb-empty">No commission entries yet.</p>
                ) : (
                  <div className="pdb-table-wrap">
                    <table className="pdb-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Order</th>
                          <th>Qty (MT)</th>
                          <th>Gross</th>
                          <th>Discount</th>
                          <th>Net</th>
                          <th>Rule</th>
                          <th>Commission</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissions.map((c) => (
                          <tr key={c.id}>
                            <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                            <td className="pdb-td-mono">{c.orderNumber || '—'}</td>
                            <td>{c.quantityMT}</td>
                            <td>{fmt(c.grossAmount)}</td>
                            <td>{fmt(c.discountAmount)}</td>
                            <td>{fmt(c.netAmount)}</td>
                            <td className="pdb-td-mono">{c.commissionRule}</td>
                            <td className="pdb-td-highlight">{fmt(c.commissionAmount)}</td>
                            <td>
                              <span className={`pdb-status pdb-status--${c.status}`}>
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* ══ Profile Tab ══ */}
            {activeTab === 'profile' && profile && (
              <section className="pdb-profile">
                <div className="pdb-profile-card">
                  <h2>Partner Profile</h2>
                  <div className="pdb-profile-grid">
                    <div className="pdb-profile-row">
                      <span className="pdb-profile-key">Partner Name</span>
                      <span className="pdb-profile-val">{profile.name}</span>
                    </div>
                    <div className="pdb-profile-row">
                      <span className="pdb-profile-key">Email</span>
                      <span className="pdb-profile-val">{profile.email}</span>
                    </div>
                    <div className="pdb-profile-row">
                      <span className="pdb-profile-key">Company</span>
                      <span className="pdb-profile-val">{profile.company || '—'}</span>
                    </div>
                    <div className="pdb-profile-row">
                      <span className="pdb-profile-key">Partner Type</span>
                      <span className="pdb-profile-val">{profile.partnerType?.replace('_', ' ')}</span>
                    </div>
                    <div className="pdb-profile-row">
                      <span className="pdb-profile-key">Status</span>
                      <span className={`pdb-status pdb-status--${profile.status}`}>{profile.status}</span>
                    </div>
                    {profile.referralCodes?.map((rc) => (
                      <div key={rc.code} className="pdb-profile-row">
                        <span className="pdb-profile-key">Referral Code</span>
                        <span className="pdb-profile-val pdb-td-mono">{rc.code}</span>
                      </div>
                    ))}
                    <div className="pdb-profile-row">
                      <span className="pdb-profile-key">Shareable Link</span>
                      <span className="pdb-profile-val">
                        <code className="pdb-link-code">biolinkagri.in/institutional?ref={mainCode}</code>
                        <button className="pdb-copy-inline" onClick={copyLink} title="Copy link">
                          {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pdb-password-card">
                  <h3>
                    <Lock size={16} />
                    <span>Change Password</span>
                  </h3>
                  <form onSubmit={handlePasswordChange} className="pdb-pw-form">
                    {pwMsg.text && (
                      <div className={`partner-alert partner-alert--${pwMsg.type}`}>
                        {pwMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        <span>{pwMsg.text}</span>
                      </div>
                    )}
                    <input
                      type="password"
                      placeholder="Current password"
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      required
                      minLength={8}
                    />
                    <input
                      type="password"
                      placeholder="New password (min 8 characters)"
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      required
                      minLength={8}
                    />
                    <button type="submit" className="partner-submit-btn" disabled={pwLoading}>
                      {pwLoading ? <span className="partner-spinner" /> : 'Update Password'}
                    </button>
                  </form>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
