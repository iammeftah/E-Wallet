package wav.hmed.agency.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import wav.hmed.agency.dto.ClientRegistrationResponse;

@Component
public class AuthenticationClient {
    private final RestTemplate restTemplate;
    private final String authUrl = "http://localhost:8091/api/registration-response/client";

    public AuthenticationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendRegistrationResponse(Long clientId, String status) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ClientRegistrationResponse response = new ClientRegistrationResponse(clientId, status);
        HttpEntity<ClientRegistrationResponse> request = new HttpEntity<>(response, headers);

        restTemplate.postForObject(authUrl, request, Void.class);
    }
}