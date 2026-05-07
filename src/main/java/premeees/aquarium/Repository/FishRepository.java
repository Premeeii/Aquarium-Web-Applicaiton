package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.Fish;

public interface FishRepository extends JpaRepository<Fish, Integer> {
}
