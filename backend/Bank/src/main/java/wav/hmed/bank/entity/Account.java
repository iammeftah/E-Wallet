package wav.hmed.bank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private BigDecimal balance;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id")  // This creates a simpler one-directional relationship
    private List<VirtualCard> virtualCards;

    @OneToMany(mappedBy = "senderAccount")
    private List<Transaction> sentTransactions;

    @OneToMany(mappedBy = "recipientAccount")
    private List<Transaction> receivedTransactions;

    @Enumerated(EnumType.STRING)
    private SubscriptionPlan subscriptionPlan;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public List<VirtualCard> getVirtualCards() {
        return virtualCards;
    }

    public void setVirtualCards(List<VirtualCard> virtualCards) {
        this.virtualCards = virtualCards;
    }

    public List<Transaction> getSentTransactions() {
        return sentTransactions;
    }

    public void setSentTransactions(List<Transaction> sentTransactions) {
        this.sentTransactions = sentTransactions;
    }

    public List<Transaction> getReceivedTransactions() {
        return receivedTransactions;
    }

    public void setReceivedTransactions(List<Transaction> receivedTransactions) {
        this.receivedTransactions = receivedTransactions;
    }

    public SubscriptionPlan getSubscriptionPlan() {
        return subscriptionPlan;
    }

    public void setSubscriptionPlan(SubscriptionPlan subscriptionPlan) {
        this.subscriptionPlan = subscriptionPlan;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}