package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import premeees.aquarium.dto.TaskCreateRequest;
import premeees.aquarium.dto.TaskResponse;
import premeees.aquarium.Entity.Task;
import premeees.aquarium.Entity.User;
import premeees.aquarium.Entity.UserInventory;
import premeees.aquarium.Entity.enums.ItemType;
import premeees.aquarium.Entity.enums.TaskStatus;
import premeees.aquarium.Repository.TaskRepository;
import premeees.aquarium.Repository.UserInventoryRepository;
import premeees.aquarium.Repository.UserRepository;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final UserInventoryRepository userInventoryRepository;

    @Transactional
    public TaskResponse createTask(String username, TaskCreateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserInventory inventoryFish = null;
        if (request.getInventoryFishId() != null) {
            inventoryFish = userInventoryRepository.findById(request.getInventoryFishId())
                    .orElseThrow(() -> new RuntimeException("Inventory item not found"));

            if (!inventoryFish.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Inventory item does not belong to the user");
            }

            if (inventoryFish.getItemType() != ItemType.FISH) {
                throw new RuntimeException("Selected inventory item is not a fish");
            }
        }

        Task task = Task.builder()
                .user(user)
                .title(request.getTitle())
                .tag(request.getTag())
                .expectedDuration(request.getExpectedDurationMinutes())
                .status(TaskStatus.PENDING)
                .inventoryFish(inventoryFish)
                .build();

        Task savedTask = taskRepository.save(task);

        return TaskResponse.builder()
                .id(savedTask.getId())
                .title(savedTask.getTitle())
                .tag(savedTask.getTag())
                .expectedDuration(savedTask.getExpectedDuration())
                .status(savedTask.getStatus())
                .createdAt(savedTask.getCreatedAt())
                .build();
    }
}
