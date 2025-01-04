package wav.hmed.backoffice.entity;

import jakarta.persistence.*;
import lombok.Data;
import wav.hmed.backoffice.dto.AgentDTO;

import java.time.LocalDateTime;

@Entity
@Table(name = "registration_requests")
@Data
public class RegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long agentId;

    // Instead of storing JSON, store individual fields
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String idType;
    private String idNumber;
    private String birthdate;
    private String address;
    private String immatriculation;
    private String patentNumber;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Helper method to convert to AgentDTO
    public AgentDTO toAgentDTO() {
        AgentDTO dto = new AgentDTO();
        dto.setId(this.agentId);
        dto.setFirstName(this.firstName);
        dto.setLastName(this.lastName);
        dto.setEmail(this.email);
        dto.setPhone(this.phone);
        dto.setIdType(this.idType);
        dto.setIdNumber(this.idNumber);
        dto.setBirthdate(this.birthdate);
        dto.setAddress(this.address);
        dto.setImmatriculation(this.immatriculation);
        dto.setPatentNumber(this.patentNumber);
        dto.setStatus(this.status.name());
        dto.setCreatedAt(this.createdAt);
        return dto;
    }

    // Helper method to set data from AgentDTO
    public void fromAgentDTO(AgentDTO dto) {
        this.agentId = dto.getId();
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.email = dto.getEmail();
        this.phone = dto.getPhone();
        this.idType = dto.getIdType();
        this.idNumber = dto.getIdNumber();
        this.birthdate = dto.getBirthdate();
        this.address = dto.getAddress();
        this.immatriculation = dto.getImmatriculation();
        this.patentNumber = dto.getPatentNumber();
    }
}