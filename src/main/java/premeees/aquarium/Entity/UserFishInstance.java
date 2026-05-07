package premeees.aquarium.Entity;

import jakarta.persistence.*;
import lombok.*;
import premeees.aquarium.Entity.enums.GrowthStage;

@Entity
@Table(name = "user_fish_instances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFishInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false, unique = true)
    private UserInventory inventory;

    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "growth_stage", nullable = false)
    @Builder.Default
    private GrowthStage growthStage = GrowthStage.EGG;

    @Column(name = "growth_progress", nullable = false)
    @Builder.Default
    private Integer growthProgress = 0;

    @Column(name = "is_in_aquarium", nullable = false)
    @Builder.Default
    private Boolean isInAquarium = false;
}
