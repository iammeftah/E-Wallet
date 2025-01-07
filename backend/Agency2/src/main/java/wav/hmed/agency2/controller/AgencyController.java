package wav.hmed.agency2.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wav.hmed.agency2.dto.ClientDTO;
import wav.hmed.agency2.entity.RegistrationStatus;
import wav.hmed.agency2.service.FileStorageService;
import wav.hmed.agency2.service.RegistrationService;

import java.util.Map;

@RestController
@RequestMapping("/api/agency/registration-requests")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AgencyController {
    private final RegistrationService registrationService;
    private final FileStorageService fileStorageService;

    public AgencyController(RegistrationService registrationService, FileStorageService fileStorageService) {
        this.registrationService = registrationService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRequest(
            @RequestParam("clientType") String clientType,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("phone") String phone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "idType", required = false) String idType,
            @RequestParam(value = "idNumber", required = false) String idNumber,
            @RequestPart(value = "idDocument", required = false) MultipartFile idDocument,
            @RequestPart(value = "idDocumentBack", required = false) MultipartFile idDocumentBack,
            @RequestPart(value = "incomeProof", required = false) MultipartFile incomeProof
    ) {
        // Create ClientDTO with the form data
        ClientDTO clientData = new ClientDTO();
        clientData.setClientType(clientType);
        clientData.setFirstName(firstName);
        clientData.setLastName(lastName);
        clientData.setPhone(phone);
        clientData.setEmail(email);
        clientData.setIdType(idType);
        clientData.setIdNumber(idNumber);
        clientData.setStatus("PENDING");

        // Store files if present
        if (idDocument != null) {
            String idDocPath = fileStorageService.storeFile(idDocument);
            // You might want to store this path in your database
        }

        if (idDocumentBack != null) {
            String idDocBackPath = fileStorageService.storeFile(idDocumentBack);
            // Store path in database
        }

        if (incomeProof != null) {
            String incomeProofPath = fileStorageService.storeFile(incomeProof);
            // Store path in database
        }

        return ResponseEntity.ok(registrationService.processRegistration(clientData));
    }

    // Other existing endpoints remain the same
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequest(@PathVariable Long id) {
        return registrationService.findById(id)
                .map(request -> {
                    ClientDTO clientData = registrationService.getClientDataFromRequest(request);
                    return ResponseEntity.ok(Map.of(
                            "request", request,
                            "clientData", clientData
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
            @RequestBody Map<String, String> statusRequest,
            @RequestHeader("Authorization") String authToken
    ) {
        System.out.println("==== BackofficeController Debug ====");
        System.out.println("1. Received request for ID: " + id);
        System.out.println("2. Status request: " + statusRequest);
        System.out.println("3. Auth token received: " + authToken);

        registrationService.setAuthToken(authToken);
        RegistrationStatus status = RegistrationStatus.valueOf(statusRequest.get("status"));
        return ResponseEntity.ok(registrationService.updateStatus(id, status));
    }
}