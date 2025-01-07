package wav.hmed.authentication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import wav.hmed.authentication.entity.Client;
import wav.hmed.authentication.entity.RegistrationStatus;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    List<Client> findByRegistrationStatus(RegistrationStatus registrationStatus);


}