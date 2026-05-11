package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.AquariumLayout;
import premeees.aquarium.Entity.User;

import java.util.List;

public interface AquariumLayoutRepository extends JpaRepository<AquariumLayout, Long> {
    List<AquariumLayout> findByUser(User user);
    void deleteByUser(User user);
}
