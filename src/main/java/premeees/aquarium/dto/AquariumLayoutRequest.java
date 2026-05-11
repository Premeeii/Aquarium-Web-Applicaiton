package premeees.aquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import premeees.aquarium.Entity.enums.InstanceType;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AquariumLayoutRequest {
    private List<LayoutItemRequest> items;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LayoutItemRequest {
        private String id; // string id from frontend e.g. "placed-123"
        private InstanceType instanceType;
        private Long instanceId; // actual DB id
        private Double posX;
        private Double posY;
    }
}
