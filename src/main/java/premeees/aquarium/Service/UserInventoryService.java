package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import premeees.aquarium.Entity.UserInventory;
import premeees.aquarium.Repository.UserInventoryRepository;
import premeees.aquarium.dto.UserInventoryResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserInventoryService {

    private final UserInventoryRepository userInventoryRepository;

    public List<UserInventoryResponse> getUserInventory(String username) {
        List<UserInventory> inventories = userInventoryRepository.findByUserUsername(username);
        return inventories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserInventoryResponse mapToResponse(UserInventory inventory) {
        return UserInventoryResponse.builder()
                .id(inventory.getId())
                .itemType(inventory.getItemType())
                .itemId(inventory.getItemId())
                .acquiredAt(inventory.getAcquiredAt())
                .build();
    }
}
