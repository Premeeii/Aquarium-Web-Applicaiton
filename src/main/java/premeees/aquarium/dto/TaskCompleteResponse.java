package premeees.aquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import premeees.aquarium.Entity.enums.GrowthStage;
import premeees.aquarium.Entity.enums.TaskStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskCompleteResponse {
    private Long taskId;
    private TaskStatus status;
    private Integer coinsEarned;
    private FishUpdateInfo fishUpdate;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FishUpdateInfo {
        private Long instanceId;
        private GrowthStage growthStage;
        private Integer growthProgress;
    }
}
