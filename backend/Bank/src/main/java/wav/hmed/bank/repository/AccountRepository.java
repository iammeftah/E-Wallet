package wav.hmed.bank.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import wav.hmed.bank.entity.Account;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUserId(Long userId);
}