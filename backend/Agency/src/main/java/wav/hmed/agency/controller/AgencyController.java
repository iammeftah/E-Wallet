package wav.hmed.agency.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.agency.dto.ClientDTO;
import wav.hmed.agency.entity.RegistrationRequest;
import wav.hmed.agency.service.RegistrationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/agency")
public class AgencyController {
    private final RegistrationService registrationService;

    public AgencyController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/registration-requests/list")
    public ResponseEntity<List<ClientDTO>> getRegistrationRequests() {
        List<RegistrationRequest> requests = registrationService.getRegistrationRequests();
        return ResponseEntity.ok(requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()));
    }

    private ClientDTO convertToDTO(RegistrationRequest request) {
        ClientDTO dto = new ClientDTO();
        dto.setId(request.getClientId());
        dto.setFirstName(request.getFirstName());
        dto.setLastName(request.getLastName());
        dto.setEmail(request.getEmail());
        dto.setPhone(request.getPhone());
        dto.setStatus(request.getStatus().toString());
        // Set other fields as needed
        return dto;
    }

    @PostMapping("/registration-requests")
    public ResponseEntity<?> handleRegistrationRequest(@RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(registrationService.createRegistrationRequest(clientDTO));
    }

    @PostMapping("/registration-requests/{requestId}/approve")
    public ResponseEntity<?> approveRegistration(@PathVariable Long requestId) {
        registrationService.approveRegistration(requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/registration-requests/{requestId}/reject")
    public ResponseEntity<?> rejectRegistration(@PathVariable Long requestId) {
        registrationService.rejectRegistration(requestId);
        return ResponseEntity.ok().build();
    }
}
