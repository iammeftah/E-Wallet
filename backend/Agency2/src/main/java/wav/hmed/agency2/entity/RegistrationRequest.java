package wav.hmed.agency2.entity;

import jakarta.persistence.*;
import wav.hmed.agency2.dto.ClientDTO;

import java.time.LocalDateTime;

@Entity
@Table(name = "client_registration_requests")
public class RegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clientId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String clientType;
    private String idType;
    private String idNumber;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getClientType() {
        return clientType;
    }

    public void setClientType(String clientType) {
        this.clientType = clientType;
    }

    public String getIdType() {
        return idType;
    }

    public void setIdType(String idType) {
        this.idType = idType;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ClientDTO toClientDTO() {
        ClientDTO dto = new ClientDTO();
        dto.setId(this.clientId);
        dto.setFirstName(this.firstName);
        dto.setLastName(this.lastName);
        dto.setEmail(this.email);
        dto.setPhone(this.phone);
        dto.setClientType(this.clientType);
        dto.setIdType(this.idType);
        dto.setIdNumber(this.idNumber);
        dto.setStatus(this.status.name());
        dto.setRegistrationDate(this.createdAt);
        return dto;
    }

    public void fromClientDTO(ClientDTO dto) {
        this.clientId = dto.getId();
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.email = dto.getEmail();
        this.phone = dto.getPhone();
        this.clientType = dto.getClientType();
        this.idType = dto.getIdType();
        this.idNumber = dto.getIdNumber();
    }
}