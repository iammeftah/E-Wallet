package wav.hmed.authentication.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import wav.hmed.authentication.dto.ClientDTO;
import wav.hmed.authentication.entity.Client;

@Component
public class AgencyClient {
    private final RestTemplate restTemplate;
    private final String agencyServiceUrl;

    public AgencyClient(RestTemplate restTemplate,
                        @Value("${agency.service.url}") String agencyServiceUrl) {
        this.restTemplate = restTemplate;
        this.agencyServiceUrl = agencyServiceUrl;
    }

    public void sendRegistrationRequest(ClientDTO clientDTO) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ClientDTO> request = new HttpEntity<>(clientDTO, headers);

        restTemplate.postForObject(
                agencyServiceUrl + "/api/agency/registration-requests",
                request,
                Void.class
        );
    }
}

