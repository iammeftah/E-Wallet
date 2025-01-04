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

    @Transactional
    public RegistrationRequest updateStatus(Long requestId, RegistrationStatus newStatus) {
        RegistrationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Update status in backoffice
        request.setStatus(newStatus);
        repository.save(request);

        // Update status in auth service
        try {
            authenticationClient.updateAgentStatus(request.getAgentId(), newStatus);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update status in auth service", e);
        }

        return request;
    }

    public List<RegistrationRequest> findAll() {
        return repository.findAll();
    }

    public List<RegistrationRequest> findByStatus(RegistrationStatus status) {
        return repository.findByStatus(status);
    }
}