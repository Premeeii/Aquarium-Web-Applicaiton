package premeees.aquarium.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import premeees.aquarium.Entity.Task;
import premeees.aquarium.Entity.enums.TaskStatus;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserUsernameOrderByCreatedAtDesc(String username);
    List<Task> findByUserUsernameAndStatusInOrderByCreatedAtDesc(String username, List<TaskStatus> statuses);
}
