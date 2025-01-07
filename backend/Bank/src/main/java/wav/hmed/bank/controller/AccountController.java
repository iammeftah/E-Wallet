package wav.hmed.bank.controller;

import wav.hmed.bank.dto.SubscriptionUpgradeRequest;
import wav.hmed.bank.entity.Account;
import wav.hmed.bank.service.AccountService;
import wav.hmed.bank.client.AuthenticationClient;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/me")
    public ResponseEntity<Account> getMyAccount(@RequestHeader("Authorization") String token) {
        Long userId = authenticationClient.getUserIdFromToken(token);
        return ResponseEntity.ok(accountService.getAccountByUserId(userId));
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