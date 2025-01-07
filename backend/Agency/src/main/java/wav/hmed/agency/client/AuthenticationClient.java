package wav.hmed.agency.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import wav.hmed.agency.dto.ClientRegistrationResponse;

@Component
public class AuthenticationClient {
    private final RestTemplate restTemplate;
    private final String authServiceUrl = "http://localhost:8091";

    public AuthenticationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendRegistrationResponse(ClientRegistrationResponse response, String authToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authToken);

        HttpEntity<ClientRegistrationResponse> request = new HttpEntity<>(response, headers);

        try {
            restTemplate.exchange(
                    authServiceUrl + "/api/clients/registration-response",
                    HttpMethod.POST,
                    request,
                    String.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to send registration response: " + e.getMessage(), e);
        }
    }
}
