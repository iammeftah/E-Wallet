package wav.hmed.authentication.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class NotificationClient {
    private final RestTemplate restTemplate;
    private final String notificationServiceUrl;

    public NotificationClient(
            RestTemplate restTemplate,
            @Value("${notification.service.url:http://localhost:8095}") String notificationServiceUrl) {
        this.restTemplate = restTemplate;
        this.notificationServiceUrl = notificationServiceUrl;
    }

    public void sendEmail(String email, String subject, String message) {
        if (email == null || subject == null || message == null) {
            throw new IllegalArgumentException("Email, subject, and message cannot be null");
        }

        try {
            String endpoint = notificationServiceUrl + "/send-email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("to", email);
            map.add("subject", subject);
            map.add("text", message);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            restTemplate.postForObject(endpoint, request, String.class);
            System.out.println("Email notification sent successfully to: " + email);
        } catch (Exception e) {
            System.err.println("Failed to send notification email: " + e.getMessage());
            e.printStackTrace(); // Add this for more detailed error information
        }
    }
}