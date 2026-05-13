import React, { useEffect, useState } from "react";
import type { AquariumItem } from "../stores/useAquariumStore";

interface PlacedItemProps {
  item: AquariumItem;
  isEditMode?: boolean;
  onRemove?: (id: string) => void;
}

export const PlacedItem: React.FC<PlacedItemProps> = ({
  item,
  isEditMode,
  onRemove,
}) => {
  // Local state for animation if it's a fish
  const [position, setPosition] = useState({ x: item.x, y: item.y });

  useEffect(() => {
    if (item.type === "fish" && !isEditMode) {
      // Simulate slow random movement only when NOT in edit mode
      const intervalId = setInterval(() => {
        setPosition((prev) => {
          // Move randomly by -5% to +5%
          const dx = (Math.random() - 0.5) * 10;
          const dy = (Math.random() - 0.5) * 10;

          let newX = prev.x + dx;
          let newY = prev.y + dy;

          // Clamp to stay inside aquarium
          newX = Math.max(5, Math.min(newX, 90));
          newY = Math.max(5, Math.min(newY, 90));

          return { x: newX, y: newY };
        });
      }, 4000); // Move every 4 seconds

      return () => clearInterval(intervalId);
    } else {
      // If decoration or in edit mode, just stick to its saved position
      setPosition({ x: item.x, y: item.y });
    }
  }, [item.type, item.x, item.y, isEditMode]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${item.flipX ? "scaleX(-1)" : ""}`,
        zIndex: item.zIndex,
        transition:
          item.type === "fish" && !isEditMode ? "all 4s ease-in-out" : "none",
        pointerEvents: isEditMode ? "auto" : "none",
      }}
    >
      {isEditMode && (
        <button
          onClick={handleRemove}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          ✕
        </button>
      )}

      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt="Aquarium Item"
          style={{
            maxWidth: item.type === "fish" ? "240px" : "100px",
            maxHeight: item.type === "fish" ? "240px" : "100px",
            objectFit: "contain",
            border: isEditMode ? "2px dashed var(--primary)" : "none",
            borderRadius: "8px",
            padding: "4px",
          }}
        />
      ) : (
        <span style={{ fontSize: item.type === "fish" ? "3.5rem" : "2rem" }}>
          {item.type === "fish" ? "🐟" : "🪴"}
        </span>
      )}

      {item.label && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.6)",
            color: "white",
            padding: "2px 6px",
            borderRadius: "12px",
            fontSize: "15px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          {item.label}
        </div>
      )}
    </div>
  );
};
