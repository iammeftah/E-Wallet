package wav.hmed.backoffice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.backoffice.clients.AuthenticationClient;
import wav.hmed.backoffice.entity.RegistrationRequest;
import wav.hmed.backoffice.entity.RegistrationStatus;
import wav.hmed.backoffice.service.RegistrationService;

import java.util.Map;

@RestController
@RequestMapping("/api/registration-requests")
@RequiredArgsConstructor
public class BackofficeController {
    private RegistrationService registrationService;
    private final AuthenticationClient authenticationClient;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> agentData) throws JsonProcessingException {
        RegistrationRequest request = new RegistrationRequest();
        request.setAgentId((Long) agentData.get("id"));
        request.setAgentData(new ObjectMapper().writeValueAsString(agentData));
        return ResponseEntity.ok(registrationService.save(request));
    }

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        return ResponseEntity.ok(registrationService.findAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests() {
        return ResponseEntity.ok(registrationService.findByStatus(RegistrationStatus.PENDING));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id) {
        RegistrationRequest request = registrationService.updateStatus(id, RegistrationStatus.ACCEPTED);
        authenticationClient.updateAgentStatus(request.getAgentId(), RegistrationStatus.ACCEPTED);
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<?> declineRequest(@PathVariable Long id) {
        RegistrationRequest request = registrationService.updateStatus(id, RegistrationStatus.DECLINED);
        authenticationClient.updateAgentStatus(request.getAgentId(), RegistrationStatus.DECLINED);
        return ResponseEntity.ok(request);
    }
}