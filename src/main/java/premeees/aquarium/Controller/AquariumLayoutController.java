package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import premeees.aquarium.Service.AquariumLayoutService;
import premeees.aquarium.dto.AquariumLayoutRequest;
import premeees.aquarium.dto.AquariumLayoutResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/layout")
@RequiredArgsConstructor
public class AquariumLayoutController {

    private final AquariumLayoutService aquariumLayoutService;

    @GetMapping
    public ResponseEntity<List<AquariumLayoutResponse>> getLayout(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(aquariumLayoutService.getLayout(username));
    }

    @PostMapping
    public ResponseEntity<List<AquariumLayoutResponse>> saveLayout(@RequestBody AquariumLayoutRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(aquariumLayoutService.saveLayout(username, request));
    }
}
