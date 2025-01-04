package wav.hmed.authentication.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.repository.AgentRepository;

import java.util.List;

@Service
public class AgentService {
    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    @Transactional
    public Agent registerAgent(Agent agent) {
        agent.setRole(Role.AGENT);
        agent.setStatus(RegistrationStatus.PENDING);
        return agentRepository.save(agent);
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