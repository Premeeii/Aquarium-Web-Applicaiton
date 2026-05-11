import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useFishStore } from "../stores/useFishStore";
import { useDecorationStore } from "../stores/useDecorationStore";
import { shopApi } from "../api/shop";

type FilterCategory = "all" | "fish" | "plants" | "decorations";

export default function Shop() {
  const navigate = useNavigate();
  const { profile, fetchProfile, refreshProfile } = useAuthStore();
  const { fishes, loadingFishes, fetchFishes } = useFishStore();
  const { decorations, loadingDecorations, fetchDecorations } = useDecorationStore();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{ id: number, type: "FISH" | "DECORATION", name: string, price: number } | null>(null);

  useEffect(() => {
    fetchProfile().then((authenticated) => {
      if (!authenticated) navigate("/login");
    });
    // Fetch fishes without opening modal
    if (fishes.length === 0) {
      fetchFishes();
    }
    if (decorations.length === 0) {
      fetchDecorations();
    }
  }, [navigate]);

  const filters: { label: string; value: FilterCategory }[] = [
    { label: "All Items", value: "all" },
    { label: "Fish", value: "fish" },
    { label: "Plants", value: "plants" },
    { label: "Decorations", value: "decorations" },
  ];

  interface UnifiedItem {
    id: number;
    type: "FISH" | "DECORATION";
    uid: string; // unique string id for frontend state
    name: string;
    description: string;
    price: number;
    rarity?: string;
    imageUrl: string;
    backendCategory?: string;
  }

  const unifiedItems: UnifiedItem[] = [
    ...fishes.map((f) => ({
      id: f.id,
      type: "FISH" as const,
      uid: `fish-${f.id}`,
      name: f.speciesName,
      description: f.description,
      price: f.basePrice,
      rarity: f.rarity,
      imageUrl: f.imageUrlAdult,
    })),
    ...decorations.map((d) => ({
      id: d.id,
      type: "DECORATION" as const,
      uid: `decoration-${d.id}`,
      name: d.itemName,
      description: d.category,
      price: d.price,
      imageUrl: d.imageUrl,
      backendCategory: d.category,
    })),
  ];

  const filteredItems = unifiedItems.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "fish") return item.type === "FISH";
    if (activeFilter === "plants") return item.type === "DECORATION" && item.backendCategory?.toUpperCase().includes("PLANT");
    if (activeFilter === "decorations") return item.type === "DECORATION" && !item.backendCategory?.toUpperCase().includes("PLANT");
    return true;
  });

  const confirmPurchase = async () => {
    if (!confirmModalData) return;
    const { id, type, price } = confirmModalData;

    if (profile && profile.coins < price) {
      alert("Insufficient coins to purchase this item.");
      setConfirmModalData(null);
      return;
    }

    setPurchasingId(`${type}-${id}`);
    try {
      if (type === "FISH") {
        await shopApi.purchaseFish(id);
      } else {
        await shopApi.purchaseDecoration(id);
      }
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
        {loadingFishes || loadingDecorations ? (
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
          filteredItems.map((item, index) => (
            <div
              key={item.uid}
              className="shop-card animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="shop-card-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="shop-card-image-placeholder">
                    {item.type === "FISH" ? "🐟" : "🪴"}
                  </div>
                )}
              </div>
              <div className="shop-card-info">
                <h3 className="shop-card-name">{item.name}</h3>
                {item.rarity && (
                  <span
                    className={`shop-card-rarity rarity-${item.rarity.toLowerCase()}`}
                  >
                    <span className="rarity-dot" />
                    {item.rarity}
                  </span>
                )}
                <p className="shop-card-desc">{item.description}</p>
              </div>
              <div className="shop-card-action">
                <div className="shop-card-price">
                  <span className="price-icon">🪙</span>
                  <span className="price-value">{item.price}</span>
                </div>
                <button 
                  className="shop-buy-btn"
                  onClick={() => setConfirmModalData({ id: item.id, type: item.type, name: item.name, price: item.price })}
                  disabled={purchasingId === item.uid}
                >
                  {purchasingId === item.uid ? "Purchasing..." : "Buy Now"}
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
