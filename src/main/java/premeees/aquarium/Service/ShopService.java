package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import premeees.aquarium.Entity.Fish;
import premeees.aquarium.Entity.User;
import premeees.aquarium.Entity.UserFishInstance;
import premeees.aquarium.Entity.UserInventory;
import premeees.aquarium.Entity.enums.GrowthStage;
import premeees.aquarium.Entity.enums.ItemType;
import premeees.aquarium.Repository.FishRepository;
import premeees.aquarium.Repository.UserFishInstanceRepository;
import premeees.aquarium.Repository.UserInventoryRepository;
import premeees.aquarium.Repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final UserRepository userRepository;
    private final FishRepository fishRepository;
    private final UserInventoryRepository userInventoryRepository;
    private final UserFishInstanceRepository userFishInstanceRepository;

    @Transactional
    public void purchaseFish(String username, Integer fishId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Fish fish = fishRepository.findById(fishId)
                .orElseThrow(() -> new RuntimeException("Fish not found"));

        // Constraint Check: Only one item per user
        boolean alreadyOwned = userInventoryRepository.existsByUserAndItemIdAndItemType(user, fishId, ItemType.FISH);
        if (alreadyOwned) {
            throw new RuntimeException("You already own this item");
        }

        // Balance Check
        if (user.getCoins() < fish.getBasePrice()) {
            throw new RuntimeException("Insufficient coins to purchase this item");
        }

        // Deduct Coins
        user.setCoins(user.getCoins() - fish.getBasePrice());
        userRepository.save(user);

        // Add to Inventory
        UserInventory newInventory = UserInventory.builder()
                .user(user)
                .itemType(ItemType.FISH)
                .itemId(fishId)
                .build();
        UserInventory savedInventory = userInventoryRepository.save(newInventory);

        // Create Fish Instance
        UserFishInstance newFishInstance = UserFishInstance.builder()
                .inventory(savedInventory)
                .growthStage(GrowthStage.EGG)
                .growthProgress(0)
                .isInAquarium(false)
                .build();
        userFishInstanceRepository.save(newFishInstance);
    }
}
