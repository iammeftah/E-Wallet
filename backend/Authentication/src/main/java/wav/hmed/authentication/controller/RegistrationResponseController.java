package wav.hmed.authentication.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.dto.RegistrationRequest;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.service.AgentService;

@RestController
@RequestMapping("/api/registration-response")
public class RegistrationResponseController {
    private final AgentService agentService;

    public RegistrationResponseController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping
    public void handleRegistrationResponse(@RequestBody RegistrationRequest request) {
        agentService.updateStatus(
                request.getAgentId(),
                RegistrationStatus.valueOf(request.getStatus())
        );
    }
}