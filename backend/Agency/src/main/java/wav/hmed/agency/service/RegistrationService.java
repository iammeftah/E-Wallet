package wav.hmed.agency.service;

import org.springframework.stereotype.Service;
import wav.hmed.agency.client.AuthenticationClient;
import wav.hmed.agency.dto.ClientDTO;
import wav.hmed.agency.entity.RegistrationRequest;
import wav.hmed.agency.entity.RegistrationStatus;
import wav.hmed.agency.repository.RegistrationRequestRepository;

import java.util.List;

@Service
public class RegistrationService {
    private final RegistrationRequestRepository registrationRequestRepository;
    private final AuthenticationClient authenticationClient;

    public RegistrationService(RegistrationRequestRepository registrationRequestRepository, AuthenticationClient authenticationClient) {
        this.registrationRequestRepository = registrationRequestRepository;
        this.authenticationClient = authenticationClient;
    }

    public RegistrationRequest createRegistrationRequest(ClientDTO clientDTO) {
        RegistrationRequest request = new RegistrationRequest();
        request.setClientId(clientDTO.getId());
        request.setFirstName(clientDTO.getFirstName());
        request.setLastName(clientDTO.getLastName());
        request.setEmail(clientDTO.getEmail());
        request.setPhone(clientDTO.getPhone());
        request.setStatus(RegistrationStatus.PENDING);
        request.setAddress(clientDTO.getAddress());

        return registrationRequestRepository.save(request);
    }

    public void approveRegistration(Long requestId) {
        RegistrationRequest request = registrationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(RegistrationStatus.ACCEPTED);
        registrationRequestRepository.save(request);

        // Notify Authentication service
        authenticationClient.sendRegistrationResponse(request.getClientId(), "ACCEPTED");
    }
}
