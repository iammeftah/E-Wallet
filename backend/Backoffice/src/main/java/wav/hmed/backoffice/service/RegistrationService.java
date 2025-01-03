package wav.hmed.backoffice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wav.hmed.backoffice.entity.RegistrationRequest;
import wav.hmed.backoffice.entity.RegistrationStatus;
import wav.hmed.backoffice.repository.RegistrationRequestRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final RegistrationRequestRepository repository;


    public RegistrationRequest save(RegistrationRequest request) {
        return repository.save(request);
    }

    public List<RegistrationRequest> findAll() {
        return repository.findAll();
    }

    public List<RegistrationRequest> findByStatus(RegistrationStatus status) {
        return repository.findByStatus(status);
    }

    public RegistrationRequest updateStatus(Long id, RegistrationStatus status) {
        RegistrationRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return repository.save(request);
    }
}