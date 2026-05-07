package premeees.aquarium.Entity;

import jakarta.persistence.*;
import lombok.*;
import premeees.aquarium.Entity.enums.InstanceType;

@Entity
@Table(name = "aquarium_layouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AquariumLayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "instance_type", nullable = false)
    private InstanceType instanceType;

    @Column(name = "instance_id", nullable = false)
    private Long instanceId;

    @Column(name = "pos_x", nullable = false)
    private Double posX;

    @Column(name = "pos_y", nullable = false)
    private Double posY;
}
