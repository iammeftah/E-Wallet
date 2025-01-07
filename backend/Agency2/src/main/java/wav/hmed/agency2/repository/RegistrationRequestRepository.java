package wav.hmed.agency2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wav.hmed.agency2.entity.RegistrationRequest;
import wav.hmed.agency2.entity.RegistrationStatus;

import java.util.List;

@Repository
public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
    List<RegistrationRequest> findByStatus(RegistrationStatus status);
}