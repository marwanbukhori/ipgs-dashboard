export const API_URL = 'PASTE_APPS_SCRIPT_URL?action=dashboard';

export const REFRESH_INTERVAL = 10000;

export const NAV_ITEMS = [
  { key: 'overview', label: 'Overview' },
  { key: 'students', label: 'Student List' },
];

export const PAYMENT_STATUS_MAP = {
  Paid: { className: 'badge--paid', label: 'Paid' },
  Partial: { className: 'badge--partial', label: 'Partial' },
  Pending: { className: 'badge--pending', label: 'Pending' },
  Overdue: { className: 'badge--overdue', label: 'Overdue' },
};

export function formatRM(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'RM 0.00';
  return `RM ${num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* Demo data used when API is unreachable */
export const DEMO_DATA = {
  summary: {
    totalStudents: 142,
    activeStudents: 118,
    totalFees: 1420000,
    collected: 985600,
    outstanding: 434400,
  },
  students: [
    { studentName: 'Ahmad bin Ali', programShort: 'MBA', intake: 'Mar 2026', paymentStatus: 'Paid' },
    { studentName: 'Siti Nurhaliza binti Ismail', programShort: 'PhD', intake: 'Mar 2026', paymentStatus: 'Partial' },
    { studentName: 'Raj Kumar a/l Muthu', programShort: 'MBM', intake: 'Sep 2025', paymentStatus: 'Paid' },
    { studentName: 'Fatimah binti Hassan', programShort: 'BBA', intake: 'Mar 2026', paymentStatus: 'Pending' },
    { studentName: 'Lee Wei Ming', programShort: 'DBA', intake: 'Sep 2025', paymentStatus: 'Paid' },
    { studentName: 'Nurul Aisyah binti Zainal', programShort: 'MBA', intake: 'Mar 2026', paymentStatus: 'Overdue' },
    { studentName: 'Muhammad Hafiz bin Razak', programShort: 'MHUM', intake: 'Sep 2025', paymentStatus: 'Paid' },
    { studentName: 'Priya a/p Subramaniam', programShort: 'MBM', intake: 'Mar 2026', paymentStatus: 'Partial' },
    { studentName: 'Tan Chee Keong', programShort: 'PhD', intake: 'Sep 2025', paymentStatus: 'Paid' },
    { studentName: 'Aminah binti Othman', programShort: 'MBA', intake: 'Mar 2026', paymentStatus: 'Pending' },
    { studentName: 'Syafiq bin Kamaruddin', programShort: 'BBA', intake: 'Sep 2025', paymentStatus: 'Paid' },
    { studentName: 'Wong Mei Ling', programShort: 'DBA', intake: 'Mar 2026', paymentStatus: 'Paid' },
  ],
};
