package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import premeees.aquarium.Service.UserInventoryService;
import premeees.aquarium.dto.UserInventoryResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class UserInventoryController {

    private final UserInventoryService userInventoryService;

    @GetMapping("/me")
    public ResponseEntity<List<UserInventoryResponse>> getMyInventory(Authentication authentication) {
        String username = authentication.getName();
        List<UserInventoryResponse> inventory = userInventoryService.getUserInventory(username);
        return ResponseEntity.ok(inventory);
    }
}
