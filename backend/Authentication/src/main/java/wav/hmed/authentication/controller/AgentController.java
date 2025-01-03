package wav.hmed.authentication.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.clients.BackofficeClient;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.service.AgentService;

@RestController
@RequestMapping("/api/agents")
public class AgentController {
    private final AgentService agentService;
    private final BackofficeClient backofficeClient;


    public AgentController(AgentService agentService, BackofficeClient backofficeClient) {
        this.agentService = agentService;
        this.backofficeClient = backofficeClient;
    }


    @PostMapping
    public ResponseEntity<?> registerAgent(@RequestBody Agent agent) {
        Agent savedAgent = agentService.save(agent);
        backofficeClient.sendRegistrationRequest(savedAgent);
        return ResponseEntity.ok(savedAgent);
    }

    @GetMapping
    public ResponseEntity<?> getAllAgents() {
        return ResponseEntity.ok(agentService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAgent(@PathVariable Long id, @RequestBody Agent agent) {
        return ResponseEntity.ok(agentService.update(id, agent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAgent(@PathVariable Long id) {
        agentService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAgentStatus(@PathVariable Long id, @RequestBody RegistrationStatus status) {
        return ResponseEntity.ok(agentService.updateStatus(id, status));
    }
}
