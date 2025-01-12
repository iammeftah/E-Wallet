package wav.hmed.agency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wav.hmed.agency.entity.RegistrationRequest;
import wav.hmed.agency.entity.RegistrationStatus;

import java.util.List;

public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
    List<RegistrationRequest> findByStatus(RegistrationStatus status);
}

