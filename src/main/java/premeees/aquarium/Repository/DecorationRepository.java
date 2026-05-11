package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.Decoration;

public interface DecorationRepository extends JpaRepository<Decoration, Integer> {
}
