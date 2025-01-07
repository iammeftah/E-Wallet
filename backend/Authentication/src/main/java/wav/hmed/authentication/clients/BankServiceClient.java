package wav.hmed.authentication.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import wav.hmed.authentication.dto.CreateAccountRequest;
import wav.hmed.authentication.dto.AccountResponse;

@Component
public class BankServiceClient {
    private final RestTemplate restTemplate;
    private final String bankServiceUrl;

    public BankServiceClient(
            RestTemplate restTemplate,
            @Value("${bank.service.url}") String bankServiceUrl) {
        this.restTemplate = restTemplate;
        this.bankServiceUrl = bankServiceUrl;
    }

    public AccountResponse createAccount(CreateAccountRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<CreateAccountRequest> entity = new HttpEntity<>(request, headers);

        return restTemplate.postForObject(
                bankServiceUrl + "/api/accounts",
                entity,
                AccountResponse.class
        );
    }
}