package premeees.aquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskCompleteRequest {
    private Integer actualDurationMinutes;
    private Boolean completedEarly;
}
