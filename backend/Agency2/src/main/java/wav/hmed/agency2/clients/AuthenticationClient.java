package wav.hmed.agency2.clients;

import ch.qos.logback.core.net.server.Client;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import wav.hmed.agency2.dto.ClientDTO;
import wav.hmed.agency2.entity.RegistrationStatus;

@Component
public class AuthenticationClient {
    private final RestTemplate restTemplate;
    private final String authServiceUrl = "http://localhost:8091";

    public AuthenticationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void createClient(ClientDTO clientDTO, String authToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Ensure token has Bearer prefix
        String formattedToken = authToken.startsWith("Bearer ") ? authToken : "Bearer " + authToken;
        headers.set("Authorization", formattedToken);

        HttpEntity<ClientDTO> request = new HttpEntity<>(clientDTO, headers);

        try {
            restTemplate.exchange(
                    authServiceUrl + "/api/clients/create",
                    HttpMethod.POST,
                    request,
                    Client.class
            );
        } catch (HttpClientErrorException e) {
            System.out.println("Error creating client. Status code: " + e.getStatusCode());
            System.out.println("Error response body: " + e.getResponseBodyAsString());
            throw new RuntimeException("Failed to create client: " + e.getMessage(), e);
        }
    }

    public void updateClientStatus(String clientId, RegistrationStatus status, String authToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", ensureBearerToken(authToken));

        HttpEntity<String> request = new HttpEntity<>(status.name(), headers);

        try {
            restTemplate.put(
                    authServiceUrl + "/api/clients/" + clientId + "/status",
                    request
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to update client status: " + e.getMessage(), e);
        }
    }

    private String ensureBearerToken(String token) {
        return token.startsWith("Bearer ") ? token : "Bearer " + token;
    }
}