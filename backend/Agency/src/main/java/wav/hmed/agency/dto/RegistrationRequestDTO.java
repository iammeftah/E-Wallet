package wav.hmed.agency.dto;

import wav.hmed.agency.entity.RegistrationStatus;

public class RegistrationRequestDTO {
    private Long id;
    private Long clientId;
    private ClientDTO clientData;
    private RegistrationStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public ClientDTO getClientData() {
        return clientData;
    }

    public void setClientData(ClientDTO clientData) {
        this.clientData = clientData;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }
}
