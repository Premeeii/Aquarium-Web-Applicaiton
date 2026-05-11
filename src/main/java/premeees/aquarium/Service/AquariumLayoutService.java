package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import premeees.aquarium.Entity.AquariumLayout;
import premeees.aquarium.Entity.User;
import premeees.aquarium.Repository.AquariumLayoutRepository;
import premeees.aquarium.Repository.UserRepository;
import premeees.aquarium.dto.AquariumLayoutRequest;
import premeees.aquarium.dto.AquariumLayoutResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AquariumLayoutService {

    private final AquariumLayoutRepository aquariumLayoutRepository;
    private final UserRepository userRepository;

    public List<AquariumLayoutResponse> getLayout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return aquariumLayoutRepository.findByUser(user).stream()
                .map(layout -> AquariumLayoutResponse.builder()
                        .id(layout.getId())
                        // Derive frontend ID so the frontend can match it
                        .frontendId("placed-" + layout.getInstanceId()) 
                        .instanceType(layout.getInstanceType())
                        .instanceId(layout.getInstanceId())
                        .posX(layout.getPosX())
                        .posY(layout.getPosY())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<AquariumLayoutResponse> saveLayout(String username, AquariumLayoutRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Simplest approach: Delete old layout, insert new ones
        aquariumLayoutRepository.deleteByUser(user);

        List<AquariumLayout> newLayouts = request.getItems().stream()
                .map(item -> AquariumLayout.builder()
                        .user(user)
                        .instanceType(item.getInstanceType())
                        .instanceId(item.getInstanceId())
                        .posX(item.getPosX())
                        .posY(item.getPosY())
                        .build())
                .collect(Collectors.toList());

        aquariumLayoutRepository.saveAll(newLayouts);

        return getLayout(username);
    }
}
