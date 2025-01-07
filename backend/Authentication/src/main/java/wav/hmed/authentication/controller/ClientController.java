package wav.hmed.authentication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.clients.AgencyClient;
import wav.hmed.authentication.entity.Client;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.service.ClientService;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;
    private final AgencyClient agencyClient; // New client to communicate with Agency service

    public ClientController(ClientService clientService, AgencyClient agencyClient) {
        this.clientService = clientService;
        this.agencyClient = agencyClient;
    }

    @PostMapping("/register")
    public ResponseEntity<Client> registerClient(@RequestBody Client client) {
        // Save client with PENDING status
        client.setRegistrationStatus(RegistrationStatus.PENDING);
        Client savedClient = clientService.saveInitialClient(client);

        // Send registration request to agency
        agencyClient.sendRegistrationRequest(convertToClientDTO(savedClient));

        return ResponseEntity.ok(savedClient);
    }
}