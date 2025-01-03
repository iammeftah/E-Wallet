package wav.hmed.backoffice.dto;

import lombok.Data;
import wav.hmed.backoffice.entity.RegistrationStatus;

@Data
public class RegistrationRequestDTO {
    private Long id;
    private Long agentId;
    private String agentData;
    private RegistrationStatus status;
}