package wav.hmed.backoffice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wav.hmed.backoffice.dto.AgentDTO;
import wav.hmed.backoffice.service.RegistrationService;
import wav.hmed.backoffice.entity.RegistrationRequest;
import wav.hmed.backoffice.entity.RegistrationStatus;

import java.util.Map;

@RestController
@RequestMapping("/api/registration-requests")
@RequiredArgsConstructor
public class BackofficeController {
    private final RegistrationService registrationService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRequest(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("idType") String idType,
            @RequestParam("idNumber") String idNumber,
            @RequestParam("immatriculation") String immatriculation,
            @RequestParam("patentNumber") String patentNumber,
            @RequestParam(value = "idDocument", required = false) MultipartFile idDocument) {

        AgentDTO agentData = new AgentDTO();
        agentData.setFirstName(firstName);
        agentData.setLastName(lastName);
        agentData.setEmail(email);
        agentData.setPhone(phone);
        agentData.setIdType(idType);
        agentData.setIdNumber(idNumber);
        agentData.setImmatriculation(immatriculation);
        agentData.setPatentNumber(patentNumber);

        return ResponseEntity.ok(registrationService.processRegistration(agentData));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequest(@PathVariable Long id) {
        return registrationService.findById(id)
                .map(request -> {
                    AgentDTO agentData = registrationService.getAgentDataFromRequest(request);
                    return ResponseEntity.ok(Map.of(
                            "request", request,
                            "agentData", agentData
                    ));
                })
                .orElseThrow(() -> new RuntimeException("Request not found"));
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
            @RequestBody RegistrationStatus status) {
        return ResponseEntity.ok(registrationService.updateStatus(id, status));
    }
}