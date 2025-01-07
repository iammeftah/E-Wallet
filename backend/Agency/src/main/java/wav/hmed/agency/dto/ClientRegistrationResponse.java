package wav.hmed.agency.dto;


public class ClientRegistrationResponse {
    private Long clientId;
    private String status;

    public ClientRegistrationResponse(Long clientId, String status) {
        this.clientId = clientId;
        this.status = status;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}