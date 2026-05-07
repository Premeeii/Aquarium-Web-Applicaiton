package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import premeees.aquarium.dto.FishCreateRequest;
import premeees.aquarium.dto.FishResponse;
import premeees.aquarium.Entity.Fish;
import premeees.aquarium.Repository.FishRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FishService {

    private final FishRepository fishRepository;

    public List<FishResponse> getAllFishes() {
        return fishRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public FishResponse createFish(FishCreateRequest request) {
        Fish fish = new Fish();
        fish.setSpeciesName(request.getSpeciesName());
        fish.setDescription(request.getDescription());
        fish.setBasePrice(request.getBasePrice());
        fish.setRarity(request.getRarity());
        fish.setImageUrlEgg(request.getImageUrlEgg());
        fish.setImageUrlBaby(request.getImageUrlBaby());
        fish.setImageUrlAdult(request.getImageUrlAdult());

        Fish savedFish = fishRepository.save(fish);
        return mapToResponse(savedFish);
    }

    private FishResponse mapToResponse(Fish fish) {
        return FishResponse.builder()
                .id(fish.getId())
                .speciesName(fish.getSpeciesName())
                .description(fish.getDescription())
                .basePrice(fish.getBasePrice())
                .rarity(fish.getRarity())
                .imageUrlEgg(fish.getImageUrlEgg())
                .imageUrlBaby(fish.getImageUrlBaby())
                .imageUrlAdult(fish.getImageUrlAdult())
                .build();
    }
}
