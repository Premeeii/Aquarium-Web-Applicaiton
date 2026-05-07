package premeees.aquarium.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import premeees.aquarium.dto.FishCreateRequest;
import premeees.aquarium.dto.FishResponse;
import premeees.aquarium.Entity.Fish;
import premeees.aquarium.Repository.FishRepository;

@Service
@RequiredArgsConstructor
public class FishService {

    private final FishRepository fishRepository;

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

        return FishResponse.builder()
                .id(savedFish.getId())
                .speciesName(savedFish.getSpeciesName())
                .description(savedFish.getDescription())
                .basePrice(savedFish.getBasePrice())
                .rarity(savedFish.getRarity())
                .imageUrlEgg(savedFish.getImageUrlEgg())
                .imageUrlBaby(savedFish.getImageUrlBaby())
                .imageUrlAdult(savedFish.getImageUrlAdult())
                .build();
    }
}
