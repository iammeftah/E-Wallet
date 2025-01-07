package wav.hmed.authentication.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.dto.ClientDTO;
import wav.hmed.authentication.entity.Client;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.service.ClientService;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody Client client) {
        try {
            Client registeredClient = clientService.saveInitialClient(client);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredClient);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createClient(
            @RequestBody ClientDTO clientDTO,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Log the received token
            System.out.println("Received auth header: " + authHeader);

            // Extract and validate token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Invalid authorization header format");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid authorization header format");
            }

            Client createdClient = clientService.createVerifiedClient(clientDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
        } catch (Exception e) {
            System.out.println("Error creating client: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating client: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable Long id) {
        try {
            Client client = clientService.getClientById(id);
            return ResponseEntity.ok(client);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        try {
            Client updatedClient = clientService.updateClientStatus(id, RegistrationStatus.valueOf(status));
            return ResponseEntity.ok(updatedClient);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Client>> getClientsByStatus(@PathVariable String status) {
        try {
            List<Client> clients = clientService.getClientsByStatus(RegistrationStatus.valueOf(status));
            return ResponseEntity.ok(clients);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(List.of());
        }
    }
}