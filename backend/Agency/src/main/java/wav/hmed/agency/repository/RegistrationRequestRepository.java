package wav.hmed.agency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wav.hmed.agency.entity.RegistrationRequest;

public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
}
