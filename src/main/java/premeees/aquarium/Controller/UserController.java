package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import premeees.aquarium.Service.AuthService;
import premeees.aquarium.dto.UserProfileResponse;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(Authentication authentication) {
        String username = authentication.getName();
        UserProfileResponse profile = authService.getProfile(username);
        return ResponseEntity.ok(profile);
    }
}
