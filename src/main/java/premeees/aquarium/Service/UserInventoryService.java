package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import premeees.aquarium.Entity.UserInventory;
import premeees.aquarium.Repository.UserInventoryRepository;
import premeees.aquarium.Entity.enums.ItemType;
import premeees.aquarium.dto.FishResponse;
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
        UserInventoryResponse response = UserInventoryResponse.builder()
                .id(inventory.getId())
                .itemType(inventory.getItemType())
                .itemId(inventory.getItemId())
                .acquiredAt(inventory.getAcquiredAt())
                .build();

        if (inventory.getItemType() == ItemType.FISH && inventory.getFish() != null) {
            var fish = inventory.getFish();
            response.setFishDetails(FishResponse.builder()
                    .id(fish.getId())
                    .speciesName(fish.getSpeciesName())
                    .description(fish.getDescription())
                    .basePrice(fish.getBasePrice())
                    .rarity(fish.getRarity())
                    .imageUrlEgg(fish.getImageUrlEgg())
                    .imageUrlBaby(fish.getImageUrlBaby())
                    .imageUrlAdult(fish.getImageUrlAdult())
                    .build());
        } else if (inventory.getItemType() == ItemType.DECORATION && inventory.getDecoration() != null) {
            var dec = inventory.getDecoration();
            response.setDecorationDetails(premeees.aquarium.dto.DecorationResponse.builder()
                    .id(dec.getId())
                    .itemName(dec.getItemName())
                    .category(dec.getCategory())
                    .price(dec.getPrice())
                    .imageUrl(dec.getImageUrl())
                    .build());
        }

        return response;
    }
}
