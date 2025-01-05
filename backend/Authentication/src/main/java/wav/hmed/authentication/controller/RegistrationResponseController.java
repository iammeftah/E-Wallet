package wav.hmed.authentication.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.dto.AgentDTO;
import wav.hmed.authentication.dto.RegistrationRequest;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.service.AgentService;

@RestController
@RequestMapping("/api/registration-response")
public class RegistrationResponseController {
    private final AgentService agentService;

    public RegistrationResponseController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAgent(@RequestBody AgentDTO agentDTO) {
        Agent agent = agentService.createVerifiedAgent(agentDTO);
        return ResponseEntity.ok(agent);
    }

    @PostMapping
    public void handleRegistrationResponse(@RequestBody RegistrationRequest request) {
        agentService.updateStatus(
                request.getAgentId(),
                RegistrationStatus.valueOf(request.getStatus())
        );
    }
}