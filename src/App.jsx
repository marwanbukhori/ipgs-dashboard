import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BuildingIcon, UsersIcon, UserCheckIcon, DollarIcon, TrendingUpIcon,
  AlertCircleIcon, SearchIcon, RefreshIcon, LayoutDashboardIcon, ListIcon,
  CheckCircleIcon, ClockIcon, XCircleIcon,
} from './icons';
import { API_URL, REFRESH_INTERVAL, NAV_ITEMS, PAYMENT_STATUS_MAP, formatRM, DEMO_DATA } from './constants';

/* ─── Stat Card ─── */

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card-icon">
        <Icon />
      </div>
      <div className="stat-card-body">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {sub && <p className="stat-card-sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Payment Badge ─── */

function PaymentBadge({ status }) {
  const info = PAYMENT_STATUS_MAP[status] || { className: 'badge--default', label: status || '-' };
  return <span className={`badge ${info.className}`}>{info.label}</span>;
}

/* ─── Student Table ─── */

function StudentTable({ students, search }) {
  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(s =>
      s.studentName.toLowerCase().includes(q) ||
      s.programShort.toLowerCase().includes(q) ||
      s.intake.toLowerCase().includes(q) ||
      s.paymentStatus.toLowerCase().includes(q)
    );
  }, [students, search]);

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <SearchIcon />
        <p>No students found matching "{search}"</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Programme</th>
            <th>Intake</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, i) => (
            <tr key={i}>
              <td className="cell-num">{i + 1}</td>
              <td className="cell-name">{s.studentName}</td>
              <td><span className="programme-tag">{s.programShort}</span></td>
              <td>{s.intake}</td>
              <td><PaymentBadge status={s.paymentStatus} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Overview Section ─── */

function OverviewSection({ summary, students }) {
  const paidCount = students.filter(s => s.paymentStatus === 'Paid').length;
  const partialCount = students.filter(s => s.paymentStatus === 'Partial').length;
  const pendingCount = students.filter(s => s.paymentStatus === 'Pending').length;
  const overdueCount = students.filter(s => s.paymentStatus === 'Overdue').length;
  const collectionRate = summary.totalFees > 0 ? ((summary.collected / summary.totalFees) * 100).toFixed(1) : 0;

  return (
    <>
      <div className="stats-grid">
        <StatCard icon={UsersIcon} label="Total Students" value={summary.totalStudents} accent="primary" />
        <StatCard icon={UserCheckIcon} label="Active Students" value={summary.activeStudents} accent="emerald" />
        <StatCard icon={DollarIcon} label="Total Fees" value={formatRM(summary.totalFees)} accent="primary" />
        <StatCard icon={TrendingUpIcon} label="Collected" value={formatRM(summary.collected)} sub={`${collectionRate}% collection rate`} accent="emerald" />
        <StatCard icon={AlertCircleIcon} label="Outstanding" value={formatRM(summary.outstanding)} accent="amber" />
      </div>

      <div className="section-row">
        <div className="card card--inner">
          <div className="inner-card-header">
            <h3>Payment Breakdown</h3>
          </div>
          <div className="inner-card-body">
            <div className="breakdown-list">
              <div className="breakdown-item">
                <div className="breakdown-dot breakdown-dot--paid" />
                <span className="breakdown-label">Paid</span>
                <span className="breakdown-value">{paidCount}</span>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-dot breakdown-dot--partial" />
                <span className="breakdown-label">Partial</span>
                <span className="breakdown-value">{partialCount}</span>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-dot breakdown-dot--pending" />
                <span className="breakdown-label">Pending</span>
                <span className="breakdown-value">{pendingCount}</span>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-dot breakdown-dot--overdue" />
                <span className="breakdown-label">Overdue</span>
                <span className="breakdown-value">{overdueCount}</span>
              </div>
            </div>

            <div className="collection-bar-wrap">
              <div className="collection-bar-labels">
                <span>Collection Progress</span>
                <span>{collectionRate}%</span>
              </div>
              <div className="collection-bar">
                <div className="collection-bar-fill" style={{ width: `${collectionRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card card--inner">
          <div className="inner-card-header">
            <h3>Quick Stats</h3>
          </div>
          <div className="inner-card-body">
            <div className="quick-stats-list">
              <div className="quick-stat-row">
                <div className="quick-stat-icon quick-stat-icon--emerald"><CheckCircleIcon /></div>
                <div>
                  <p className="quick-stat-label">Fully Paid</p>
                  <p className="quick-stat-value">{paidCount} students</p>
                </div>
              </div>
              <div className="quick-stat-row">
                <div className="quick-stat-icon quick-stat-icon--amber"><ClockIcon /></div>
                <div>
                  <p className="quick-stat-label">Pending Payment</p>
                  <p className="quick-stat-value">{pendingCount + partialCount} students</p>
                </div>
              </div>
              <div className="quick-stat-row">
                <div className="quick-stat-icon quick-stat-icon--red"><XCircleIcon /></div>
                <div>
                  <p className="quick-stat-label">Overdue</p>
                  <p className="quick-stat-value">{overdueCount} students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Dashboard ─── */

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNav, setActiveNav] = useState('overview');
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch {
      /* Use demo data if API unreachable */
      if (!data) {
        setData(DEMO_DATA);
        setLastUpdated(new Date());
      }
      setError('Using demo data — API unreachable');
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="container">
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { summary, students } = data;

  return (
    <div className="container">
      <div className="layout">
        {/* Sidebar */}
        <div className="card card--sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo-row">
              <div className="sidebar-logo-icon"><BuildingIcon /></div>
              <div>
                <p className="sidebar-logo-text">Innovative University College</p>
                <p className="sidebar-logo-sub">Institute of Postgraduate Studies</p>
              </div>
            </div>
            <h2 className="sidebar-title">IPGS Dashboard</h2>
            <p className="sidebar-desc">Registrar Management System</p>
          </div>

          <div className="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                className={`nav-item${activeNav === item.key ? ' nav-item--active' : ''}`}
                onClick={() => setActiveNav(item.key)}
              >
                {item.key === 'overview' ? <LayoutDashboardIcon /> : <ListIcon />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            {error && <p className="sidebar-warning">{error}</p>}
            {lastUpdated && (
              <p className="sidebar-updated">
                Last updated: {lastUpdated.toLocaleTimeString('en-MY')}
              </p>
            )}
            <button className="btn btn-outline btn-sm btn-block" onClick={fetchData}>
              <RefreshIcon /> Refresh Data
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="card fade-in" key={activeNav}>
          <div className="main-header">
            <div className="main-header-icon">
              {activeNav === 'overview' ? <LayoutDashboardIcon /> : <ListIcon />}
            </div>
            <div className="main-header-text">
              <h2 className="main-title">
                {activeNav === 'overview' ? 'Dashboard Overview' : 'Student List'}
              </h2>
              <p className="main-desc">
                {activeNav === 'overview'
                  ? 'Real-time summary of student enrolment and fee collection.'
                  : `${students.length} students registered across all programmes.`}
              </p>
            </div>
            {activeNav === 'students' && (
              <div className="search-box">
                <SearchIcon />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search students..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="main-body">
            {activeNav === 'overview'
              ? <OverviewSection summary={summary} students={students} />
              : <StudentTable students={students} search={search} />}
          </div>
        </div>
      </div>
    </div>
  );
}
