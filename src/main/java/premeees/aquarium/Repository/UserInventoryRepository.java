package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.User;
import premeees.aquarium.Entity.UserInventory;
import premeees.aquarium.Entity.enums.ItemType;

import java.util.List;

public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
    List<UserInventory> findByUserUsername(String username);
    boolean existsByUserAndItemIdAndItemType(User user, Integer itemId, ItemType itemType);
}
