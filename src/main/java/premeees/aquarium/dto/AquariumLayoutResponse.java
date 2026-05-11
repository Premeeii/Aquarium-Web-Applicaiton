package premeees.aquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import premeees.aquarium.Entity.enums.InstanceType;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AquariumLayoutResponse {
    private Long id;
    private String frontendId; // To easily map it back on frontend
    private InstanceType instanceType;
    private Long instanceId;
    private Double posX;
    private Double posY;
}
