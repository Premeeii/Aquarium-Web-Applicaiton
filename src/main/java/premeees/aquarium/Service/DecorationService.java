package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import premeees.aquarium.Entity.Decoration;
import premeees.aquarium.Repository.DecorationRepository;
import premeees.aquarium.dto.DecorationResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DecorationService {

    private final DecorationRepository decorationRepository;

    public List<DecorationResponse> getAllDecorations() {
        return decorationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DecorationResponse mapToResponse(Decoration decoration) {
        return DecorationResponse.builder()
                .id(decoration.getId())
                .itemName(decoration.getItemName())
                .category(decoration.getCategory())
                .price(decoration.getPrice())
                .imageUrl(decoration.getImageUrl())
                .build();
    }
}
