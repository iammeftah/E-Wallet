package wav.hmed.authentication.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wav.hmed.authentication.clients.BankServiceClient;
import wav.hmed.authentication.dto.CreateAccountRequest;
import wav.hmed.authentication.dto.AccountResponse;
import wav.hmed.authentication.entity.Client;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.repository.ClientRepository;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final BankServiceClient bankServiceClient;

    public ClientService(ClientRepository clientRepository, BankServiceClient bankServiceClient) {
        this.clientRepository = clientRepository;
        this.bankServiceClient = bankServiceClient;
    }

    @Transactional
    public Client registerClient(Client client) {
        // Validate unique constraints
        if (clientRepository.existsByPhone(client.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create bank account
        CreateAccountRequest accountRequest = new CreateAccountRequest();
        accountRequest.setUserId(client.getId());
        accountRequest.setFirstName(client.getFirstName());
        accountRequest.setLastName(client.getLastName());
        accountRequest.setEmail(client.getEmail());
        accountRequest.setPhone(client.getPhone());

        AccountResponse accountResponse = bankServiceClient.createAccount(accountRequest);

        // Set account ID and save client
        client.setAccountId(accountResponse.getAccountId());
        client.setRole(Role.CLIENT);

        return clientRepository.save(client);
    }

    public Client updateClientStatus(Long clientId, RegistrationStatus status) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setRegistrationStatus(status);
        return clientRepository.save(client);
    }
}