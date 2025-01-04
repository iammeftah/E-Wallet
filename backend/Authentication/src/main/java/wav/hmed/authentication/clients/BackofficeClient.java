// BackofficeClient.java in Authentication
package wav.hmed.authentication.clients;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import wav.hmed.authentication.dto.AgentDTO;
import wav.hmed.authentication.entity.Agent;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Component
public class BackofficeClient {
    private final RestTemplate restTemplate;
    private final String backofficeUrl = "http://localhost:8092/api/registration-requests";

    public BackofficeClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendRegistrationRequest(Agent agent) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Convert Agent to AgentDTO
        AgentDTO agentDTO = convertToDTO(agent);

        HttpEntity<AgentDTO> request = new HttpEntity<>(agentDTO, headers);

        restTemplate.postForObject(
                backofficeUrl,
                request,
                Void.class
        );
    }

    private AgentDTO convertToDTO(Agent agent) {
        AgentDTO dto = new AgentDTO();
        dto.setId(agent.getId());
        dto.setFirstName(agent.getFirstName());
        dto.setLastName(agent.getLastName());
        dto.setEmail(agent.getEmail());
        dto.setPhone(agent.getPhone());
        dto.setIdType(agent.getIdType());
        dto.setIdNumber(agent.getIdNumber());
        dto.setBirthdate(agent.getBirthdate());
        dto.setAddress(agent.getAddress());
        dto.setImmatriculation(agent.getImmatriculation());
        dto.setPatentNumber(agent.getPatentNumber());
        dto.setStatus(agent.getStatus().name());
        return dto;
    }
}