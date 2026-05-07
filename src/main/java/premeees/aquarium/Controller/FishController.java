package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import premeees.aquarium.dto.FishCreateRequest;
import premeees.aquarium.dto.FishResponse;
import premeees.aquarium.Service.FishService;

@RestController
@RequestMapping("/api/v1/fishes")
@RequiredArgsConstructor
public class FishController {

    private final FishService fishService;

    @PostMapping
    public ResponseEntity<FishResponse> createFish(@RequestBody FishCreateRequest request) {
        FishResponse response = fishService.createFish(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
