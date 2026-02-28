import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  FiLayout,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiZap,
  FiMapPin,
  FiAward,
  FiBarChart2,
  FiShield,
  FiSettings,
  FiFileText,
  FiBell,
} from 'react-icons/fi';
import ExecutiveDashboard from './admin/ExecutiveDashboard';
import FarmersList from './admin/FarmersList';
import FarmerProfile from './admin/FarmerProfile';
import FarmerForm from './admin/FarmerForm';
import ProvidersList from './admin/ProvidersList';
import ProviderProfile from './admin/ProviderProfile';
import ProviderForm from './admin/ProviderForm';
import BookingsList from './admin/BookingsList';
import BookingDetail from './admin/BookingDetail';
import AddBookingForm from './admin/AddBookingForm';
import FarmMapIntelligence from './admin/FarmMapIntelligence';
import RatingsDisputes from './admin/RatingsDisputes';
import MatchingEngine from './admin/MatchingEngine';
import DataAnalytics from './admin/DataAnalytics';
import UserRoles from './admin/UserRoles';
import SystemSettings from './admin/SystemSettings';
import AuditLogs from './admin/AuditLogs';
import NotificationCenter from './admin/NotificationCenter';
import './AdminDash.css';

const VIEW_DASHBOARD = 'dashboard';
const VIEW_FARMERS = 'farmers';
const VIEW_FARMER_PROFILE = 'farmer_profile';
const VIEW_FARMER_ADD = 'farmer_add';
const VIEW_FARMER_EDIT = 'farmer_edit';
const VIEW_PROVIDERS = 'providers';
const VIEW_PROVIDER_PROFILE = 'provider_profile';
const VIEW_PROVIDER_ADD = 'provider_add';
const VIEW_PROVIDER_EDIT = 'provider_edit';
const VIEW_BOOKINGS = 'bookings';
const VIEW_BOOKING_DETAIL = 'booking_detail';
const VIEW_BOOKING_ADD = 'booking_add';
const VIEW_FARM_MAP = 'farm_map';
const VIEW_RATINGS = 'ratings';
const VIEW_MATCHING = 'matching';
const VIEW_DATA = 'data';
const VIEW_ROLES = 'roles';
const VIEW_SETTINGS = 'settings';
const VIEW_AUDIT = 'audit';
const VIEW_NOTIFICATIONS = 'notifications';

const NAV_ITEMS = [
  { id: VIEW_DASHBOARD, label: 'Dashboard', icon: FiLayout },
  { id: VIEW_FARMERS, label: 'Farmers', icon: FiUsers },
  { id: VIEW_PROVIDERS, label: 'Providers', icon: FiBriefcase },
  { id: VIEW_BOOKINGS, label: 'Bookings', icon: FiCalendar },
  { id: VIEW_MATCHING, label: 'Matching', icon: FiZap },
  { id: VIEW_FARM_MAP, label: 'Farm Map', icon: FiMapPin },
  { id: VIEW_RATINGS, label: 'Ratings & Disputes', icon: FiAward },
  { id: VIEW_DATA, label: 'Analytics', icon: FiBarChart2 },
  { id: VIEW_ROLES, label: 'Roles', icon: FiShield },
  { id: VIEW_SETTINGS, label: 'Settings', icon: FiSettings },
  { id: VIEW_AUDIT, label: 'Audit Logs', icon: FiFileText },
  { id: VIEW_NOTIFICATIONS, label: 'Notifications', icon: FiBell },
];

function AdminDash({ onLogout }) {
  const [view, setView] = useState(VIEW_DASHBOARD);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [editFarmer, setEditFarmer] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [editProvider, setEditProvider] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => { if (mq.matches) setSidebarOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const nav = (v) => { setView(v); closeSidebar(); };

  const showDashboard = () => { setView(VIEW_DASHBOARD); setSelectedFarmer(null); setEditFarmer(null); setSelectedProvider(null); setEditProvider(null); setSelectedBooking(null); closeSidebar(); };
  const showFarmers = () => { setView(VIEW_FARMERS); setSelectedFarmer(null); setEditFarmer(null); closeSidebar(); };
  const showFarmerProfile = (f) => { setSelectedFarmer(f); setView(VIEW_FARMER_PROFILE); setEditFarmer(null); };
  const showAddFarmer = () => { setView(VIEW_FARMER_ADD); setSelectedFarmer(null); setEditFarmer(null); closeSidebar(); };
  const showEditFarmer = (f) => { setEditFarmer(f); setView(VIEW_FARMER_EDIT); };
  const handleFarmerFormSuccess = () => { setView(VIEW_FARMERS); setEditFarmer(null); };
  const handleFarmerFormCancel = () => { if (editFarmer) { setView(VIEW_FARMER_PROFILE); setSelectedFarmer(editFarmer); } else setView(VIEW_FARMERS); setEditFarmer(null); };

  const showProviders = () => { setView(VIEW_PROVIDERS); setSelectedProvider(null); setEditProvider(null); closeSidebar(); };
  const showProviderProfile = (p) => { setSelectedProvider(p); setView(VIEW_PROVIDER_PROFILE); setEditProvider(null); };
  const showAddProvider = () => { setView(VIEW_PROVIDER_ADD); setSelectedProvider(null); setEditProvider(null); closeSidebar(); };
  const showEditProvider = (p) => { setEditProvider(p); setView(VIEW_PROVIDER_EDIT); };
  const handleProviderFormSuccess = () => { setView(VIEW_PROVIDERS); setEditProvider(null); };
  const handleProviderFormCancel = () => { if (editProvider) { setView(VIEW_PROVIDER_PROFILE); setSelectedProvider(editProvider); } else setView(VIEW_PROVIDERS); setEditProvider(null); };

  const showBookings = () => { setView(VIEW_BOOKINGS); setSelectedBooking(null); closeSidebar(); };
  const showBookingDetail = (b) => { setSelectedBooking(b); setView(VIEW_BOOKING_DETAIL); };
  const showAddBooking = () => { setView(VIEW_BOOKING_ADD); setSelectedBooking(null); closeSidebar(); };
  const handleBookingFormSuccess = () => { setView(VIEW_BOOKINGS); };
  const handleBookingUpdate = () => {};

  const renderContent = () => {
    switch (view) {
      case VIEW_DASHBOARD: return <ExecutiveDashboard onViewFarmMap={() => nav(VIEW_FARM_MAP)} />;
      case VIEW_FARMERS: return <FarmersList onSelectFarmer={showFarmerProfile} onAddFarmer={showAddFarmer} />;
      case VIEW_FARMER_PROFILE: return <FarmerProfile farmerId={selectedFarmer?.id} onBack={showFarmers} onEdit={showEditFarmer} />;
      case VIEW_FARMER_ADD: return <FarmerForm onSuccess={handleFarmerFormSuccess} onCancel={() => setView(VIEW_FARMERS)} />;
      case VIEW_FARMER_EDIT: return <FarmerForm farmer={editFarmer} onSuccess={handleFarmerFormSuccess} onCancel={handleFarmerFormCancel} />;
      case VIEW_PROVIDERS: return <ProvidersList onSelectProvider={showProviderProfile} onAddProvider={showAddProvider} />;
      case VIEW_PROVIDER_PROFILE: return <ProviderProfile providerId={selectedProvider?.id} onBack={showProviders} onEdit={showEditProvider} />;
      case VIEW_PROVIDER_ADD: return <ProviderForm onSuccess={handleProviderFormSuccess} onCancel={() => setView(VIEW_PROVIDERS)} />;
      case VIEW_PROVIDER_EDIT: return <ProviderForm provider={editProvider} onSuccess={handleProviderFormSuccess} onCancel={handleProviderFormCancel} />;
      case VIEW_BOOKINGS: return <BookingsList onSelectBooking={showBookingDetail} onAddBooking={showAddBooking} />;
      case VIEW_BOOKING_DETAIL: return <BookingDetail bookingId={selectedBooking?.id} onBack={showBookings} onUpdate={handleBookingUpdate} />;
      case VIEW_BOOKING_ADD: return <AddBookingForm onSuccess={handleBookingFormSuccess} onCancel={() => setView(VIEW_BOOKINGS)} />;
      case VIEW_FARM_MAP: return <FarmMapIntelligence onFarmerClick={showFarmerProfile} />;
      case VIEW_RATINGS: return <RatingsDisputes />;
      case VIEW_MATCHING: return <MatchingEngine />;
      case VIEW_DATA: return <DataAnalytics />;
      case VIEW_ROLES: return <UserRoles />;
      case VIEW_SETTINGS: return <SystemSettings />;
      case VIEW_AUDIT: return <AuditLogs />;
      case VIEW_NOTIFICATIONS: return <NotificationCenter />;
      default: return <ExecutiveDashboard />;
    }
  };

  const isActive = (id) => view === id || (id === VIEW_FARMERS && (view.startsWith('farmer') || view === 'farmers')) || (id === VIEW_PROVIDERS && (view.startsWith('provider') || view === 'providers')) || (id === VIEW_BOOKINGS && (view.startsWith('booking') || view === 'bookings'));

  return (
    <div className="admin-dash">
      <header className="admin-dash-header">
        <button type="button" className="admin-dash-menu-btn" onClick={() => setSidebarOpen((o) => !o)} aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}>
          {sidebarOpen ? <HiX /> : <HiMenu />}
        </button>
        <h1 className="admin-dash-title">DigiLync Admin</h1>
        {onLogout && <button type="button" className="admin-dash-logout" onClick={onLogout}>Logout</button>}
      </header>
      <div className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar} aria-hidden="true" />
      <div className="admin-dash-body">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="admin-nav">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" className={`admin-nav-item ${isActive(id) ? 'active' : ''}`} onClick={() => id === VIEW_DASHBOARD ? showDashboard() : id === VIEW_FARMERS ? showFarmers() : id === VIEW_PROVIDERS ? showProviders() : id === VIEW_BOOKINGS ? showBookings() : nav(id)}>
                <Icon className="admin-nav-icon" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="admin-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default AdminDash;
