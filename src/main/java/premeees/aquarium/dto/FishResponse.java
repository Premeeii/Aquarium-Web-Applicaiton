package premeees.aquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import premeees.aquarium.Entity.enums.Rarity;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FishResponse {
    private Integer id;
    private String speciesName;
    private String description;
    private Integer basePrice;
    private Rarity rarity;
    private String imageUrlEgg;
    private String imageUrlBaby;
    private String imageUrlAdult;
}
