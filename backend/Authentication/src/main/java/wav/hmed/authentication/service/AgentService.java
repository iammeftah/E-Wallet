package wav.hmed.authentication.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import wav.hmed.authentication.dto.AgentDTO;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.repository.AgentRepository;

import java.util.List;
import java.util.UUID;

@Service
public class AgentService {
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;

    public AgentService(AgentRepository agentRepository, PasswordEncoder passwordEncoder) {
        this.agentRepository = agentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Agent registerAgent(Agent agent) {
        agent.setRole(Role.AGENT);
        agent.setStatus(RegistrationStatus.PENDING);
        return agentRepository.save(agent);
    }

    @Transactional
    public Agent createVerifiedAgent(AgentDTO agentDTO) {
        Agent agent = new Agent();
        // Map DTO fields to entity
        agent.setFirstName(agentDTO.getFirstName());
        agent.setLastName(agentDTO.getLastName());
        agent.setEmail(agentDTO.getEmail());
        agent.setPhone(agentDTO.getPhone());
        agent.setIdType(agentDTO.getIdType());
        agent.setIdNumber(agentDTO.getIdNumber());
        agent.setBirthdate(agentDTO.getBirthdate());
        agent.setAddress(agentDTO.getAddress());
        agent.setImmatriculation(agentDTO.getImmatriculation());
        agent.setPatentNumber(agentDTO.getPatentNumber());

        // Set verified status and role
        agent.setStatus(RegistrationStatus.ACCEPTED);
        agent.setRole(Role.AGENT);

        // Generate a temporary password and encode it
        String tempPassword = generateTemporaryPassword();

        // TODO: Send temporary password to agent via email/SMS


        agent.setPassword(passwordEncoder.encode(tempPassword));

        // Save the agent
        Agent savedAgent = agentRepository.save(agent);


        return savedAgent;
    }

    private String generateTemporaryPassword() {
        // Generate a random 8-character password
        return UUID.randomUUID().toString().substring(0, 8);
    }

    @Transactional
    public Agent updateStatus(Long agentId, RegistrationStatus status) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        agent.setStatus(status);
        return agentRepository.save(agent);
    }

    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    public Agent getAgentById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
    }

    public List<Agent> getAgentsByStatus(RegistrationStatus status) {
        return agentRepository.findByStatus(status);
    }
}