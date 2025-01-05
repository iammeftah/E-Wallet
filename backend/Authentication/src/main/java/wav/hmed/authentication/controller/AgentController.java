package wav.hmed.authentication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import wav.hmed.authentication.dto.AgentDTO;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.service.AgentService;

@RestController
@RequestMapping("/api/agents")
public class AgentController {
    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAgent(@RequestBody Agent agent) {
        return ResponseEntity.ok(agentService.registerAgent(agent));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAgent(@RequestBody AgentDTO agentDTO) {
        Agent agent = agentService.createVerifiedAgent(agentDTO);
        return ResponseEntity.ok(agent);
    }

    @GetMapping
    public ResponseEntity<?> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAgentById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getAgentById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        return ResponseEntity.ok(
                agentService.updateStatus(id, RegistrationStatus.valueOf(status))
        );
    }
}