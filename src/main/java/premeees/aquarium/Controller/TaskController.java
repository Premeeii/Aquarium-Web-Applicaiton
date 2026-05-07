package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import premeees.aquarium.dto.TaskCreateRequest;
import premeees.aquarium.dto.TaskResponse;
import premeees.aquarium.Service.TaskService;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskCreateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        TaskResponse response = taskService.createTask(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
