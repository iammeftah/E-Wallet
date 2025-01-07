package wav.hmed.agency2.service;

import ch.qos.logback.core.net.server.Client;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wav.hmed.agency2.clients.AuthenticationClient;
import wav.hmed.agency2.dto.ClientDTO;
import wav.hmed.agency2.entity.RegistrationRequest;
import wav.hmed.agency2.entity.RegistrationStatus;
import wav.hmed.agency2.repository.RegistrationRequestRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {
    private final RegistrationRequestRepository repository;
    private final AuthenticationClient authenticationClient;
    private final ObjectMapper objectMapper;

    public RegistrationService(RegistrationRequestRepository repository, AuthenticationClient authenticationClient, ObjectMapper objectMapper) {
        this.repository = repository;
        this.authenticationClient = authenticationClient;
        this.objectMapper = objectMapper;
    }

    public Optional<RegistrationRequest> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public RegistrationRequest processRegistration(ClientDTO agentData) {
        RegistrationRequest request = new RegistrationRequest();
        request.fromClientDTO(agentData);
        request.setStatus(RegistrationStatus.PENDING);
        return repository.save(request);
    }

    public ClientDTO getClientDataFromRequest(RegistrationRequest request) {
        return request.toClientDTO();
    }

    @Transactional
    public RegistrationRequest updateStatus(Long requestId, RegistrationStatus newStatus) {
        if (newStatus == RegistrationStatus.ACCEPTED && (authToken == null || authToken.trim().isEmpty())) {
            throw new RuntimeException("Authentication token is required for approval");
        }

        RegistrationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(newStatus);

        if (newStatus == RegistrationStatus.ACCEPTED) {
            try {
                ClientDTO clientDTO = request.toClientDTO();
                clientDTO.setStatus(RegistrationStatus.ACCEPTED.name());

                // Ensure token is properly formatted
                String formattedToken = authToken.startsWith("Bearer ") ? authToken : "Bearer " + authToken;
                authenticationClient.createClient(clientDTO, formattedToken);
            } catch (Exception e) {
                System.out.println("Error in updateStatus: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to create client in auth service: " + e.getMessage(), e);
            }
        }

        return repository.save(request);
    }

    public List<RegistrationRequest> findAll() {
        return repository.findAll();
    }

    public List<RegistrationRequest> findByStatus(RegistrationStatus status) {
        return repository.findByStatus(status);
    }

    // Add this field to store the current user's token
    private String authToken;

    public void setAuthToken(String token) {
        this.authToken = token;
    }
}