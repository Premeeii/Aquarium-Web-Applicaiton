package premeees.aquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import premeees.aquarium.Entity.enums.DecorationCategory;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DecorationResponse {
    private Integer id;
    private String itemName;
    private DecorationCategory category;
    private Integer price;
    private String imageUrl;
}
