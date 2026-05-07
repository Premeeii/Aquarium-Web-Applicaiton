package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.UserInventory;

import java.util.List;

public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
    List<UserInventory> findByUserUsername(String username);
}
