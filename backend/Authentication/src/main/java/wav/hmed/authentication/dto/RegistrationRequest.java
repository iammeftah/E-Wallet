package wav.hmed.authentication.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import wav.hmed.authentication.entity.Agent;

public class RegistrationRequest {
    private Long agentId;
    private String status;
    private Agent agentData;

    public RegistrationRequest(Long agentId, String status, Agent agentData) {
        this.agentId = agentId;
        this.status = status;
        this.agentData = agentData;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Agent getAgentData() {
        return agentData;
    }

    public void setAgentData(Agent agentData) {
        this.agentData = agentData;
    }
}