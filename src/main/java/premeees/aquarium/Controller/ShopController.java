package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import premeees.aquarium.Service.ShopService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping("/purchase/{fishId}")
    public ResponseEntity<?> purchaseFish(@PathVariable Integer fishId, Authentication authentication) {
        try {
            String username = authentication.getName();
            shopService.purchaseFish(username, fishId);
            return ResponseEntity.ok(Map.of("message", "Purchase successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/purchase/decoration/{decorationId}")
    public ResponseEntity<?> purchaseDecoration(@PathVariable Integer decorationId, Authentication authentication) {
        try {
            String username = authentication.getName();
            shopService.purchaseDecoration(username, decorationId);
            return ResponseEntity.ok(Map.of("message", "Purchase successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
