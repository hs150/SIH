import React, { useState, useEffect } from 'react';
import { api, authStorage } from './services/api';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import PriorityEngineView from './components/PriorityEngineView';
import RedZonesView from './components/RedZonesView';
import RelocationSitesView from './components/RelocationSitesView';
import HazardEventsView from './components/HazardEventsView';
import HabitationsView from './components/HabitationsView';
import LoginModal from './components/LoginModal';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(authStorage.getUser());
  const [isAuthOpen, setIsAuthOpen] = useState(!authStorage.isAuthenticated());
  const [activeTab, setActiveTab] = useState('map');

  // Application Data States
  const [habitations, setHabitations] = useState([]);
  const [redZones, setRedZones] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [relocationSites, setRelocationSites] = useState([]);
  const [priorities, setPriorities] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Listen for 401 unauthorized
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthOpen(true);
      showToast('Session expired. Please log in again.', 'error');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Fetch all backend data
  const loadAllData = async () => {
    if (!authStorage.isAuthenticated()) {
      setIsAuthOpen(true);
      return;
    }
    setIsRefreshing(true);
    try {
      const [habs, zones, hzds, sites, prios] = await Promise.all([
        api.getHabitations().catch(() => []),
        api.getRedZones().catch(() => []),
        api.getHazards().catch(() => []),
        api.getRelocationSites().catch(() => []),
        api.getAllPriorities().catch(() => []),
      ]);

      setHabitations(habs || []);
      setRedZones(zones || []);
      setHazards(hzds || []);
      setRelocationSites(sites || []);
      setPriorities(prios || []);
    } catch (err) {
      showToast('Error syncing with backend: ' + err.message, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authStorage.isAuthenticated()) {
      loadAllData();
    }
  }, []);

  // Authentication Handlers
  const handleLogin = async (email, password) => {
    const data = await api.login(email, password);
    setUser(authStorage.getUser());
    setIsAuthOpen(false);
    showToast(`Welcome back, ${data.name}! Connected to Disaster Command.`);
    loadAllData();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIsAuthOpen(true);
    showToast('Logged out successfully.');
  };

  // Single Habitation Assessment & Priority Calculation
  const handleAssessHabitation = async (habitationId) => {
    setIsAssessing(true);
    try {
      // 1. Calculate Hazard Risk Assessment
      const risk = await api.calculateHazardRisk(habitationId);
      // 2. Calculate Relocation Priority
      const priority = await api.calculatePriority(habitationId);

      showToast(`Priority computed for ${priority.habitationName}: ${priority.priorityLevel} (Score: ${priority.overallPriorityScore})`);
      
      // Update local state
      const updatedPriorities = await api.getAllPriorities();
      setPriorities(updatedPriorities || []);
    } catch (err) {
      showToast('Assessment failed: ' + err.message, 'error');
    } finally {
      setIsAssessing(false);
    }
  };

  // Batch Recalculate Priorities for All Habitations
  const handleRecalculateAll = async () => {
    setIsRecalculating(true);
    let successCount = 0;
    try {
      for (const h of habitations) {
        try {
          await api.calculateHazardRisk(h.id);
          await api.calculatePriority(h.id);
          successCount++;
        } catch {
          // skip
        }
      }
      const updated = await api.getAllPriorities();
      setPriorities(updated || []);
      showToast(`Batch execution complete: Evaluated ${successCount} vulnerable habitations across hazards.`);
    } catch (err) {
      showToast('Batch assessment encountered an error: ' + err.message, 'error');
    } finally {
      setIsRecalculating(false);
    }
  };

  // Create Habitation
  const handleCreateHabitation = async (habData) => {
    setIsCreating(true);
    try {
      const created = await api.createHabitation(habData);
      showToast(`Habitation ${created.name} registered.`);
      // Automatically compute initial risk & priority
      try {
        await api.calculateHazardRisk(created.id);
        await api.calculatePriority(created.id);
      } catch {
        // ignore
      }
      loadAllData();
    } catch (err) {
      showToast('Failed to create habitation: ' + err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete Habitation
  const handleDeleteHabitation = async (id) => {
    if (!window.confirm('Are you sure you want to remove this habitation?')) return;
    try {
      await api.deleteHabitation(id);
      showToast('Habitation removed.');
      loadAllData();
    } catch (err) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  };

  // Create Red Zone with WKT polygon
  const handleCreateRedZone = async (zoneData) => {
    setIsCreating(true);
    try {
      const coords = zoneData.coordsText.trim();
      const wkt = `POLYGON((${coords}))`;
      await api.createRedZone({
        name: zoneData.name,
        riskLevel: zoneData.riskLevel,
        reason: zoneData.reason,
        source: zoneData.source,
        wkt: wkt,
        active: true
      });
      showToast(`Red Zone "${zoneData.name}" demarcated.`);
      loadAllData();
    } catch (err) {
      showToast('Failed to demarcate red zone: ' + err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Create Relocation Site
  const handleCreateSite = async (siteData) => {
    setIsCreating(true);
    try {
      await api.createRelocationSite(siteData);
      showToast(`Relocation Site "${siteData.name}" registered.`);
      loadAllData();
    } catch (err) {
      showToast('Failed to create site: ' + err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // Create Hazard Event
  const handleCreateHazard = async (hazardData) => {
    setIsCreating(true);
    try {
      await api.createHazard(hazardData);
      showToast(`Hazard Event "${hazardData.hazardType}" recorded.`);
      loadAllData();
    } catch (err) {
      showToast('Failed to record hazard: ' + err.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshData={loadAllData}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'map' && (
          <MapView
            habitations={habitations}
            redZones={redZones}
            hazards={hazards}
            relocationSites={relocationSites}
            priorities={priorities}
            onAssessHabitation={handleAssessHabitation}
            isAssessing={isAssessing}
          />
        )}

        {activeTab === 'priorities' && (
          <PriorityEngineView
            habitations={habitations}
            priorities={priorities}
            onRecalculateAll={handleRecalculateAll}
            onRecalculateSingle={handleAssessHabitation}
            isRecalculating={isRecalculating}
            onSelectHabitationOnMap={(hab) => setActiveTab('map')}
          />
        )}

        {activeTab === 'redzones' && (
          <RedZonesView
            redZones={redZones}
            onCreateRedZone={handleCreateRedZone}
            isCreating={isCreating}
          />
        )}

        {activeTab === 'relocations' && (
          <RelocationSitesView
            relocationSites={relocationSites}
            onCreateSite={handleCreateSite}
            isCreating={isCreating}
          />
        )}

        {activeTab === 'hazards' && (
          <HazardEventsView
            hazards={hazards}
            onCreateHazard={handleCreateHazard}
            isCreating={isCreating}
          />
        )}

        {activeTab === 'habitations' && (
          <HabitationsView
            habitations={habitations}
            onCreateHabitation={handleCreateHabitation}
            onDeleteHabitation={handleDeleteHabitation}
            onAssessHabitation={handleAssessHabitation}
            isAssessing={isAssessing}
          />
        )}
      </main>

      {/* Login Authentication Modal */}
      <LoginModal
        isOpen={isAuthOpen}
        onLogin={handleLogin}
      />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 10,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 4000,
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
