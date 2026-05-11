import React, { useEffect, useState } from "react";
import type { AquariumItem } from "../stores/useAquariumStore";

interface PlacedItemProps {
  item: AquariumItem;
}

export const PlacedItem: React.FC<PlacedItemProps> = ({ item }) => {
  // Local state for animation if it's a fish
  const [position, setPosition] = useState({ x: item.x, y: item.y });

  useEffect(() => {
    if (item.type === "fish") {
      // Simulate slow random movement
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
      // If decoration, just stick to its saved position
      setPosition({ x: item.x, y: item.y });
    }
  }, [item.type, item.x, item.y]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${item.flipX ? "scaleX(-1)" : ""}`,
        zIndex: item.zIndex,
        transition: item.type === "fish" ? "all 4s ease-in-out" : "none",
        pointerEvents: "none", // Prevent interference with dragging in future
      }}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt="Aquarium Item"
          style={{
            maxWidth: item.type === "fish" ? "80px" : "100px",
            maxHeight: item.type === "fish" ? "80px" : "100px",
            objectFit: "contain",
          }}
        />
      ) : (
        <span style={{ fontSize: "2rem" }}>
          {item.type === "fish" ? "🐟" : "🪴"}
        </span>
      )}
    </div>
  );
};
