package premeees.aquarium.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import premeees.aquarium.Entity.enums.ItemType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    @Column(name = "item_id", nullable = false)
    private Integer itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Fish fish;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Decoration decoration;

    @CreationTimestamp
    @Column(name = "acquired_at", updatable = false)
    private LocalDateTime acquiredAt;

    // === Relationships ===

    @OneToOne(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserFishInstance fishInstance;

    @OneToMany(mappedBy = "inventoryFish", cascade = CascadeType.ALL)
    private List<Task> tasks;
}
