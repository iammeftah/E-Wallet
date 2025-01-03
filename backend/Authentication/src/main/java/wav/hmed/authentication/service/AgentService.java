package wav.hmed.authentication.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.repository.AgentRepository;

import java.util.List;

@Service
public class AgentService {
    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public List<Agent> findAll() {
        return agentRepository.findAll();
    }

    public Agent save(Agent agent) {
        return agentRepository.save(agent);
    }

    public Agent update(Long id, Agent agent) {
        agent.setId(id);
        return agentRepository.save(agent);
    }

    public void delete(Long id) {
        agentRepository.deleteById(id);
    }

    public Agent updateStatus(Long id, RegistrationStatus status) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        agent.setStatus(status);
        return agentRepository.save(agent);
    }
}