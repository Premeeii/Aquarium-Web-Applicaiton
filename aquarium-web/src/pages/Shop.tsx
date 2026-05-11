import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useFishStore } from "../stores/useFishStore";
import { shopApi } from "../api/shop";

type FilterCategory = "all" | "fish" | "plants" | "decorations";

export default function Shop() {
  const navigate = useNavigate();
  const { profile, fetchProfile, refreshProfile } = useAuthStore();
  const { fishes, loadingFishes, fetchFishes } = useFishStore();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{ id: number, name: string, price: number } | null>(null);

  useEffect(() => {
    fetchProfile().then((authenticated) => {
      if (!authenticated) navigate("/login");
    });
    // Fetch fishes without opening modal
    if (fishes.length === 0) {
      fetchFishes();
    }
  }, [navigate]);

  const filters: { label: string; value: FilterCategory }[] = [
    { label: "All Items", value: "all" },
    { label: "Fish", value: "fish" },
    { label: "Plants", value: "plants" },
    { label: "Decorations", value: "decorations" },
  ];

  // For now, all items are fish. Filter logic can be extended later.
  const filteredItems =
    activeFilter === "all" || activeFilter === "fish" ? fishes : [];

  const confirmPurchase = async () => {
    if (!confirmModalData) return;
    const { id, price } = confirmModalData;

    if (profile && profile.coins < price) {
      alert("Insufficient coins to purchase this item.");
      setConfirmModalData(null);
      return;
    }

    setPurchasingId(id);
    try {
      await shopApi.purchaseFish(id);
      await refreshProfile(); // Refresh coins
      alert("Purchase successful! The item is now in your inventory.");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to purchase item.");
    } finally {
      setPurchasingId(null);
      setConfirmModalData(null);
    }
  };

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header animate-fade-in">
        <h1 className="shop-title">Aquarium Shop</h1>
      </div>

      {/* Filter Tabs */}
      <div
        className="shop-filters animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        {filters.map((f) => (
          <button
            key={f.value}
            className={`shop-filter-btn ${activeFilter === f.value ? "active" : ""}`}
            onClick={() => setActiveFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="shop-items">
        {loadingFishes ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3rem",
            }}
          >
            <svg
              className="spinner"
              viewBox="0 0 24 24"
              fill="none"
              style={{ width: "32px" }}
            >
              <circle
                opacity="0.25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                opacity="0.75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
              />
            </svg>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="shop-empty">
            <p>No items available in this category yet 🌊</p>
          </div>
        ) : (
          filteredItems.map((fish, index) => (
            <div
              key={fish.id}
              className="shop-card animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="shop-card-image">
                {fish.imageUrlAdult ? (
                  <img src={fish.imageUrlAdult} alt={fish.speciesName} />
                ) : (
                  <div className="shop-card-image-placeholder">🐟</div>
                )}
              </div>
              <div className="shop-card-info">
                <h3 className="shop-card-name">{fish.speciesName}</h3>
                <span
                  className={`shop-card-rarity rarity-${fish.rarity.toLowerCase()}`}
                >
                  <span className="rarity-dot" />
                  {fish.rarity}
                </span>
                <p className="shop-card-desc">{fish.description}</p>
              </div>
              <div className="shop-card-action">
                <div className="shop-card-price">
                  <span className="price-icon">🪙</span>
                  <span className="price-value">{fish.basePrice}</span>
                </div>
                <button 
                  className="shop-buy-btn"
                  onClick={() => setConfirmModalData({ id: fish.id, name: fish.speciesName, price: fish.basePrice })}
                  disabled={purchasingId === fish.id}
                >
                  {purchasingId === fish.id ? "Purchasing..." : "Buy Now"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Purchase Confirmation Modal */}
      {confirmModalData && (
        <div
          className="modal-overlay"
          onClick={() => setConfirmModalData(null)}
        >
          <div
            className="modal-content mini"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-body">
              <div className="confirm-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: "32px" }}
                >
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3>Confirm Purchase</h3>
              <p>
                Are you sure you want to buy <strong>{confirmModalData.name}</strong> for 🪙 {confirmModalData.price}?
              </p>
              <div className="confirm-actions">
                <button
                  className="btn-confirm-cancel"
                  onClick={() => setConfirmModalData(null)}
                  disabled={purchasingId !== null}
                >
                  Cancel
                </button>
                <button 
                  className="btn-confirm-primary" 
                  onClick={confirmPurchase}
                  disabled={purchasingId !== null}
                >
                  {purchasingId !== null ? "Purchasing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
