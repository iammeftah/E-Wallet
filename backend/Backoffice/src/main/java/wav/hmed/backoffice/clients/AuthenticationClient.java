package wav.hmed.backoffice.clients;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import wav.hmed.backoffice.entity.RegistrationStatus;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AuthenticationClient {
    private final RestTemplate restTemplate;
    private final String authServiceUrl = "http://localhost:8091";

    public void updateAgentStatus(Long agentId, RegistrationStatus status) {
        restTemplate.put(
                authServiceUrl + "/api/agents/" + agentId + "/status",
                status.name()
        );
    }

    public List<Map<String, Object>> getAllAgents() {
        return restTemplate.getForObject(
                authServiceUrl + "/api/agents",
                List.class
        );
    }
}