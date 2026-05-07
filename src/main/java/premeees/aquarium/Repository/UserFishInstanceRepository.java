package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.UserFishInstance;

public interface UserFishInstanceRepository extends JpaRepository<UserFishInstance, Long> {
}
