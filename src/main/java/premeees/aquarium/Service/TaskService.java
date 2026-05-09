package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import premeees.aquarium.dto.TaskCreateRequest;
import premeees.aquarium.dto.TaskResponse;
import premeees.aquarium.dto.TaskCompleteRequest;
import premeees.aquarium.dto.TaskCompleteResponse;
import premeees.aquarium.Entity.Task;
import premeees.aquarium.Entity.User;
import premeees.aquarium.Entity.UserInventory;
import premeees.aquarium.Entity.UserFishInstance;
import premeees.aquarium.Entity.enums.ItemType;
import premeees.aquarium.Entity.enums.TaskStatus;
import premeees.aquarium.Entity.enums.GrowthStage;
import premeees.aquarium.Repository.TaskRepository;
import premeees.aquarium.Repository.UserInventoryRepository;
import premeees.aquarium.Repository.UserRepository;
import premeees.aquarium.Repository.UserFishInstanceRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final UserInventoryRepository userInventoryRepository;
    private final UserFishInstanceRepository userFishInstanceRepository;

    public List<TaskResponse> getTasks(String username) {
        return taskRepository.findByUserUsernameOrderByCreatedAtDesc(username).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .tag(task.getTag())
                .expectedDuration(task.getExpectedDuration())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .build();
    }

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
        return mapToResponse(savedTask);
    }

    @Transactional
    public TaskCompleteResponse completeTask(String username, Long taskId, TaskCompleteRequest request) {
        // 1. Find the task
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // 2. Validate ownership
        if (!task.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Task does not belong to the user");
        }

        // 3. Validate status
        if (task.getStatus() != TaskStatus.PENDING) {
            throw new RuntimeException("Task is already " + task.getStatus());
        }

        // 4. Update task
        task.setStatus(TaskStatus.COMPLETED);
        task.setActualDuration(request.getActualDurationMinutes());
        taskRepository.save(task);

        // 5. Calculate coins earned (1 coin per minute, bonus if completed on time)
        int coinsEarned = request.getActualDurationMinutes();
        if (!Boolean.TRUE.equals(request.getCompletedEarly())) {
            // Bonus 10 coins for completing the full duration
            coinsEarned += 10;
        }

        // 6. Update user coins
        User user = task.getUser();
        user.setCoins(user.getCoins() + coinsEarned);
        userRepository.save(user);

        // 7. Update fish growth if a fish was assigned
        TaskCompleteResponse.FishUpdateInfo fishUpdateInfo = null;
        if (task.getInventoryFish() != null) {
            UserFishInstance fishInstance = task.getInventoryFish().getFishInstance();
            if (fishInstance != null) {
                // Increase growth progress based on actual duration
                int progressGain = request.getActualDurationMinutes();
                int newProgress = Math.min(fishInstance.getGrowthProgress() + progressGain, 100);
                fishInstance.setGrowthProgress(newProgress);

                // Evolve growth stage based on progress
                if (newProgress >= 100) {
                    fishInstance.setGrowthStage(GrowthStage.ADULT);
                } else if (newProgress >= 50) {
                    fishInstance.setGrowthStage(GrowthStage.BABY);
                }

                userFishInstanceRepository.save(fishInstance);

                fishUpdateInfo = TaskCompleteResponse.FishUpdateInfo.builder()
                        .instanceId(fishInstance.getId())
                        .growthStage(fishInstance.getGrowthStage())
                        .growthProgress(fishInstance.getGrowthProgress())
                        .build();
            }
        }

        return TaskCompleteResponse.builder()
                .taskId(task.getId())
                .status(task.getStatus())
                .coinsEarned(coinsEarned)
                .fishUpdate(fishUpdateInfo)
                .build();
    }
}

