package premeees.aquarium.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import premeees.aquarium.Entity.enums.ItemType;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInventoryResponse {
    private Long id;
    private ItemType itemType;
    private Integer itemId;
    private LocalDateTime acquiredAt;
}
