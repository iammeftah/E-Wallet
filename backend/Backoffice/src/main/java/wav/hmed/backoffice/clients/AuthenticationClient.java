package wav.hmed.backoffice.clients;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import wav.hmed.backoffice.dto.AgentDTO;
import wav.hmed.backoffice.entity.RegistrationStatus;

@Component
@RequiredArgsConstructor
public class AuthenticationClient {
    private final RestTemplate restTemplate;
    private final String authServiceUrl = "http://localhost:8091";

    // In AuthenticationClient.java
    public void createAgent(AgentDTO agentDTO, String authToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Debug logging
        System.out.println("==== AuthenticationClient Debug ====");
        System.out.println("1. Original auth token: " + authToken);

        // Normalize the token format
        String normalizedToken = authToken;
        if (!authToken.startsWith("Bearer ")) {
            normalizedToken = "Bearer " + authToken;
        }

        headers.set("Authorization", normalizedToken);

        // More debug logging
        System.out.println("2. Normalized token: " + normalizedToken);
        System.out.println("3. Request URL: " + authServiceUrl + "/api/agents/create");
        System.out.println("4. AgentDTO data: " + agentDTO);
        System.out.println("5. All headers: " + headers);

        HttpEntity<AgentDTO> request = new HttpEntity<>(agentDTO, headers);

        try {
            var response = restTemplate.exchange(
                    authServiceUrl + "/api/agents/create",
                    HttpMethod.POST,
                    request,
                    String.class
            );
            System.out.println("6. Response status: " + response.getStatusCode());
            System.out.println("7. Response body: " + response.getBody());
        } catch (HttpClientErrorException e) {
            System.out.println("==== Error Details ====");
            System.out.println("Status code: " + e.getStatusCode());
            System.out.println("Response body: " + e.getResponseBodyAsString());
            System.out.println("Response headers: " + e.getResponseHeaders());
            System.out.println("Full error: " + e);  // Add full error details
            throw new RuntimeException("Failed to create agent: " + e.getStatusCode() +
                    " - Response: " + e.getResponseBodyAsString(), e);
        }
    }

    public void updateAgentStatus(Long agentId, RegistrationStatus status, String authToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Ensure proper token format
        if (!authToken.startsWith("Bearer ")) {
            authToken = "Bearer " + authToken;
        }
        headers.set("Authorization", authToken);

        HttpEntity<String> request = new HttpEntity<>(status.name(), headers);

        try {
            restTemplate.put(
                    authServiceUrl + "/api/agents/" + agentId + "/status",
                    request
            );
        } catch (HttpClientErrorException e) {
            System.out.println("Error updating status: " + e.getResponseBodyAsString());
            throw new RuntimeException("Failed to update agent status: " + e.getMessage(), e);
        }
    }
}