import React, { useRef, useEffect } from "react";
import aquariumBg from "../assets/bg-aqurium.png";
import { useAquariumStore } from "../stores/useAquariumStore";
import { useTaskStore } from "../stores/useTaskStore";
import { useInventoryStore } from "../stores/useInventoryStore";
import { PlacedItem } from "./PlacedItem";

export const AquariumCanvas: React.FC = () => {
  const {
    layoutItems,
    isEditMode,
    setEditMode,
    addItem,
    updateItemPosition,
    saveLayout,
    fetchLayout,
  } = useAquariumStore();
  const { tasks } = useTaskStore();
  const { inventory, ensureLoaded } = useInventoryStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load inventory and then layout on mount
    ensureLoaded().then(() => {
      fetchLayout(useInventoryStore.getState().inventory);
    });
  }, [ensureLoaded, fetchLayout]);

  // Find active fish from pending tasks
  const activeFishTasks = tasks.filter(
    (t) => t.status === "PENDING" && t.fishDetails,
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const dataString = e.dataTransfer.getData("application/json");
    if (!dataString) return;

    const data = JSON.parse(dataString);
    const rect = canvasRef.current.getBoundingClientRect();

    // Calculate percentage position
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp
    x = Math.max(0, Math.min(x, 100));
    y = Math.max(0, Math.min(y, 100));

    if (data.action === "add") {
      addItem({
        id: `placed-${data.inventoryId}`,
        type: data.type === "FISH" ? "fish" : "decoration",
        x,
        y,
        zIndex: 20,
        imageUrl: data.imageUrl,
        flipX: false,
      });
    } else if (data.action === "move") {
      updateItemPosition(data.id, x, y);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="aquarium-center"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {/* Action Buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 100,
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          className={isEditMode ? "btn-primary-solid" : "btn-primary-outline"}
          onClick={() => {
            if (isEditMode) {
              saveLayout();
            }
            setEditMode(!isEditMode);
          }}
          style={{ padding: "8px 16px", borderRadius: "8px" }}
        >
          {isEditMode ? "Save Layout" : "Edit Aquarium"}
        </button>
      </div>

      <div
        ref={canvasRef}
        className="aquarium-wrapper"
        onDrop={isEditMode ? handleDrop : undefined}
        onDragOver={isEditMode ? handleDragOver : undefined}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          outline: isEditMode ? "4px dashed var(--primary)" : "none",
          outlineOffset: "-4px",
        }}
      >
        <img
          src={aquariumBg}
          alt="Your Aquarium"
          className="aquarium-image"
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Render all placed items (decorations and active fish) */}
        {layoutItems.map((item) => (
          <PlacedItem key={item.id} item={item} />
        ))}

        {/* Render fish from active tasks */}
        {activeFishTasks.map((task, index) => {
          if (!task.fishDetails) return null;

          // Generate a pseudo-random start position based on task ID so it doesn't move randomly on re-renders,
          // but the PlacedItem will handle the swimming animation
          const seed = task.id * 10;
          const startX = 20 + (seed % 60); // 20% to 80%
          const startY = 30 + ((seed * 7) % 40); // 30% to 70%

          return (
            <PlacedItem
              key={`task-fish-${task.id}`}
              item={{
                id: `task-fish-${task.id}`,
                type: "fish",
                x: startX,
                y: startY,
                zIndex: 10 + index,
                imageUrl: task.fishDetails.imageUrlAdult || "", // For now just use adult, or map based on growthStage if added later
                flipX: seed % 2 === 0,
              }}
            />
          );
        })}
      </div>

      {/* Inventory Drawer for Edit Mode */}
      {isEditMode && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            width: "calc(100% - 40px)",
            maxWidth: "700px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "16px",
            border: "1px solid var(--card-border)",
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            minHeight: "120px",
          }}
        >
          {inventory.filter((i) => i.itemType !== "FISH").length === 0 ? (
            <p style={{ margin: "auto", color: "var(--text-muted)" }}>
              No decorations in inventory yet.
            </p>
          ) : (
            inventory
              .filter((i) => i.itemType !== "FISH")
              .map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({
                        action: "add",
                        inventoryId: item.id,
                        type: item.itemType,
                        imageUrl:
                          item.itemType === "DECORATION"
                            ? item.decorationDetails?.imageUrl
                            : item.fishDetails?.imageUrlAdult || "",
                      }),
                    );
                  }}
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "white",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "grab",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    flexShrink: 0,
                  }}
                >
                  {item.itemType === "DECORATION" &&
                  item.decorationDetails?.imageUrl ? (
                    <img
                      src={item.decorationDetails.imageUrl}
                      alt="decoration"
                      style={{
                        maxWidth: "60px",
                        maxHeight: "60px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>🪴</span>
                  )}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};
