package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.UserInventory;

public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
}
