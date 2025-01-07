package wav.hmed.authentication.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "clients")
public class Client extends User {
    @Column(unique = true)
    private Long accountId; // Reference to Bank service account

    @Enumerated(EnumType.STRING)
    private IdType idType;

    private String idNumber;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING;

    // Getters and setters
    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public IdType getIdType() {
        return idType;
    }

    public void setIdType(IdType idType) {
        this.idType = idType;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }
}