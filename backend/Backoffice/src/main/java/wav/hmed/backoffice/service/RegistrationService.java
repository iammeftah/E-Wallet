package wav.hmed.backoffice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.transaction.annotation.Transactional;
import wav.hmed.backoffice.dto.AgentDTO;
import wav.hmed.backoffice.entity.RegistrationRequest;
import wav.hmed.backoffice.entity.RegistrationStatus;
import wav.hmed.backoffice.clients.AuthenticationClient;
import wav.hmed.backoffice.repository.RegistrationRequestRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final RegistrationRequestRepository repository;
    private final AuthenticationClient authenticationClient;
    private final ObjectMapper objectMapper;



    public Optional<RegistrationRequest> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public RegistrationRequest processRegistration(AgentDTO agentData) {
        RegistrationRequest request = new RegistrationRequest();
        request.fromAgentDTO(agentData);
        request.setStatus(RegistrationStatus.PENDING);
        return repository.save(request);
    }

    public AgentDTO getAgentDataFromRequest(RegistrationRequest request) {
        return request.toAgentDTO();
    }

    // In RegistrationService.java
    @Transactional
    public RegistrationRequest updateStatus(Long requestId, RegistrationStatus newStatus) {
        System.out.println("==== RegistrationService Debug ====");
        System.out.println("1. Processing request ID: " + requestId);
        System.out.println("2. New status: " + newStatus);
        System.out.println("3. Current auth token: " + authToken);

        RegistrationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(newStatus);

        if (newStatus == RegistrationStatus.ACCEPTED) {
            try {
                AgentDTO agentDTO = request.toAgentDTO();
                agentDTO.setStatus(RegistrationStatus.ACCEPTED.name());
                System.out.println("4. Converting to AgentDTO: " + agentDTO);

                // Make sure we're passing the full token
                String fullToken = authToken;
                if (!fullToken.startsWith("Bearer ")) {
                    fullToken = "Bearer " + authToken;
                }
                System.out.println("5. Final token being sent: " + fullToken);

                authenticationClient.createAgent(agentDTO, fullToken);
                System.out.println("6. Agent creation successful");
            } catch (Exception e) {
                System.out.println("==== Error in RegistrationService ====");
                e.printStackTrace();
                System.out.println("Error message: " + e.getMessage());
                System.out.println("Error cause: " + (e.getCause() != null ? e.getCause().getMessage() : "No cause"));
                throw new RuntimeException("Failed to create agent in auth service", e);
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