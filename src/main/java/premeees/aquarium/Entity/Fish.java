package premeees.aquarium.Entity;

import jakarta.persistence.*;
import lombok.*;
import premeees.aquarium.Entity.enums.Rarity;

@Entity
@Table(name = "fishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "species_name", nullable = false)
    private String speciesName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price", nullable = false)
    private Integer basePrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rarity rarity;

    @Column(name = "image_url_egg")
    private String imageUrlEgg;

    @Column(name = "image_url_baby")
    private String imageUrlBaby;

    @Column(name = "image_url_adult")
    private String imageUrlAdult;
}
