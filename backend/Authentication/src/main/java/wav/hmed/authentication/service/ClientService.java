package wav.hmed.authentication.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wav.hmed.authentication.clients.BankServiceClient;
import wav.hmed.authentication.dto.CreateAccountRequest;
import wav.hmed.authentication.dto.AccountResponse;
import wav.hmed.authentication.dto.ClientDTO;
import wav.hmed.authentication.entity.Client;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.repository.ClientRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final BankServiceClient bankServiceClient;
    private final PasswordEncoder passwordEncoder;

    public ClientService(ClientRepository clientRepository, BankServiceClient bankServiceClient, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.bankServiceClient = bankServiceClient;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Client saveInitialClient(Client client) {
        if (clientRepository.existsByPhone(client.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        client.setRole(Role.CLIENT);
        client.setRegistrationStatus(RegistrationStatus.PENDING);
        client.setCreatedAt(LocalDateTime.now());
        return clientRepository.save(client);
    }

    @Transactional
    public Client createVerifiedClient(ClientDTO clientDTO) {
        if (clientRepository.existsByPhone(clientDTO.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }
        if (clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Client client = new Client();
        client.setFirstName(clientDTO.getFirstName());
        client.setLastName(clientDTO.getLastName());
        client.setEmail(clientDTO.getEmail());
        client.setPhone(clientDTO.getPhone());
        client.setAddress(clientDTO.getAddress());
        client.setIdType(clientDTO.getIdType());
        client.setIdNumber(clientDTO.getIdNumber());
        client.setRegistrationStatus(RegistrationStatus.ACCEPTED);
        client.setRole(Role.CLIENT);
        client.setCreatedAt(LocalDateTime.now());

        String tempPassword = generateTemporaryPassword();
        client.setPassword(passwordEncoder.encode(tempPassword));

        // TODO: Send temporary password to client via email/SMS
        System.out.println("Temporary password for " + client.getEmail() + ": " + tempPassword);

        Client savedClient = clientRepository.save(client);

        CreateAccountRequest accountRequest = new CreateAccountRequest();
        accountRequest.setUserId(savedClient.getId());
        accountRequest.setFirstName(savedClient.getFirstName());
        accountRequest.setLastName(savedClient.getLastName());
        accountRequest.setEmail(savedClient.getEmail());
        accountRequest.setPhone(savedClient.getPhone());

        AccountResponse accountResponse = bankServiceClient.createAccount(accountRequest);
        savedClient.setAccountId(accountResponse.getAccountId());

        return clientRepository.save(savedClient);
    }

    @Transactional
    public Client updateClientStatus(Long clientId, RegistrationStatus status) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));

        client.setRegistrationStatus(status);

        if (status == RegistrationStatus.ACCEPTED && client.getAccountId() == null) {
            CreateAccountRequest accountRequest = new CreateAccountRequest();
            accountRequest.setUserId(client.getId());
            accountRequest.setFirstName(client.getFirstName());
            accountRequest.setLastName(client.getLastName());
            accountRequest.setEmail(client.getEmail());
            accountRequest.setPhone(client.getPhone());

            AccountResponse accountResponse = bankServiceClient.createAccount(accountRequest);
            client.setAccountId(accountResponse.getAccountId());
        }

        return clientRepository.save(client);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
    }

    public List<Client> getClientsByStatus(RegistrationStatus status) {
        return clientRepository.findByRegistrationStatus(status);
    }

    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}