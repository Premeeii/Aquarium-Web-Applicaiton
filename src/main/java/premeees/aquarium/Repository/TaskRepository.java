package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
