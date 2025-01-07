package wav.hmed.agency.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.agency.dto.ClientDTO;
import wav.hmed.agency.entity.RegistrationStatus;
import wav.hmed.agency.service.RegistrationService;

import java.util.Map;

@RestController
@RequestMapping("/api/client-registrations")
public class AgencyController {
    private final RegistrationService registrationService;

    public AgencyController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody ClientDTO clientData) {
        return ResponseEntity.ok(registrationService.processRegistration(clientData));
    }

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        return ResponseEntity.ok(registrationService.findAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests() {
        return ResponseEntity.ok(registrationService.findByStatus(RegistrationStatus.PENDING));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest,
            @RequestHeader("Authorization") String authToken) {
        RegistrationStatus status = RegistrationStatus.valueOf(statusRequest.get("status"));
        return ResponseEntity.ok(registrationService.updateStatus(id, status, authToken));
    }
}
