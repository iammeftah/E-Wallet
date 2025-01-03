package wav.hmed.authentication.clients;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import wav.hmed.authentication.entity.Agent;

@Component
public class BackofficeClient {
    private final RestTemplate restTemplate;
    private final String backofficeUrl = "http://localhost:8092";

    public BackofficeClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendRegistrationRequest(Agent agent) {
        restTemplate.postForObject(
                backofficeUrl + "/api/registration-requests",
                agent,
                Void.class
        );
    }
}