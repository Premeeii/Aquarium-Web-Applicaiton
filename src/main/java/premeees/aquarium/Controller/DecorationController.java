package premeees.aquarium.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import premeees.aquarium.Service.DecorationService;
import premeees.aquarium.dto.DecorationResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/decorations")
@RequiredArgsConstructor
public class DecorationController {

    private final DecorationService decorationService;

    @GetMapping
    public ResponseEntity<List<DecorationResponse>> getAllDecorations() {
        return ResponseEntity.ok(decorationService.getAllDecorations());
    }
}
