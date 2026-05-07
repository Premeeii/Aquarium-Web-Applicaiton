package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import premeees.aquarium.Entity.User;
import premeees.aquarium.Repository.UserRepository;
import premeees.aquarium.Repository.UserInventoryRepository;
import premeees.aquarium.Security.JwtUtil;
import premeees.aquarium.dto.*;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserInventoryRepository userInventoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @org.springframework.transaction.annotation.Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .coins(0)
                .streakCount(0)
                .lastLoginDate(LocalDateTime.now())
                .build();

        userRepository.save(user);

        // Grant Starter Fish
        premeees.aquarium.Entity.UserInventory starterFish = premeees.aquarium.Entity.UserInventory.builder()
                .user(user)
                .itemType(premeees.aquarium.Entity.enums.ItemType.FISH)
                .itemId(1)
                .build();
        userInventoryRepository.save(starterFish);

        String token = jwtUtil.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        // Update last login date
        user.setLastLoginDate(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .message("Login successful")
                .build();
    }

    public UserProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .coins(user.getCoins())
                .streakCount(user.getStreakCount())
                .lastLoginDate(user.getLastLoginDate())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
