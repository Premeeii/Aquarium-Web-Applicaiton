package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import premeees.aquarium.dto.TaskCreateRequest;
import premeees.aquarium.dto.TaskResponse;
import premeees.aquarium.dto.TaskCompleteRequest;
import premeees.aquarium.dto.TaskCompleteResponse;
import premeees.aquarium.Service.TaskService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/me")
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(taskService.getTasks(username));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskCreateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        TaskResponse response = taskService.createTask(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{taskId}/complete")
    public ResponseEntity<TaskCompleteResponse> completeTask(
            @PathVariable Long taskId,
            @RequestBody TaskCompleteRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        TaskCompleteResponse response = taskService.completeTask(username, taskId, request);
        return ResponseEntity.ok(response);
    }
}

