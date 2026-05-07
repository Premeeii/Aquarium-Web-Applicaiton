import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { fishApi } from '../api/fish';
import { inventoryApi } from '../api/inventory';
import type { UserProfile } from '../api/auth';
import type { FishSpecies } from '../api/fish';
import type { UserInventoryItem } from '../api/inventory';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fish Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fishes, setFishes] = useState<FishSpecies[]>([]);
  const [loadingFishes, setLoadingFishes] = useState(false);

  // Inventory Modal States
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventory, setInventory] = useState<UserInventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    authApi.getProfile()
      .then(res => setProfile(res.data))
      .catch(() => { setError('Session expired'); localStorage.clear(); navigate('/login'); })
      .finally(() => setLoading(false));
  }, [navigate]);

  const fetchFishes = async () => {
    setLoadingFishes(true);
    try {
      const res = await fishApi.getAllFishes();
      setFishes(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch fishes', err);
      alert('Could not load fish species');
    } finally {
      setLoadingFishes(false);
    }
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const res = await inventoryApi.getMyInventory();
      setInventory(res.data);
      setIsInventoryOpen(true);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
      alert('Could not load inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="loading-screen">
      <svg className="spinner" viewBox="0 0 24 24" fill="none">
        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
      </svg>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-brand">
            <div className="dashboard-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span>Aquarium</span>
          </div>
          <button onClick={handleLogout} className="btn-sign-out">Sign Out</button>
        </div>

        {/* Welcome */}
        <div className="dash-card welcome animate-fade-in">
          <h1>Welcome back, <span>{profile?.username}</span> 👋</h1>
          <p>Here's your flow state overview</p>
        </div>

        {/* View Fishes Button */}
        <button 
          onClick={fetchFishes} 
          className="btn-view-fishes animate-fade-in-delay" 
          style={{ animationDelay: '0.05s' }}
          disabled={loadingFishes}
        >
          {loadingFishes ? (
            <svg className="spinner" viewBox="0 0 24 24" fill="none" style={{ width: '16px', height: '16px' }}>
              <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          ) : (
            <span>🐟 View All Fish Species</span>
          )}
        </button>

        {/* View Inventory Button */}
        <button 
          onClick={fetchInventory} 
          className="btn-view-inventory animate-fade-in-delay" 
          style={{ animationDelay: '0.08s', marginTop: '12px' }}
          disabled={loadingInventory}
        >
          {loadingInventory ? (
            <svg className="spinner" viewBox="0 0 24 24" fill="none" style={{ width: '16px', height: '16px' }}>
              <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          ) : (
            <span>🎒 View My Inventory</span>
          )}
        </button>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="stat-header">
              <div className="stat-icon coins">🪙</div>
              <span className="stat-label">Coins</span>
            </div>
            <p className="stat-value">{profile?.coins ?? 0}</p>
          </div>

          <div className="stat-card" style={{ animationDelay: '0.15s' }}>
            <div className="stat-header">
              <div className="stat-icon streak">🔥</div>
              <span className="stat-label">Streak</span>
            </div>
            <p className="stat-value">
              {profile?.streakCount ?? 0} <span className="unit">days</span>
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="dash-card profile-section" style={{ animationDelay: '0.2s' }}>
          <h2>Profile Details</h2>
          <div>
            <div className="profile-row">
              <span className="label">Email</span>
              <span className="value">{profile?.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Last Login</span>
              <span className="value">{profile?.lastLoginDate ? formatDate(profile.lastLoginDate) : 'N/A'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Member Since</span>
              <span className="value">{profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fish Species Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Aquarium Species</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px' }}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="fish-grid">
                {fishes.map(fish => (
                  <div key={fish.id} className="fish-item">
                    <div className="fish-img-container">
                      {fish.imageUrlAdult ? (
                        <img src={fish.imageUrlAdult} alt={fish.speciesName} />
                      ) : (
                        <span>🐟</span>
                      )}
                    </div>
                    <div className="fish-info">
                      <h3>
                        {fish.speciesName}
                        <span className={`fish-rarity rarity-${fish.rarity.toLowerCase()}`}>
                          {fish.rarity}
                        </span>
                      </h3>
                      <p className="fish-desc">{fish.description}</p>
                      <div className="fish-price">
                        <span>🪙 {fish.basePrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Inventory Modal */}
      {isInventoryOpen && (
        <div className="modal-overlay" onClick={() => setIsInventoryOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>My Inventory</h2>
              <button className="btn-close" onClick={() => setIsInventoryOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px' }}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {inventory.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ opacity: 0.6 }}>Your inventory is empty. Time to go fishing! 🎣</p>
                </div>
              ) : (
                <div className="inventory-list">
                  {inventory.map(item => (
                    <div key={item.id} className="inventory-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      marginBottom: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div className="item-badge" style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        backgroundColor: item.itemType === 'FISH' ? '#3b82f6' : '#10b981',
                        color: 'white',
                        marginRight: '16px',
                        letterSpacing: '0.05em'
                      }}>{item.itemType}</div>
                      <div className="item-details">
                        <p className="item-id-text" style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>Item ID: {item.itemId}</p>
                        <p className="item-date" style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>{formatDate(item.acquiredAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

