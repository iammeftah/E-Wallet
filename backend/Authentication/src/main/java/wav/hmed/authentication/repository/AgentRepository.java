package wav.hmed.authentication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    List<Agent> findByStatus(RegistrationStatus status);

    Optional<Agent> findByEmail(String email);  // Add this method

}