package wav.hmed.bank.controller;

import wav.hmed.bank.dto.CreateAccountRequest;
import wav.hmed.bank.dto.AccountResponse;
import wav.hmed.bank.dto.SubscriptionUpgradeRequest;
import wav.hmed.bank.entity.Account;
import wav.hmed.bank.service.AccountService;
import wav.hmed.bank.client.AuthenticationClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;
    private final AuthenticationClient authenticationClient;

    public AccountController(AccountService accountService, AuthenticationClient authenticationClient) {
        this.accountService = accountService;
        this.authenticationClient = authenticationClient;
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@RequestBody CreateAccountRequest request) {
        Account createdAccount = accountService.createAccount(request);
        AccountResponse response = new AccountResponse(
                createdAccount.getId(),
                createdAccount.getUserId(),
                createdAccount.getBalance()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AccountResponse> getMyAccount(@RequestHeader("Authorization") String token) {
        Long userId = authenticationClient.getUserIdFromToken(token);
        Account account = accountService.getAccountByUserId(userId);
        AccountResponse response = new AccountResponse(
                account.getId(),
                account.getUserId(),
                account.getBalance()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{accountId}/upgrade-subscription")
    public ResponseEntity<Void> upgradeSubscription(
            @PathVariable Long accountId,
            @RequestBody SubscriptionUpgradeRequest request,
            @RequestHeader("Authorization") String token
    ) {
        accountService.upgradeSubscription(accountId, request.getNewPlan(), token);
        return ResponseEntity.ok().build();
    }
}