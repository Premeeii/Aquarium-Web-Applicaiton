package premeees.aquarium.Entity;

import jakarta.persistence.*;
import lombok.*;
import premeees.aquarium.Entity.enums.DecorationCategory;

@Entity
@Table(name = "decorations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Decoration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DecorationCategory category;

    @Column(nullable = false)
    private Integer price;

    @Column(name = "image_url")
    private String imageUrl;
}
