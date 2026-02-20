import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import DashboardHome from './admin/DashboardHome';
import FarmersList from './admin/FarmersList';
import FarmerProfile from './admin/FarmerProfile';
import FarmerForm from './admin/FarmerForm';
import ProvidersList from './admin/ProvidersList';
import ProviderProfile from './admin/ProviderProfile';
import ProviderForm from './admin/ProviderForm';
import BookingsList from './admin/BookingsList';
import BookingDetail from './admin/BookingDetail';
import AddBookingForm from './admin/AddBookingForm';
import FarmMap from './admin/FarmMap';
import Ratings from './admin/Ratings';
import Settings from './admin/Settings';
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
const VIEW_SETTINGS = 'settings';

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
      case VIEW_DASHBOARD: return <DashboardHome />;
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
      case VIEW_FARM_MAP: return <FarmMap />;
      case VIEW_RATINGS: return <Ratings />;
      case VIEW_SETTINGS: return <Settings />;
      default: return <DashboardHome />;
    }
  };

  const isActive = (views) => views.some((v) => view === v || view.startsWith(v));

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
            <button type="button" className={`admin-nav-item ${view === VIEW_DASHBOARD ? 'active' : ''}`} onClick={showDashboard}>Dashboard</button>
            <button type="button" className={`admin-nav-item ${isActive(['farmers', 'farmer']) ? 'active' : ''}`} onClick={showFarmers}>Farmers</button>
            <button type="button" className={`admin-nav-item ${isActive(['providers', 'provider']) ? 'active' : ''}`} onClick={showProviders}>Providers</button>
            <button type="button" className={`admin-nav-item ${isActive(['bookings', 'booking']) ? 'active' : ''}`} onClick={showBookings}>Bookings</button>
            <button type="button" className={`admin-nav-item ${view === VIEW_FARM_MAP ? 'active' : ''}`} onClick={() => nav(VIEW_FARM_MAP)}>Farm Map</button>
            <button type="button" className={`admin-nav-item ${view === VIEW_RATINGS ? 'active' : ''}`} onClick={() => nav(VIEW_RATINGS)}>Ratings</button>
            <button type="button" className={`admin-nav-item ${view === VIEW_SETTINGS ? 'active' : ''}`} onClick={() => nav(VIEW_SETTINGS)}>Settings</button>
          </nav>
        </aside>
        <main className="admin-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default AdminDash;
