package wav.hmed.bank.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import wav.hmed.bank.dto.UserInfo;

@Component
public class AuthenticationClient {
    private final RestTemplate restTemplate;
    private final String authServiceUrl;

    public AuthenticationClient(RestTemplate restTemplate, @Value("${authentication.service.url}") String authServiceUrl) {
        this.restTemplate = restTemplate;
        this.authServiceUrl = authServiceUrl;
    }

    public UserInfo validateTokenAndGetUser(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", token);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<UserInfo> response = restTemplate.exchange(
                    authServiceUrl + "/api/auth/validate",
                    HttpMethod.GET,
                    entity,
                    UserInfo.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }

            throw new RuntimeException("Failed to validate token");
        } catch (Exception e) {
            throw new RuntimeException("Error validating token: " + e.getMessage(), e);
        }
    }

    public boolean validateToken(String token) {
        try {
            validateTokenAndGetUser(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasRole(String token, String requiredRole) {
        UserInfo userInfo = validateTokenAndGetUser(token);
        // Compare with single role instead of checking a list
        return ("ROLE_" + requiredRole).equals(userInfo.getRole());
    }

    public Long getUserIdFromToken(String token) {
        UserInfo userInfo = validateTokenAndGetUser(token);
        return userInfo.getId();
    }
}