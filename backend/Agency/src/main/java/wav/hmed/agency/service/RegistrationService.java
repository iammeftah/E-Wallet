package wav.hmed.agency.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wav.hmed.agency.client.AuthenticationClient;
import wav.hmed.agency.dto.ClientDTO;
import wav.hmed.agency.dto.ClientRegistrationResponse;
import wav.hmed.agency.entity.RegistrationRequest;
import wav.hmed.agency.entity.RegistrationStatus;
import wav.hmed.agency.repository.RegistrationRequestRepository;

import java.util.List;

@Service
public class RegistrationService {
    private final RegistrationRequestRepository repository;
    private final AuthenticationClient authenticationClient;

    public RegistrationService(RegistrationRequestRepository repository, AuthenticationClient authenticationClient) {
        this.repository = repository;
        this.authenticationClient = authenticationClient;
    }

    @Transactional
    public RegistrationRequest processRegistration(ClientDTO clientData) {
        RegistrationRequest request = new RegistrationRequest();
        request.fromClientDTO(clientData);
        request.setStatus(RegistrationStatus.PENDING);
        return repository.save(request);
    }

    @Transactional
    public RegistrationRequest updateStatus(Long requestId, RegistrationStatus newStatus, String authToken) {
        RegistrationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(newStatus);
        repository.save(request);

        ClientRegistrationResponse response = new ClientRegistrationResponse(request.getClientId(), newStatus.name());
        authenticationClient.sendRegistrationResponse(response, authToken);

        return request;
    }

    public List<RegistrationRequest> findAll() {
        return repository.findAll();
    }

    public List<RegistrationRequest> findByStatus(RegistrationStatus status) {
        return repository.findByStatus(status);
    }
}

