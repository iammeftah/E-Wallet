package wav.hmed.bank.service;

import wav.hmed.bank.dto.CreateAccountRequest;
import wav.hmed.bank.entity.Account;
import wav.hmed.bank.entity.SubscriptionPlan;
import wav.hmed.bank.entity.Transaction;
import wav.hmed.bank.repository.AccountRepository;
import wav.hmed.bank.client.AuthenticationClient;
import wav.hmed.bank.exception.TransactionLimitExceededException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final AuthenticationClient authenticationClient;

    public AccountService(AccountRepository accountRepository, AuthenticationClient authenticationClient) {
        this.accountRepository = accountRepository;
        this.authenticationClient = authenticationClient;
    }

    @Transactional
    public Account createAccount(CreateAccountRequest request) {
        // Check if account already exists for user
        accountRepository.findByUserId(request.getUserId()).ifPresent(account -> {
            throw new RuntimeException("Account already exists for user: " + request.getUserId());
        });

        Account account = new Account();
        account.setUserId(request.getUserId());
        account.setBalance(BigDecimal.ZERO);
        account.setSubscriptionPlan(SubscriptionPlan.HSSAB1); // Set default plan

        return accountRepository.save(account);
    }


    public Account getAccountByUserId(Long userId) {
        return accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Transactional
    public void processTransaction(Transaction transaction, String token) {
        // Validate token first
        if (!authenticationClient.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        Account sender = transaction.getSenderAccount();
        Account recipient = transaction.getRecipientAccount();

        // Check subscription plan limit
        if (!isTransactionWithinLimit(sender, transaction.getAmount())) {
            throw new TransactionLimitExceededException(
                    String.format("Transaction amount %s exceeds the limit of %s for plan %s",
                            transaction.getAmount(),
                            sender.getSubscriptionPlan().getTransactionCeiling(),
                            sender.getSubscriptionPlan())
            );
        }

        // Check sufficient funds
        if (sender.getBalance().compareTo(transaction.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // Process transaction
        sender.setBalance(sender.getBalance().subtract(transaction.getAmount()));
        recipient.setBalance(recipient.getBalance().add(transaction.getAmount()));

        accountRepository.save(sender);
        accountRepository.save(recipient);
    }

    private boolean isTransactionWithinLimit(Account account, BigDecimal amount) {
        return account.getSubscriptionPlan().isTransactionAllowed(amount);
    }

    public void upgradeSubscription(Long accountId, SubscriptionPlan newPlan, String token) {
        if (!authenticationClient.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Validate upgrade path
        if (!isValidUpgrade(account.getSubscriptionPlan(), newPlan)) {
            throw new RuntimeException("Invalid subscription upgrade path");
        }

        account.setSubscriptionPlan(newPlan);
        accountRepository.save(account);
    }

    private boolean isValidUpgrade(SubscriptionPlan currentPlan, SubscriptionPlan newPlan) {
        // Only allow upgrades to higher tiers
        return newPlan.getTransactionCeiling()
                .compareTo(currentPlan.getTransactionCeiling()) > 0;
    }
}
